import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("ルーム作成リクエスト:", body);

  return NextResponse.json({
    roomId: Math.random().toString(36).slice(2, 8),
    ...body,
  });
}
