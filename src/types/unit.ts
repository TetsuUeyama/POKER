
export type UnitType = {
  id: number;
  name: string;
  type1: string;
  type2: string;
  Hp: number;
  ATK: number;
  DEF: number;
  STAK: number;
  SDEF: number;
  SPD: number;
  characteristics: string;
  Move1: string;
  Move2: string;
  Move3: string;
  Move4: string;
};

export type Move = {
  id: number;
  name: string;
  power: number;
  effect: string;
  type: string;
  accuracy: number;
  derivedTime: number;
  coolDown: number;
};

export type Characteristics = {
  id: number;
  name: string;
  effect: string;
}