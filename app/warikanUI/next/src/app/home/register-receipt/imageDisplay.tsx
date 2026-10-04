"use client";

import {
  FileUpload,
  Float,
  useFileUploadContext,
  Stack,
  NumberInput,
  HStack,
  IconButton,
  Box,
  Text,
  Accordion,
} from "@chakra-ui/react";
import { FC, useState, useContext } from "react";
import { LuMinus, LuPlus, LuX } from "react-icons/lu";
import { FileUploadContext } from "./createContextProvider";
import CustomButton from "@/components/atoms/Button";
import { SessionContext } from "@/app/ClientGetSession";
import { Toaster, toaster } from "@/components/ui/toaster"
import { useRouter } from 'next/navigation'


//
// GCPのTextDetect APIを呼び出す関数
//
const callTextDetect = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  let res;
  try {
    res = await fetch("/api/callvision/textDetect", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Vision API error: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error in callTextDetect:", error);
    throw error;
  }
};

// ストレージにレシートデータを保存するAPIを呼び出す関数
const callStorageReceiptAPI = async (file: File, resultText: string, nameId: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", resultText);
    formData.append("nameId", nameId);

    const res = await fetch("/api/callcustomapi/receipt", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Receipt API error:", errorText);
      throw new Error(errorText);
    }

    return { message: "OK" };
  } catch (error) {
    console.error("Error in callReceiptAPI:", error);
    throw error;
  }
};

//
// 型定義
//
type ReceiptItem = {
  name: string;
  price: number;
  quantity: number;
  isReducedTax: boolean;
};

type ReceiptOutput = {
  total: number;
  items: ReceiptItem[];
};

