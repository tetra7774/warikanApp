"use client";

import { Heading, VStack, NativeSelect} from "@chakra-ui/react";
import { useState } from "react"
import { TReceipt } from "@/types/reciept";
import { ReceiptDataListComp } from "./ReceiptDataListComp";


export function ReceiptDataList({ receiptList }: { receiptList: TReceipt[] }) {

  const [disPlayFilter, setDisplayFilter] = useState("")

  const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // JSTに変換
  const today = new Date(Date.now() + JST_OFFSET_MS);
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const thisMonth = `${year}-${month.toString().padStart(2, '0')}`;
  const lastMonth = `${year}-${(month - 1).toString().padStart(2, '0')}`;

  // フィルターの条件に応じてレシートリストを絞り込む
  let filteredReceiptList: TReceipt[] = receiptList;
  let thisMonthTotalAmount: number | undefined = 0;
 
  if (disPlayFilter === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME) {
    filteredReceiptList = receiptList.filter(receipt => receipt.createdBy === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1);
    thisMonthTotalAmount = filteredReceiptList.filter(receipt => receipt.register_date.includes(`${thisMonth}`)).reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  } else if (disPlayFilter === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME) {
    filteredReceiptList = receiptList.filter(receipt => receipt.createdBy === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2);
    thisMonthTotalAmount = filteredReceiptList.filter(receipt => receipt.register_date.includes(`${thisMonth}`)).reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  } else {
    thisMonthTotalAmount = receiptList.filter(receipt => receipt.register_date.includes(`${thisMonth}`)).reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  }

  return (
    <>
      <VStack m={"20px"}>

        {/* フィルターのセレクター */}
        <NativeSelect.Root size="sm" width="240px">
          <NativeSelect.Field
            placeholder="filter by user"
            value={disPlayFilter}
            onChange={(e) => setDisplayFilter(e.currentTarget.value)}
          >
            <option value="しょうき">しょうき</option>
            <option value="さおり">さおり</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        {/* レシートリスト(今月分)の表示 */}
        <Heading size={{ base: "2xl", md: "4xl" }}>
          {disPlayFilter === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME ? `${process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1_NAME}さんの` : disPlayFilter === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME ? `${process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2_NAME}さんの` : ""}
          {`${year}年${month}月登録のレシート`}
        </Heading>
        <Heading size={{ base: "xl", md: "2xl" }}> 合計: {thisMonthTotalAmount?.toLocaleString()}円</Heading>
        <ReceiptDataListComp receiptList={filteredReceiptList} displyMonth={thisMonth} />

        {/* レシートリスト(先月分)の表示 */}
        <Heading size={{ base: "2xl", md: "4xl" }}>先月登録したレシート</Heading>
        <ReceiptDataListComp receiptList={filteredReceiptList} displyMonth={lastMonth} />
      </VStack>
    </>

  );
}
