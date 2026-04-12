use wasm_bindgen::prelude::*;

// JavaScriptから呼べる関数にする
#[wasm_bindgen]
pub fn hand_strength(hand_name: &str) -> u32 {
    match hand_name {
        "ロイヤルストレートフラッシュ" => 10,
        "ストレートフラッシュ" => 9,
        "フォーカード" => 8,
        "フルハウス" => 7,
        "フラッシュ" => 6,
        "ストレート" => 5,
        "スリーカード" => 4,
        "ツーペア" => 3,
        "ワンペア" => 2,
        _ => 1,  // 役なし
    }
}

// 2つの役を比較して勝者を返す（1=プレイヤー1の勝ち、2=プレイヤー2、0=引き分け）
#[wasm_bindgen]
pub fn compare_hands(hand1: &str, hand2: &str) -> u32 {
    let s1 = hand_strength(hand1);
    let s2 = hand_strength(hand2);
    if s1 > s2 { 1 }
    else if s2 > s1 { 2 }
    else { 0 }
}
