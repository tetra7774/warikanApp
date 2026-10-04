"use client";

import { Box, Button, FileUpload } from "@chakra-ui/react";
import { GoUpload } from "react-icons/go";
import FileUploadList from "./imageDisplay";
import Provider, { FileUploadContext } from "./createContextProvider";
import { useContext, useState } from "react";
import { HStack, Icon, RadioCard } from "@chakra-ui/react"
import { MdOutlineCameraAlt } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";

// 👇 Contextを使う中身コンポーネント
const RegisterContent = () => {
  const ctx = useContext(FileUploadContext);
  const [isUploadMode, setUploadMode] = useState("camera"); // "camera" or "file"
  // 安全チェック（超おすすめ）
  if (!ctx) {
    throw new Error("FileUploadContext is undefined. Providerでラップされてない");
  }
  const [isUploadFile, setIsUploadFile] = ctx;

  const handleFileChange = (details: { acceptedFiles?: File[] }) => {
    const hasFiles =
      Array.isArray(details.acceptedFiles) &&
      details.acceptedFiles.length > 0;
    setIsUploadFile(hasFiles);
  };

  const items = [
    { value: "camera", title: "カメラ起動", icon: <MdOutlineCameraAlt /> },
    { value: "file", title: "写真", icon: <FaRegFileImage /> },
  ]

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="safe center"
      w="100vw"
      h="100vh"
      overflow="auto"
    >
      <FileUpload.Root
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        maxW="400px"
        p={6}
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        boxShadow="md"
        maxFiles={1}
        accept="image/*"
        {...(isUploadMode === "camera" ? { capture: "environment" } : {})}
        onFileChange={handleFileChange}
      >
        <FileUpload.HiddenInput />

        {!isUploadFile ? (
          <>
            <RadioCard.Root
              orientation="horizontal"
              align="center"
              justify="center"
              maxW="lg"
              defaultValue="camera"
              onValueChange={(details) => {
                setUploadMode(details.value === "camera" ? "camera" : "file");
              }}
            >
              <RadioCard.Label>モードの選択</RadioCard.Label>
              <HStack align="stretch">
                {items.map((item) => (
                  <RadioCard.Item key={item.value} value={item.value}>
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl>
                      <Icon fontSize="2xl" color="fg.subtle" mr={2}>
                        {item.icon}
                      </Icon>
                      <RadioCard.ItemText ms="-4">{item.title}</RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>
            <FileUpload.Trigger asChild>
              <Button variant="outline" size="md" w="100%">
                <GoUpload />
                &nbsp;Upload Images
              </Button>
            </FileUpload.Trigger>
          </>
        ) : (
          <>
            <FileUploadList />
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadFile(false)}
            >
              Reset
            </Button>
          </>
        )}
      </FileUpload.Root>
    </Box >
  );
};

// 👇 Providerでラップする外側
const Page = () => {
  return (
    <Provider>
      <RegisterContent />
    </Provider>
  );
};

export default Page;