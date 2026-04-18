import { UnitDef, Unit } from "../types/game";

// ============================
// 5体のユニット定義
// ============================

export const UNIT_DEFS: UnitDef[] = [
  {
    id: "samurai",
    name: "侍",
    baseHp: 30,
    baseAtk: 12,
    baseDef: 6,
    baseSpd: 8,
    suitEffect: { "♠": "ATK", "♥": "HP", "♦": "SPD", "♣": "DEF" },
  },
  {
    id: "ninja",
    name: "忍",
    baseHp: 20,
    baseAtk: 10,
    baseDef: 4,
    baseSpd: 14,
    suitEffect: { "♠": "SPD", "♥": "ATK", "♦": "ATK", "♣": "HP" },
  },
  {
    id: "fortress",
    name: "城",
    baseHp: 50,
    baseAtk: 4,
    baseDef: 14,
    baseSpd: 2,
    suitEffect: { "♠": "DEF", "♥": "HP", "♦": "HP", "♣": "DEF" },
  },
  {
    id: "monk",
    name: "僧",
    baseHp: 35,
    baseAtk: 8,
    baseDef: 8,
    baseSpd: 6,
    suitEffect: { "♠": "HP", "♥": "HP", "♦": "DEF", "♣": "ATK" },
  },
  {
    id: "archer",
    name: "弓",
    baseHp: 25,
    baseAtk: 14,
    baseDef: 4,
    baseSpd: 10,
    suitEffect: { "♠": "ATK", "♥": "SPD", "♦": "ATK", "♣": "DEF" },
  },
];

// ============================
// ヘルパー: UnitDef から試合開始時の Unit を作る
// ============================

export function createUnit(def: UnitDef): Unit {
  return {
    def,
    currentHp: def.baseHp,
    maxHp: def.baseHp,
    atk: def.baseAtk,
    defense: def.baseDef,
    spd: def.baseSpd,
    isDefending: false,
    isAlive: true,
    assignedCards: [],
  };
}

// 5体フルパーティを生成（プレイヤー・CPU両方で使う）
export function createInitialUnits(): Unit[] {
  return UNIT_DEFS.map(createUnit);
}
