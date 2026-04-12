"use client"
import { usePlayer } from "@/contexts/PlayerContext";
import { use, useState  } from "react";

export default function GameRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [buttonClicked, setButtonClicked] = useState(false);
  const { playerName } = usePlayer();

  return (
    <div>
      {playerName}さんのゲームルーム: {roomId}
      <button onClick={() => setButtonClicked(true)}>
        {buttonClicked ? "準備完了！" : "準備中..."}
      </button>
    </div>
  );
}