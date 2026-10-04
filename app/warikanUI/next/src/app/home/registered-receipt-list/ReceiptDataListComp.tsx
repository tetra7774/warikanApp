"use client";

import { TReceipt } from "@/types/reciept";
import { Box, Stack, Wrap, WrapItem, Image, Text, Flex, Heading, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import ReceiptDeleteDialog from "./ReceiptDeleteDialog";

export function ReceiptDataListComp({ receiptList, displyMonth }: { receiptList: TReceipt[]; displyMonth: string }) {
    useEffect(() => {
        console.log('client env NEXT_PUBLIC_SPECIFIEDLINEUSER1:', process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1);
        console.log('client env NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME:', process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME);
        console.log('client env NEXT_PUBLIC_SPECIFIEDLINEUSER2:', process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2);
        console.log('client env NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME:', process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME);

        const filtered = receiptList.filter((thisMonthReceipt) => thisMonthReceipt.register_date.includes(`${displyMonth}`));
        filtered.forEach((receipt) => {
            console.log('receipt.createdBy:', receipt.createdBy);
        });
    }, [displyMonth, receiptList]);

    return (
        <>
            <Wrap gap="10px" justify={"center"} padding={"20px"} >


                {receiptList.filter(thisMonthReceipt => thisMonthReceipt.register_date.includes(`${displyMonth}`)).map((receipt) => (
                    <WrapItem key={receipt.id}>
                        <Box
                            bg={"white"}
                            borderRadius={"lg"}
                            width={"240px"}
                            shadow={"md"}
                            pt={"15px"}
                            _hover={{ cursor: "pointer", opacity: 0.8 }}
                        >
                            <Stack textAlign={"center"}>
                                <Image
                                    src={receipt.imageUrl}
                                    alt="レシート画像"
                                    height={"220px"}
                                    width={"180px"}
                                    margin={"auto"}
                                />
                                
                                <Text>
                                    {`登録者：
                  ${receipt.createdBy === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1
                                            ? process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME
                                            : receipt.createdBy === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2
                                                ? process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME
                                                : "未登録ユーザ"
                                        }`
                                    }
                                </Text>
                                <Text>{`更新日：${receipt.register_date}`}</Text>
                                <Text>{`金額：${receipt.totalAmount}`}</Text>
                                {/* <Spacer /> */}

                                <ReceiptDeleteDialog receipt={receipt} />

                                <Flex justifyContent={"space-around"} mb={"10px"}>
                                    {/* <CustomButton text={"更新"} onClick={function (): void {
                  throw new Error("Function not implemented.");
                }}></CustomButton> */}

                                </Flex>
                            </Stack>
                        </Box>
                    </WrapItem>
                ))}
            </Wrap>
        </>
    )
}