// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN =
  "EAAKUZBkWOn8gBO1BE7sJf8hMERwD7ZBaLDyXwRm4JprZBmcKnYyWE1f95lSixa2fBxCJpgxdScHUV6U4oRUYZCEAV1PT454HwVSb0Mi932ZBGcvHYe3A8pdVLtjYHLltL21UGsPKZBzRuTUENGV0cDAP8eMjNqmTTrLBo2j19uc92o4XRtMr9ZCcaqnHoPqMKy6CBCR3Ixsk5ZBGHF03GFTuZCS4vagZDZD"; // must match what you enter in Facebook webhook config

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge || "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📨 Webhook Received:", JSON.stringify(body, null, 2));

    if (body.object === "page") {
      for (const entry of body.entry ?? []) {
        for (const event of entry.messaging ?? []) {
          const senderId = event.sender?.id;
          const messageText = event.message?.text;

          console.log(`🔔 Message from ${senderId}: ${messageText}`);

          // You could add reply logic here using the Send API
        }
      }
    }

    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("❌ Error in webhook POST:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
