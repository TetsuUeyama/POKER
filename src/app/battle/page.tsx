"use client";
import Card from "@/components/Card";
import ActionSlot from "@/components/game/ActionSlot";
import BattleField from "@/components/game/BattleField";
import { useState, useEffect, useRef } from "react";
import { CardType } from "@/types/cards";
import { Action, Phase } from "@/types/game";
import { rankToBoost } from "@/logic/strengthen";

function createShuffledDeck(): CardType[] {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = Array.from({ length: 13 }, (_, i) => (i + 1).toString());
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// 最初から5つのアクションが決まっている
const DEFAULT_ACTIONS: Action[] = [
  { type: "shoot", power: 3, cooldown: 2, currentCool: 0 },
  { type: "punch", power: 3, cooldown: 3, currentCool: 0 },
  { type: "dash",  power: 3, cooldown: 2, currentCool: 0 },
  { type: "guard", power: 3, cooldown: 4, currentCool: 0 },
  { type: "shoot", power: 3, cooldown: 2, currentCool: 0 },
];

export default function BattlePage() {
  const deckRef = useRef<CardType[]>([]);
  const [hand, setHand] = useState<(CardType | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("assign");
  const [round, setRound] = useState(1);
  const [deckIndex, setDeckIndex] = useState(5);
  const [isBattling, setIsBattling] = useState(false);
  const [battleTimer, setBattleTimer] = useState(0);

  // 行動スロット5つ（最初からアクションが入っている）
  const [actions, setActions] = useState<Action[]>(DEFAULT_ACTIONS.map((a) => ({ ...a })));
  // どのスロットにカードを置いたか（戻す用）
  const [slotCards, setSlotCards] = useState<(CardType | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    const newDeck = createShuffledDeck();
    deckRef.current = newDeck;
    setHand(newDeck.slice(0, 5));
  }, []);

  // 手札からスロットにカードを置いてアクションを強化
  function handleDropToSlot(slotIndex: number, cardIndex: number) {
    const card = hand[cardIndex];
    if (!card) return;
    if (slotCards[slotIndex] !== null) return; // 既にカードが置かれている

    const boost = rankToBoost(card.rank);
    const newActions = [...actions];
    newActions[slotIndex] = { ...actions[slotIndex], power: actions[slotIndex].power + boost };
    setActions(newActions);

    const newSlotCards = [...slotCards];
    newSlotCards[slotIndex] = card;
    setSlotCards(newSlotCards);

    setHand(hand.map((c, i) => i === cardIndex ? null : c));
  }

  // スロットからカードを手札に戻す（強化を取り消す）
  function handleRemoveFromSlot(slotIndex: number) {
    const card = slotCards[slotIndex];
    if (!card) return;

    const boost = rankToBoost(card.rank);
    const newActions = [...actions];
    newActions[slotIndex] = { ...actions[slotIndex], power: actions[slotIndex].power - boost };
    setActions(newActions);

    const newSlotCards = [...slotCards];
    newSlotCards[slotIndex] = null;
    setSlotCards(newSlotCards);

    const newHand = [...hand];
    const emptyIndex = newHand.indexOf(null);
    newHand[emptyIndex] = card;
    setHand(newHand);
  }

  // アクション発動（CDリセット）
  function handleActivateAction(slotIndex: number) {
    setActions((prev) => prev.map((a, i) => {
      if (i === slotIndex && a.currentCool <= 0) {
        return { ...a, currentCool: a.cooldown };
      }
      return a;
    }));
  }

  // アクションからステータスを計算（BattleField に渡す）
  const playerTotalStats = {
    spd: actions.reduce((sum, a) => sum + (a.type === "dash" ? a.power : 0), 6),
    atk: actions.reduce((sum, a) => sum + (a.type === "shoot" || a.type === "punch" ? a.power : 0), 6),
    def: actions.reduce((sum, a) => sum + (a.type === "guard" ? a.power : 0), 6),
  };
  const enemyTotalStats = { spd: 8, atk: 8, def: 8 };

  function handleConfirmAssign() {
    let idx = deckIndex;
    const newHand = hand.map((c) => {
      if (c !== null) return c;
      const card = deckRef.current[idx];
      idx++;
      return card;
    });
    setHand(newHand);
    setDeckIndex(idx);
    setPhase("battle");
    setIsBattling(true);
    // CDを満タンからスタート（全アクション溜め直し）
    setActions((prev) => prev.map((a) => ({ ...a, currentCool: a.cooldown })));

    const interval = setInterval(() => {
      // バトルタイマー更新
      setBattleTimer((prev) => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsBattling(false);
          setPhase("assign");
          setRound((r) => r + 1);
          // スロットをリセット（カードは消える、アクションは初期値に戻る）
          setActions(DEFAULT_ACTIONS.map((a) => ({ ...a })));
          setSlotCards([null, null, null, null, null]);
          return 0;
        }
        return prev + 0.1;
      });

      // アクションのクールダウン更新（0で止まる、発動はBattleFieldが判断）
      setActions((prev) => prev.map((a) => {
        if (a.currentCool <= 0) return a;
        return { ...a, currentCool: Math.max(0, a.currentCool - 0.1) };
      }));
    }, 100);
  }

  return (
    <div className="flex flex-col items-center h-screen bg-zinc-900 text-white p-4 gap-4">

      {/* ラウンド表示 */}
      <div className="text-lg">ラウンド {round}</div>

      {/* 3Dフィールド */}
      <BattleField
        isBattling={isBattling}
        playerStats={playerTotalStats}
        enemyStats={enemyTotalStats}
        battleTimer={battleTimer}
        actions={actions}
        onActionUsed={handleActivateAction}
      />

      {/* 行動スロット */}
      <div className="flex gap-2">
        {actions.map((action, i) => (
          <ActionSlot
            key={i}
            action={action}
            onDropCard={(cardIndex) => handleDropToSlot(i, cardIndex)}
            onRemove={() => handleRemoveFromSlot(i)}
            onActivate={() => handleActivateAction(i)}
            isBattling={isBattling}
          />
        ))}
      </div>

      {/* 手札 */}
      <div className="flex gap-2">
        {hand.map((card, i) => (
          card ? (
            <Card key={i} suit={card.suit} rank={card.rank} draggable={phase === "assign"} index={i} />
          ) : (
            <div key={i} className="w-20 h-28 border-2 border-dashed border-zinc-600 rounded-lg" />
          )
        ))}
      </div>

      {/* 決定ボタン */}
      <button
        onClick={handleConfirmAssign}
        disabled={phase !== "assign"}
        className={`px-4 py-2 rounded ${phase !== "assign" ? "opacity-30 cursor-not-allowed bg-zinc-600" : "bg-blue-600 hover:bg-blue-500"}`}
      >
        カード配分を決定
      </button>

    </div>
  );
}
