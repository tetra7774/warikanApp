import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    console.log("🔥 DELETE API called");
    console.log("ID:", params.id);
    console.log("APIENDPOINT:", process.env.APIENDPOINT);
    console.log("Full URL:", `${process.env.APIENDPOINT}/receipt/${params.id}`);
    const res = await fetch(`${process.env.APIENDPOINT}/receipt/${params.id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("❌ External API error:", res.status, text);

        return new Response(
            JSON.stringify({
                error: "Failed to delete receipt",
                status: res.status,
                detail: text
            }),
            { status: res.status }
        );
    }
    return new Response(null, { status: 204 });
}