import { judgeHand } from "./poker";
import {describe, test, expect} from "vitest";

// describe — テストのグループ（何をテストするかの見出し）
describe("judgeHand", () => {
  // test — テスト1件（具体的なケース）
  test("RSFを判定できる", () => {
    const hand = [
        {suit: "♠", rank: "A"},
        {suit: "♠", rank: "K"},
        {suit: "♠", rank: "Q"},
        {suit: "♠", rank: "J"},
        {suit: "♠", rank: "10"},
      ];
      expect(judgeHand(hand)).toBe("ロイヤルストレートフラッシュ");
    });
    test("SFを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "9"},
        {suit: "♠", rank: "K"},
        {suit: "♠", rank: "Q"},
        {suit: "♠", rank: "J"},
        {suit: "♠", rank: "10"},
      ];
      expect(judgeHand(hand)).toBe("ストレートフラッシュ");
    });
    test("フォーカードを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "A"},
        {suit: "♥", rank: "A"},
        {suit: "♦", rank: "A"},
        {suit: "♣", rank: "A"},
        {suit: "♠", rank: "K"},
      ];
      expect(judgeHand(hand)).toBe("フォーカード");
    });
    test("フルハウスを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "A"},
        {suit: "♥", rank: "A"},
        {suit: "♦", rank: "A"},
        {suit: "♣", rank: "K"},
        {suit: "♠", rank: "K"},
      ];
      expect(judgeHand(hand)).toBe("フルハウス");
    });
    test("フラッシュを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "9"},
        {suit: "♠", rank: "2"},
        {suit: "♠", rank: "7"},
        {suit: "♠", rank: "J"},
        {suit: "♠", rank: "10"},
      ];
      expect(judgeHand(hand)).toBe("フラッシュ");
    });
    test("ストレートを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "6"},
        {suit: "♥", rank: "2"},
        {suit: "♦", rank: "3"},
        {suit: "♣", rank: "4"},
        {suit: "♠", rank: "5"},
      ];
      expect(judgeHand(hand)).toBe("ストレート");
    });



    test("A-2-3-4-5のストレートを判定できる", () => {
      const hand = [
        {suit: "♠", rank: "A"},
        {suit: "♥", rank: "2"},
        {suit: "♦", rank: "3"},
        {suit: "♣", rank: "4"},
        {suit: "♠", rank: "5"},
      ];
      expect(judgeHand(hand)).toBe("ストレート");
    });
  test("スリーカードを判定できる", () => {
    const hand = [
      {suit: "♠", rank: "A"},
      {suit: "♥", rank: "A"},
      {suit: "♦", rank: "A"},
      {suit: "♣", rank: "K"},
      {suit: "♠", rank: "J"},
    ];

    // expect(実際の値).toBe(期待する値)
    expect(judgeHand(hand)).toBe("スリーカード");
  });
  test("ツーペアを判定できる", () => {
    const hand = [
      {suit: "♠", rank: "A"},
      {suit: "♥", rank: "A"},
      {suit: "♦", rank: "K"},
      {suit: "♣", rank: "K"},
      {suit: "♠", rank: "J"},
    ];

    // expect(実際の値).toBe(期待する値)
    expect(judgeHand(hand)).toBe("ツーペア");
  });
  test("ワンペアを判定できる", () => {
    const hand = [
      {suit: "♠", rank: "A"},
      {suit: "♥", rank: "A"},
      {suit: "♦", rank: "K"},
      {suit: "♣", rank: "10"},
      {suit: "♠", rank: "J"},
    ];

    // expect(実際の値).toBe(期待する値)
    expect(judgeHand(hand)).toBe("ワンペア");
  });
  test("役なしを判定できる", () => {
    const hand = [
      // ← 役なしになる5枚のカードを自分で考えて書く
      {suit: "♠", rank: "A"},
      {suit: "♥", rank: "10"},
      {suit: "♦", rank: "9"},
      {suit: "♣", rank: "Q"},
      {suit: "♠", rank: "2"},
    ];
    expect(judgeHand(hand)).toBe("役なし");
  });
});
