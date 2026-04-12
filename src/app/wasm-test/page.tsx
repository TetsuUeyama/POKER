"use client";
  import { useState, useEffect } from "react";

  export default function WasmTestPage() {
    const [wasm, setWasm] = useState<any>(null);
    const [hand1, setHand1] = useState("フルハウス");
    const [hand2, setHand2] = useState("ストレート");
    const [result, setResult] = useState("");

    // Wasm を読み込む（非同期）
    useEffect(() => {
      import("wasm-lib").then((mod) => {
        mod.default().then(() => {
          setWasm(mod);
        });
      });
    }, []);

    const compare = () => {
      if (!wasm) return;
      const s1 = wasm.hand_strength(hand1);
      const s2 = wasm.hand_strength(hand2);
      const winner = wasm.compare_hands(hand1, hand2);
      const winnerText = winner === 1 ? "プレイヤー1の勝ち" : winner === 2 ?
  "プレイヤー2の勝ち" : "引き分け";
      setResult(`${hand1}(${s1}) vs ${hand2}(${s2}) → ${winnerText}`);
    };

    const hands = [
      "ロイヤルストレートフラッシュ", "ストレートフラッシュ", "フォーカード",
      "フルハウス", "フラッシュ", "ストレート",
      "スリーカード", "ツーペア", "ワンペア", "役なし",
    ];

    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Wasm テスト（Rust → WebAssembly）</h1>
        <p>{wasm ? "Wasm 読み込み完了" : "読み込み中..."}</p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", margin:
  "20px" }}>
          <div>
            <h3>プレイヤー1</h3>
            <select value={hand1} onChange={(e) => setHand1(e.target.value)}>
              {hands.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <h3>プレイヤー2</h3>
            <select value={hand2} onChange={(e) => setHand2(e.target.value)}>
              {hands.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <button onClick={compare} style={{ padding: "10px 20px", fontSize: "16px" }}>
          対戦！
        </button>
        <p style={{ fontSize: "20px", marginTop: "20px" }}>{result}</p>
      </div>
    );
  }
