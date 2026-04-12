import { CardType } from "@/types/cards";


export const judgeHand = (hand: CardType[]): string => {
  // rankごとの出現回数をカウント
  const countMap: Record<string, number> = {};
  const markMap: Record<string, number> = {};

  hand.forEach((card) => {
    countMap[card.rank] = (countMap[card.rank] || 0) + 1;
    markMap[card.suit] = (markMap[card.suit] || 0) + 1;
  });

  const rankToNumber = (rank: string): number => {
    const faceCards: Record<string, number> = {
      A: 14,
      K: 13,
      Q: 12,
      J: 11,
    };
    return faceCards[rank] || parseInt(rank);
  };

  // 配列に変換してソート
  const isStraight = (hand: CardType[]): boolean => {
    const sorted = hand.map((c) => rankToNumber(c.rank)).sort((a, b) => a - b);

    // 通常の連番チェック
    const isConsecutive = (nums: number[]): boolean => {
      for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] + 1 !== nums[i + 1]) return false;
      }
      return true;
    };

    if (isConsecutive(sorted)) return true;

    // A(14)が含まれていたら、A=1 として再チェック
    if (sorted.includes(14)) {
      const lowAce = sorted.map((n) => (n === 14 ? 1 : n)).sort((a, b) => a - b);
      return isConsecutive(lowAce);
    }

    return false;
  };

  // 出現回数だけの配列にする（例: [2,1,1,1] や [2,2,1]）
  const counts = Object.values(countMap);

  // ペアの数をカウント
  const pairCount = counts.filter((c) => c === 2).length;
  const threeCount = counts.filter((c) => c === 3).length;
  const fourCount = counts.filter((c) => c === 4).length;
  const sorted = hand.map((c) => rankToNumber(c.rank)).sort((a, b) => a - b);
  const isFlush = Object.keys(markMap).length === 1;
  const isStraightResult = isStraight(hand);

  if (isStraightResult && isFlush && sorted[0] === 10 && sorted[4] === 14) return "ロイヤルストレートフラッシュ";
  if (isStraightResult && isFlush) return "ストレートフラッシュ";
  if (fourCount === 1) return "フォーカード";
  if (threeCount === 1 && pairCount === 1) return "フルハウス";
  if (isFlush) return "フラッシュ";
  if (isStraightResult) return "ストレート";
  if (threeCount === 1) return "スリーカード";
  if (pairCount === 2) return "ツーペア";
  if (pairCount === 1) return "ワンペア";

  return "役なし";
};;