import { ReceiptDataList } from "@/app/home/registered-receipt-list/ReceiptDataList"; // クライアントコンポーネント
import { TReceipt } from "@/types/reciept";


async function fetchReceiptList(): Promise<TReceipt[]> {
  // APIからレシート一覧を取得
  const apires = await fetch(`${process.env.APIENDPOINT}/receipt?size=100`, {
    cache: "no-cache",
  }).then((res) => res.json());
  console.log("APIから取得したレシート一覧:");
  console.log(apires);
  // レシートデータの整形
  const receiptDatas = apires.results;
  const response = receiptDatas.map((receipt: TReceipt) => ({ ...receipt }));
  return response;
}


export default async function Page() {
  const receiptList = await fetchReceiptList();

  return <ReceiptDataList receiptList={receiptList} />;
}
