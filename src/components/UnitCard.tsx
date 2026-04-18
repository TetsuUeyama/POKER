"use client"
import { Unit } from "@/types/game";
import { useState } from "react";


type CardProps = {
  unit: Unit;
  onDropCard?: (cardIndex: number) => void;
  onReturnCard?: (assignedIndex: number) => void;
    
}
  
function displayRank(rank: string): string {                                                                                                                                            const rankDisplay: Record<string, string> = {
      "1": "A", "11": "J", "12": "Q", "13": "K",                                                                                                                                      
    };
    return rankDisplay[rank] ?? rank;
  }

export default function UnitCard({ unit, onDropCard, onReturnCard }: CardProps)
{
  const [isOver, setIsOver] = useState(false);
  
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        const idx = Number(e.dataTransfer.getData("card-index"));
        onDropCard?.(idx);
        setIsOver(false);
      }}
      className={`
        p-4
        rounded-xl
        ${isOver ? "bg-yellow-200" : "bg-gray-200"}
        border-2 border-gray-400
        w-48
        text-center
      `}
    >
      <div className="font-bold text-lg mb-2 text-gray-800">
        <div>{unit.def.name}</div>
        <div>
          <span className={unit.currentHp > unit.def.baseHp ? "text-green-400" : ""}>
            HP {unit.currentHp}/{unit.maxHp}
          </span>
        </div>
        <div>
          <span  className={unit.atk > unit.def.baseAtk ? "text-green-400" : ""}>
            ATK {unit.atk}
          </span>
          <span className={unit.defense > unit.def.baseDef ? "text-green-400" : ""}>
            DEF {unit.defense}
          </span>
          <span className={unit.spd > unit.def.baseSpd ? "text-green-400" : ""}>
            SPD {unit.spd}
          </span>
          <div className="flex gap-1 justify-center mt-1">
            {unit.assignedCards.map((c, i) => (
              <span onClick={() => onReturnCard?.(i)} key={i} className="text-[10px] bg-white text-black rounded px-1">
                {c.suit}{displayRank(c.rank)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}