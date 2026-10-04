import vision from "@google-cloud/vision";


// export async function detectString(fileName: string): Promise<string> {
export async function detectString(imageUint8Array: Uint8Array): Promise<string> {

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  if (!imageUint8Array) {
    throw new Error("File name is required for text detection.");
  }
  const [result_text] = await client.textDetection(
    {
      image: {
        content: imageUint8Array
      },
      imageContext: {
        languageHints: ["ja"],
      },
    }
  );
  console.log("Text detection result:", result_text.fullTextAnnotation!.text);
  return result_text.fullTextAnnotation!.text || "No text detected";
}

