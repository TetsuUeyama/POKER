"use client";
import Card from "@/components/Card";
import Hand from "@/components/Hand";
import Link from "next/link";
import { usePokerHand } from "@/hooks/usePokerHand";
import { usePlayer } from "@/contexts/PlayerContext";

export default function Home() {
  const { hand, handRank, count, shuffle } = usePokerHand();
  const { playerName, setPlayerName } = usePlayer();
  

  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
        <div>{playerName}さん</div>
      将棋×ポーカー
        <Hand>
          {hand.map((card, i) => (
            <Card
              key={i}
              suit={card.suit}
              rank={card.rank}
            />  
          ))}
        </Hand>
        <button
          onClick={() => {
            shuffle();
          }}>
          シャッフル
        </button>
        <div>{handRank}</div>
        <div>{count}</div>
      </div>
      <Link href="/rules">
        ルールを見る
      </Link>   
    </>
  );
}
