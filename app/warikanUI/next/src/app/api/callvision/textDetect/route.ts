// src/app/api/callvision/crophint/route.ts

import { detectString } from "@/app/home/register-receipt/CallvisonAPI";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import uploadReceiptToStorage from "@/app/home/register-receipt/uploadReceiptToStorage";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  await fs.writeFile(`./${file.name}`, buffer);
  console.log("ファイル書き込み完了");

  let detectText: string;

  try {
    detectText = await detectString(buffer);

    return NextResponse.json(
      { message: "success call API", detectedText: `${detectText}` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "error.details" }, { status: 500 });
  } finally {
    // ファイルを削除
    await fs.unlink(`./${file.name}`).then(() => {
      console.log("ファイル削除完了");
    });
  }
}
