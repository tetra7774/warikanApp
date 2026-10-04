import uploadReceiptToStorage from "@/app/home/register-receipt/uploadReceiptToStorage";
import createDateString from "@/common/date";
import { NextRequest } from "next/server";
import * as common from "oci-common";
import * as os from "oci-objectstorage";


export async function POST(request: NextRequest) {

    //日付取得(yyyymm)
    const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // JSTに変換
    const today = new Date(Date.now() + JST_OFFSET_MS);
    const yyyymm = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;

    const authenticationProvider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    const client = new os.ObjectStorageClient({ authenticationDetailsProvider: authenticationProvider });
    client.regionId = "ap-osaka-1";

    // OCI Object StorageのNamespaceの取得
    console.log("Getting the namespace...");
    const ossrequest: os.requests.GetNamespaceRequest = {};
    const response = await client.getNamespace(ossrequest);
    const namespace = response.value;

    // フォームデータの取得
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    // ファイル(レシートイメージ)のUint8Array化
    const buffer = new Uint8Array(arrayBuffer);

    // OCIのCloud Storageにレシート画像をアップロード
    const res = await uploadReceiptToStorage(buffer, `receipts/${yyyymm}/${file.name}`);
    if (res.status !== 200) {
        return new Response(`Error uploading file: ${res.message}`, { status: 500 });
    }

    // Receipt APIへ渡すためのデータ準備
    // レシートのテキストデータ取得
    let text;
    try {
        text = JSON.parse(formData.get("text") as string);
    } catch (error) {
        console.error("Error parsing text data:", error);
        return new Response("Invalid text data format", { status: 400 });
    }
    // 登録日の生成
    const FToday = createDateString(today);
    // 画像URLの生成
    const bucketName = "receipt-image-storage"; // OCI Object StorageのBucket名
    const imageUrl = `https://objectstorage.ap-osaka-1.oraclecloud.com/n/${namespace}/b/${bucketName}/o/receipts/${yyyymm}/${file.name}`
    // 作成者IDの取得
    const createdBy = formData.get("nameId") as string;
    // レシートデータのUpdate有無(新規作成のためfalse固定)
    const isUpdated = false;

    // Bodyの生成
    const body = {
        register_date: FToday,
        totalAmount: text.total,
        imageUrl,
        createdBy,
        isUpdated,
        items: text.items,
    };

    // Receipt APIの呼び出し
    const apiRes = await fetch(`${process.env.APIENDPOINT}/receipt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (!apiRes.ok) {
        const errorText = await apiRes.text();
        console.error("Receipt API error:", errorText);
        return new Response(`Error saving receipt: ${errorText}`, { status: 500 });
    }

    const apiResText = await apiRes.json();



    return new Response(JSON.stringify({ message: "Receipt processed successfully" }), { status: 200 });
}