//
// コンポーネント
//
const FileUploadList: FC = () => {
  // セッション情報の取得
  const session = useContext(SessionContext);
  // routerの取得
  const router = useRouter();

  // Contextからアップロード状態を取得
  const fileUploadContext = useContext(FileUploadContext);
  if (!fileUploadContext) {
    throw new Error("FileUploadContext is not provided. Make sure FileUploadList is rendered inside FileUploadContext.Provider.");
  }
  const [isUploadFile, setIsUploadFile] = fileUploadContext;
  // API呼び出し中の状態管理
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  // レシート解析結果の状態管理
  const [resultText, setResultText] = useState<ReceiptOutput | null>(null);
  // FileUploadのコンテキストを取得(ファイルは画像かつ1つのみの制御済み)
  const fileUpload = useFileUploadContext();
  const files = fileUpload.acceptedFiles;
  if (files.length === 0) return null;
  const file = files[0];

  return (
    <>
      {/* プレビュー画面 */}
      <FileUpload.ItemGroup
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100%"
      >
        <FileUpload.Item
          w="200px"
          h="200px"
          p="4"
          borderWidth="1px"
          borderRadius="md"
          file={file}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FileUpload.ItemPreviewImage
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />

          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger asChild>
              <IconButton
                size="sm"
                aria-label="削除"
                onClick={() => {
                  setIsUploadFile(false);
                  setResultText(null);
                }}
              >
                <LuX />
              </IconButton>
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      </FileUpload.ItemGroup>

      {/* ボタン */}
      {isUploadFile && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="2"
        >
          {
            !resultText &&
            <CustomButton
              disabled={resultText !== null}
              text="アップロード"
              onClick={async () => {
                setIsCallingAPI(true);

                let detectedText;
                try {
                  detectedText = await callTextDetect(file);
                } catch (error) {
                  console.error("Error in callTextDetect:", error);
                  toaster.create({
                    description: "画像のテキスト検出に失敗しました。",
                    type: "error",
                  });
                  setIsCallingAPI(false);
                  return;
                }
                let receiptData = await fetch("/api/callGeminiAPI", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ text: detectedText.detectedText }),
                })
                  .then((res) => res.json())
                  .then((data) => data.result)
                  .catch((error) => {
                    console.error("Error in callGeminiAPI:", error);
                    toaster.create({
                      description: "レシート解析に失敗しました。画像が鮮明か確認してください。",
                      type: "error",
                    });
                    return undefined;
                  });

                if (receiptData === undefined) {
                  setResultText(null);
                  setIsCallingAPI(false);
                  return;
                }

                let parsedResult: ReceiptOutput;
                try {
                  parsedResult = JSON.parse(receiptData);
                } catch (parseError) {
                  console.error("Error parsing Gemini response:", parseError);
                  toaster.create({
                    description: "レシート解析結果の形式が不正です。",
                    type: "error",
                  });
                  setResultText(null);
                  setIsCallingAPI(false);
                  return;
                }

                setResultText(parsedResult);

                setIsCallingAPI(false);
              }}
            />
          }

          {
            resultText && // 確定ボタン
            <>
              <CustomButton text="確定" onClick={async () => {
                try {
                  //const apiRes = await callStorageReceiptAPI(file, JSON.stringify(resultText), 'U0f136ca320c760a273a3d1e21d5365a2');
                  const apiRes = await callStorageReceiptAPI(file, JSON.stringify(resultText), session?.user.id);
                  if (apiRes.message === "OK") {
                    toaster.create({
                      description: "レシートの登録が完了しました。",
                      type: "success",
                    })
                    // 登録完了後、レシート一覧へ遷移
                    router.push('/home/registered-receipt-list');
                  } else {
                    toaster.create({
                      description: "レシートの登録に失敗しました。",
                      type: "error",
                    });
                  }
                } catch (error) {
                  console.error("Registration failed:", error);
                  toaster.create({
                    description: "レシートの登録に失敗しました。再度お試しください。",
                    type: "error",
                  });
                }
              }} />
              <Toaster />


            </>



          }
        </Box>
      )}

      {/* 結果 */}
      {resultText && (
        <Box
          mt="6"
          mx="auto"
          w="100%"
          maxW="500px"
          borderWidth="1px"
          borderRadius="md"
          p="4"
          bg="white"
          boxShadow="sm"
        >
          <Text fontWeight="bold" fontSize="lg" mb="4">
            合計金額: {resultText.total}
          </Text>

          <Accordion.Root collapsible>
            {resultText.items.map((item, index) => (
              <Accordion.Item key={index} value={index.toString()}>
                <Accordion.ItemTrigger>
                  <HStack justifyContent="space-between" w="100%">
                    <Text>{item.name}</Text>
                    <Accordion.ItemIndicator />
                  </HStack>
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Stack mt="2" pl="4">
                    <Accordion.ItemBody>
                      購入数：
                      <NumberInput.Root
                        value={item.quantity.toString()}
                        min={0}
                        onValueChange={(value) => {
                          const newquantity = value.valueAsNumber;
                          setResultText((prev) => {
                            if (!prev) return prev;
                            const updatedItems = prev.items.map(
                              (previtem, ix) =>
                                ix === index
                                  ? { ...previtem, quantity: newquantity }
                                  : previtem
                            );
                            const updatedTotal =
                              prev.total +
                              (newquantity - item.quantity) * item.price;
                            return {
                              total: updatedTotal,
                              items: updatedItems,
                            };
                          });
                        }}
                      >
                        <HStack gap="2">
                          <NumberInput.DecrementTrigger asChild>
                            <IconButton variant="outline" size="sm">
                              <LuMinus />
                            </IconButton>
                          </NumberInput.DecrementTrigger>
                          <NumberInput.ValueText
                            textAlign="center"
                            fontSize="md"
                            minW="2ch"
                          />
                          <NumberInput.IncrementTrigger asChild>
                            <IconButton variant="outline" size="sm">
                              <LuPlus />
                            </IconButton>
                          </NumberInput.IncrementTrigger>
                        </HStack>
                      </NumberInput.Root>
                    </Accordion.ItemBody>

                    <Accordion.ItemBody>単価：{item.price}</Accordion.ItemBody>

                    <Accordion.ItemBody>
                      軽減税率：{item.isReducedTax ? "適用" : "非適用"}
                    </Accordion.ItemBody>
                  </Stack>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Box>
      )}
    </>
  );
};

export default FileUploadList;
