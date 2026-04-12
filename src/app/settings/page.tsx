"use client"
import { usePlayer } from "@/contexts/PlayerContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/app/actions/room"


export default function Settings() { 
  const [timeLimit, setTimeLimit] = useState("none");
  const [players, setPlayers] = useState("2");
  const { playerName, setPlayerName } = usePlayer();
  const router = useRouter();

  const buildRoom = async () => {
    const data = await createRoom({ playerName, players, timeLimit });
    if ("error" in data) {
      alert(data.error);
      return;
    }
    router.push(`/game/${data.roomId}`);
  };


  return (
    <>
      <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
      <div>{playerName}さん</div>
      <select value={players} onChange={(e) => setPlayers(e.target.value)}>
        <option value="2">2人</option>
        <option value="3">3人</option>
        <option value="4">4人</option>
      </select>
      <label>
        <input type="radio" name="timeLimit" value="none"
          checked={timeLimit === "none"}
          onChange={(e) => setTimeLimit(e.target.value)}
        /> なし
        <input type="radio" name="timeLimit" value="3"
          checked={timeLimit === "3"}
          onChange={(e) => setTimeLimit(e.target.value)}
        /> 3分
        <input type="radio" name="timeLimit" value="5"
          checked={timeLimit === "5"}
          onChange={(e) => setTimeLimit(e.target.value)}
        /> 5分
      </label>
      <button
        onClick={() => {
          buildRoom();
        }}>
        ルーム作成
      </button>
    </>
  );
}


