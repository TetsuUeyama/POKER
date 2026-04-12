"use server";
import { z } from "zod/v4";

  const schema = z.object({
    playerName: z.string().min(1), // 文字列で、1文字以上
    players: z.enum(["2", "3", "4"]), // "2", "3", "4" のどれか
    timeLimit: z.enum(["none", "3", "5"]), // "none", "3", "5" のどれか
  });

export async function createRoom(data: { playerName: string; players: string; timeLimit: string }) {
  console.log("ルーム作成リクエスト:", data);
  const validatedData = schema.safeParse(data);
  
  if (!validatedData.success) {
    return {error: "入力が正しくありません"};
  }
    return {
      roomId: Math.random().toString(36).slice(2, 8),
      ...validatedData.data,
    };
}