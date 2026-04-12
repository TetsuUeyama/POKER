import { CardType } from "@/types/cards";
import { judgeHand } from "@/utils/poker";
import { useMemo, useRef, useState } from "react";

const suits = ["♠", "♥", "♦", "♣"];
const ranks = Array.from({ length: 13 }, (_, i) => (i + 1).toString());
const defaultCards: CardType[] = suits.flatMap((suit) => ranks.map((rank) => ({suit, rank})));

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function usePokerHand() {
  const [nowCards, setNowCards] = useState<CardType[]>(defaultCards);
  const countRef = useRef(0);
  const [count, setCount] = useState(0);
  
  const shuffle = () => {
    setNowCards(shuffleArray(nowCards));
    countRef.current += 1;
    setCount((prev) => prev + 1);
    console.log("シャッフル回数:", countRef.current);
  };

  const handRank = useMemo(() => judgeHand(nowCards.slice(0, 5)), [nowCards]);
  

  return {hand: nowCards.slice(0, 5), handRank, count, shuffle};
}
