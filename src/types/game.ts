import {CardType} from "./cards";

// ============================
// ユニット関連
// ============================

export type Stat = "HP" | "ATK" | "DEF" | "SPD";
export type Suit = "♠" | "♥" | "♦" | "♣";

// スートごとにどのステータスを強化するか
export type SuitEffect = Record<Suit, Stat>;

// ユニットの基礎データ（不変）
export type UnitDef = {
  id: string; // "samurai" | "ninja" | "fortress" | "monk" | "archer"
  name: string; // "侍" など
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  suitEffect: SuitEffect;
};

// バトル中のユニット状態（可変）
export type Unit = {
  def: UnitDef;
  currentHp: number;
  maxHp: number;
  atk: number;
  defense: number; // "def" は UnitDef と被るので defense
  spd: number;
  isDefending: boolean;
  isAlive: boolean;
  assignedCards: CardType[];
};

// ============================
// カード配分
// ============================

// 1枚のカードをどのユニットに割り当てるか（null = 手札に残す）
export type CardAssignment = {
  card: CardType;
  unitId: string | null;
};

// ============================
// フェーズ / プレイヤー
// ============================

export type Phase =
  | "deal" // カード配布
  | "assign" // 強化フェーズ（プレイヤー操作）
  | "battle" // バトルフェーズ（3サブラウンド）
  | "exchange" // 交換フェーズ
  | "reveal" // 手札公開・役バフ
  | "finalBattle" // 手札公開後のバトル
  | "result"; // 勝敗表示

export type Side = "player" | "cpu";

// ============================
// バトルログ
// ============================

export type BattleAction = "attack" | "defend";

export type BattleLog = {
  turn: number;
  actor: {side: Side; unitId: string};
  action: BattleAction;
  target?: {side: Side; unitId: string};
  damage?: number;
  message: string;
};

// ============================
// ゲーム全体の状態
// ============================

export type GameState = {
  phase: Phase;
  round: number; // 1〜3（バトルフェーズのサブラウンド）
  setCount: number; // 新デッキ何回目か
  deck: CardType[];
  playerHand: CardType[];
  cpuHand: CardType[];
  playerUnits: Unit[]; // 5体
  cpuUnits: Unit[];
  assignments: {
    player: CardAssignment[];
    cpu: CardAssignment[];
  };
  logs: BattleLog[];
  winner: Side | "draw" | null;
};

export type ActionType = "shoot" | "punch" | "dash" | "guard";

export type Action = {
  type: ActionType;
  power: number; // ランクから算出されたブースト値
  cooldown: number; // クールダウン秒数
  currentCool: number; // 現在の残りクールダウン（0で発動可能）
};