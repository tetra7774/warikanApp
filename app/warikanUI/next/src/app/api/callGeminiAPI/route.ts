// 価格参考：https://shift-ai.co.jp/blog/20257/
// 価格参考：https://cloud.google.com/vertex-ai/generative-ai/docs/start/gcp-auth?hl=ja

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLEGENAI_API_KEY!,
    });

    const body = await request.json();
    console.log("API called with text:", body);
    const receiptText = body.text as string;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `Read the text from the following receipt. 
      #text
      ${receiptText}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        total: { type: "INTEGER" },
                        items: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    name: { type: "STRING" },
                                    price: { type: "INTEGER" },
                                    quantity: { type: "INTEGER" },
                                    isReducedTax: { type: "BOOLEAN" },
                                },
                                required: ["name", "price", "quantity", "isReducedTax"],
                            },
                        },
                    },
                    required: ["total", "items"],
                    propertyOrdering: ["total", "items"],
                },
            },
        });

        return NextResponse.json({
            result: response.text,
        });
    } catch (error: any) {
        return NextResponse.json({ message: "error.details" }, { status: 500 });
    }


}