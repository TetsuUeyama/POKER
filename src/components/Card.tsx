
type CardProps = {
  suit: string;
  rank: string;
}

export default function Card({ suit, rank }: CardProps)
{
  const isRed = suit === "♥" || suit === "♦";
  const rankDisplay: Record<string, string> = {                                                 
    "1": "A", "11": "J", "12": "Q", "13": "K",                                                  
  };
  const displayRank = rankDisplay[rank] ?? rank;
  
  return (
    <div
      className={`
    w-20 h-28 flex flex-col items-center justify-center
    bg-white border rounded-lg text-2xl font-bold p-2 shadow-md
    ${isRed ? "text-red-500" : "text-black"}
  `}>
      {suit} {displayRank}
    </div>
  );
}