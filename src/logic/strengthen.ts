import {CardType} from "@/types/cards";
import {Unit, Suit, Stat, Action} from "@/types/game";

// ランク文字列 → ブースト値
export function rankToBoost(rank: string): number {
  // rank は "1"(A) ～ "13"(K) の文字列で入ってくる想定
  switch (rank) {
    case "1":
      return 6; // A
    case "13":
      return 5; // K
    case "12":
      return 4; // Q
    case "11": // J
    case "10":
      return 3;
    case "9":
    case "8":
    case "7":
      return 2;
    default:
      return 1; // 6〜2
  }
}

// スート効果に従ってユニットの該当ステータスを強化
export function applyCardToUnit(unit: Unit, card: CardType): Unit {
  const boost = rankToBoost(card.rank);
  const stat: Stat = unit.def.suitEffect[card.suit as Suit];

  const next: Unit = {...unit};
  next.assignedCards = [...unit.assignedCards, card];
  switch (stat) {
    case "HP":
      next.maxHp = unit.maxHp + boost;
      next.currentHp = unit.currentHp + boost;
      break;
    case "ATK":
      next.atk = unit.atk + boost;
      break;
    case "DEF":
      next.defense = unit.defense + boost;
      break;
    case "SPD":
      next.spd = unit.spd + boost;
      break;
  }
  return next;
}

export function removeCardFromUnit(unit: Unit, cardIndex: number): Unit {
  const card = unit.assignedCards[cardIndex];
  const boost = rankToBoost(card.rank);
  const stat: Stat = unit.def.suitEffect[card.suit as Suit];

  const next: Unit = {...unit};
  next.assignedCards = unit.assignedCards.filter((_, i) => i !== cardIndex);

  switch (stat) {
    case "HP":
      next.maxHp = unit.maxHp - boost;
      next.currentHp = unit.currentHp - boost;
      break;
    case "ATK":
      next.atk = unit.atk - boost;
      break;
    case "DEF":
      next.defense = unit.defense - boost;
      break;
    case "SPD":
      next.spd = unit.spd - boost;
      break;
  }
  return next;
}

export function suitToAction(suit: string, rank: string): Action {
  const power = rankToBoost(rank);
  switch (suit) {
    case "♠":
      return {type: "shoot", power, cooldown: 2, currentCool: 0};
    case "♣":
      return {type: "punch", power, cooldown: 3, currentCool: 0};
    case "♦":
      return {type: "dash", power, cooldown: 2, currentCool: 0};
    case "♥":
      return {type: "guard", power, cooldown: 4, currentCool: 0};
    default:
      return {type: "shoot", power, cooldown: 2, currentCool: 0};
  }
}