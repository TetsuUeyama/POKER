"use client"
import { Action } from "@/types/game";
import { useState } from "react";

type Props = {
  action: Action;
  onDropCard?: (cardIndex: number) => void;
  onRemove?: () => void;
  onActivate?: () => void;
  isBattling?: boolean;
};

export default function ActionSlot({ action, onDropCard, onRemove, onActivate, isBattling }: Props) {
  const [isOver, setIsOver] = useState(false);

  const actionName: Record<string, string> = {
    shoot: "射撃 ♠",
    punch: "拳撃 ♣",
    dash: "突進 ♦",
    guard: "防御 ♥",
  };

  const isReady = action.currentCool <= 0 && isBattling;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const idx = Number(e.dataTransfer.getData("card-index"));
        onDropCard?.(idx);
      }}
      className={`
        w-28 p-2 rounded-lg border-2 text-center text-sm
        ${isReady ? "border-green-400 bg-green-900/40" : isOver ? "border-yellow-400 bg-yellow-900/40" : "border-zinc-600 bg-zinc-800"}
      `}
    >
      <div className="text-white">
        <div className="font-bold">{actionName[action.type]}</div>
        <div>威力: {action.power}</div>
        {/* チャージバー */}
        <div className="w-full h-2 bg-zinc-700 rounded overflow-hidden mt-1">
          <div
            className={`h-full ${action.currentCool <= 0 && isBattling ? "bg-green-400" : "bg-cyan-400"}`}
            style={{ width: `${(1 - action.currentCool / action.cooldown) * 100}%` }}
          />
        </div>
        {!isBattling ? (
          <div onClick={onRemove} className="text-[10px] text-zinc-400 cursor-pointer mt-1">
            CD: {action.cooldown}秒 (クリックで戻す)
          </div>
        ) : (
          <div className="text-[10px] text-zinc-400 mt-1">
            CD: {action.currentCool.toFixed(1)}秒
          </div>
        )}
      </div>
    </div>
  );
}
