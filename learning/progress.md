# Learning Progress

## Overview
- Start Date: 2026-04-03
- Goal: developsecond の各プロジェクトを理解し、自力で修正・拡張できるレベルになる
- Product: 将棋×ポーカー ハイブリッドゲーム（各フェーズで段階的に構築）

## Phase 0: Git Basics
- [ ] 基本コマンド（add, commit, status, log, diff）
- [ ] ブランチ（branch, checkout, merge）
- [ ] リモート操作（remote, push, pull, clone）
- [ ] GitHub リポジトリの作成と連携
- [ ] .gitignore の仕組み
- [ ] コンフリクト解消

## Phase 1: Next.js Basics (Routing, SSR/CSR)
**作るもの: ゲームのページ構成（トップ、ゲーム画面、ルール説明ページ）**
- [x] App Router の仕組み（layout.tsx, page.tsx）
- [x] 動的ルーティング（[slug], [...catchAll]）
- [x] Server Components vs Client Components
- [ ] SSR / SSG / ISR の違いと使い分け（Phase 4〜6で実践時に学ぶ）
- [ ] API Routes (Route Handlers)（Phase 4で実践時に学ぶ）
- [x] ミドルウェア（概要理解済み、Phase 6で実装）

## Phase 2: React Basics (Components, State, Hooks)
**作るもの: ゲームのUI部品（手札、盤面、スコア表示をコンポーネント化）**
- [x] JSX とコンポーネントの基本
- [x] props と children
- [x] useState / useEffect
- [x] useRef
- [x] useMemo / useCallback
- [x] カスタムフック（usePokerHand）
- [x] Context API（PlayerContext でプレイヤー名共有）

## Phase 3: UI (Tailwind CSS)
**作るもの: 盤面・カードのレイアウトとレスポンシブ対応**
- [x] ユーティリティクラスの基本（Card, Hand のスタイリング）
- [x] レスポンシブデザイン（CSS知識あり、必要時に都度対応）
- [x] レイアウト（Flexbox, Grid）（CSS知識あり、必要時に都度対応）

## Phase 4: Forms & API
**作るもの: ゲーム設定フォーム、ルーム作成API**
- [x] フォーム処理（controlled）— settings/page.tsx でテキスト、セレクト、ラジオ
- [x] API Routes (Route Handlers) — src/app/api/rooms/route.ts（POST, request.json, NextResponse.json）
- [x] Server Actions — src/app/actions/room.ts（"use server", fetchなしでサーバー処理を呼べる）
- [x] バリデーション（Zod） — safeParse/parse の使い分け、スキーマ定義
- [x] 外部API呼び出し（fetch）— API Route で実践済み

## Phase 5: Testing
**作るもの: ゲームロジック（役判定、勝敗判定）のテスト**
- [x] テストの種類（単体、結合、E2E）
- [x] Jest / Vitest のセットアップ
- [x] コンポーネントテスト（React Testing Library）
- [ ] E2Eテスト（Playwright）概要（必要になったときに導入）
- [x] テスト駆動開発（TDD）の考え方

## Phase 6: Firebase & External Services
**作るもの: ユーザー認証、対戦データ保存、リアルタイム対戦同期**
- [ ] Firebase プロジェクトのセットアップと初期化
- [ ] Firestore（データの読み書き、リアルタイム同期）
- [ ] Firebase Authentication（ログイン/ユーザー管理）
- [ ] Firebase Storage（ファイルアップロード）
- [ ] セキュリティルール
- [ ] 環境変数の管理（.env.local）
- [ ] Stripe 決済の仕組み（概要理解）
- [ ] OpenAI API 連携（概要理解）

## Phase 7: Babylon.js Basics (3D入門)
**作るもの: 盤面の3D表示（将棋盤をBabylon.jsで描画）**
- [x] シーン、カメラ、ライトの基本（scene/page.tsx）
- [x] メッシュの作成と操作（盤面 + 駒の箱）
- [x] マテリアルとテクスチャ（StandardMaterial, Color3）
- [x] Next.js との統合パターン（useEffect + useRef + Canvas）
- [x] WebGL の基礎概念（頂点・三角形・シェーダー・GPUパイプライン）

## Phase 8: 3D Characters & Physics
**作るもの: 駒の3Dモデル表示、移動アニメーション、衝突判定**
- [ ] ボーン / スケルトン / アニメーション（Phase 10 Blender と合わせて実施）
- [x] 物理エンジン（Havok — 重力、質量、反発係数、衝突）
- [x] キャラクター制御（キー入力 + applyForce + カメラのキー入力無効化）
- [x] GLSL シェーダー入門（Phase 7 で ShaderMaterial を体験済み）
- [x] 線形代数の基礎（ベクトル演算、回転、ラジアン）

## Phase 9: Voxel & Editors
**作るもの: 駒のボクセルモデル作成エディタ**
- [x] ボクセルデータ構造（Voxel型、VoxelModel型を定義）
- [x] エディタUIの設計（座標入力で追加・削除、カラーピッカー、保存・読み込み）
- [x] ボクセルレンダリング（voxels state → Babylon.js で箱を配置）

## Phase 10: Blender Integration
**作るもの: Blenderで駒モデル作成→ゲームへエクスポート**
- [x] Blender Python API（bpy）基礎 — 頂点・面の定義、メッシュ生成、マテリアル追加
- [x] ヘッドレス実行（blender --background --python）
- [x] glTFエクスポート → Babylon.js で SceneLoader.ImportMesh で読み込み
- [ ] モーション/アニメーションエクスポート（必要になったら実施）

## Phase 11: WebAssembly
**作るもの: ゲームロジック（AI思考、役判定）をWasmで高速化**
- [x] Wasm の仕組みと用途（JS vs Wasm、コンパイル言語をブラウザで実行）
- [x] Rust → Wasm（wasm-pack build --target web）
- [x] Next.js との統合（import("wasm-lib") で動的読み込み）
- [ ] パフォーマンス最適化（必要になったら実施）

---

## Session Log
<!-- 各セッションの記録をここに追加 -->

### 2026-04-03
- プロジェクト初期化（create-next-app で新規作成）
- 学習ロードマップ策定
- 学習記録の仕組み作成
- Git リポジトリを新規作成（旧 link-rank との紐付け解除）
- 制作物を「将棋×ポーカー ハイブリッドゲーム」に決定

### 2026-04-04
- Phase 1: App Router, layout.tsx, page.tsx, Link, 動的ルーティング[roomId], Server/Client Component
- Phase 2: コンポーネント(Card, Hand), props, children, useState, .map()でリスト表示
- シャッフル機能実装（Fisher-Yates, flatMap, ジェネリクス）

### 2026-04-05
- Phase 2 続き: useEffect（役判定で使用→不要なケースと学ぶ）、useRef（シャッフル回数カウント）
- useState の値が即時反映しない仕組みを理解
- 型定義を src/types/cards.ts に分離（関心の分離）
- 役判定関数を src/utils/poker.ts に実装（ワンペア、ツーペア）
- .gitignore に question.md, learning/notes/ を追加
- useMemo / useCallback（キャッシュの仕組み、使う/使わない判断）
- カスタムフック usePokerHand 作成（フックのルール: 必ず関数内で呼ぶ）
- Context API: PlayerContext でプレイヤー名を全ページ共有
- Context はメモリ上の値、Link遷移で保持・URL直接入力で消える
- Phase 3: Tailwind CSS（Card, Hand のスタイリング。CSS知識ありのため基礎は完了）
- 学習方針変更: Phase 4 と Phase 7 を交互に進める

### 2026-04-07
- Phase 4: フォーム処理（settings/page.tsx — テキスト入力、セレクトボックス、ラジオボタン）
- Phase 7: Babylon.js 入門（scene/page.tsx — Engine, Scene, Camera, Light, MeshBuilder, Material）
  - 将棋盤（平たい箱）+ 駒（小さい箱）を表示
  - ArcRotateCamera でマウス回転・ズーム操作
- 次回: API Routes を作成（src/app/api/rooms/route.ts）し settings/page.tsx から fetch で呼ぶ

### 2026-04-09
- Phase 4 完了: API Routes, Server Actions, Zod バリデーション
  - API Route: route.ts でHTTPメソッド（POST/GET）に対応した関数をexport
  - Server Action: "use server" で fetch なしにサーバー処理を呼べる（アプリ内処理向き）
  - Zod: safeParse（エラーを自分で処理）vs parse（失敗=バグ、止まってOK）
  - TypeScript の型チェックがバグを事前に防ぐ（JSでは実行時まで気づけない）

#### 要復習
- flatMap の仕組み（map + flat との違い）
- Fisher-Yates シャッフルアルゴリズム
- ジェネリクス `<T,>` の記法

### 2026-04-12
- Phase 5: Testing
  - Vitest セットアップ（vitest.config.ts, environment: "jsdom"）
  - 単体テスト: judgeHand の役判定テスト（11件）— describe/test/expect の基本構造
  - TDD 実践: スリーカード → フォーカード → フルハウス → ストレート → フラッシュ → RSF を Red→Green で追加
  - コンポーネントテスト: Card コンポーネント（3件）— render/screen/getByText の使い方
  - peer dependency の意味（@testing-library/dom が必要だった）
  - toBe（完全一致）vs toContain（部分一致）の使い分け
  - A-2-3-4-5 ストレート対応（Aを14と1の両方で判定するロジック）
- Phase 7 完了: WebGL の基礎概念
  - レイヤー構造: コード → Babylon.js → WebGL → GPU
  - メッシュ = 頂点 + 三角形（箱: 24頂点、12三角形）
  - 頂点が角の数(8)より多い理由 = 面ごとに法線が異なるため
  - シェーダー: 頂点シェーダー（位置）+ フラグメントシェーダー（色）
  - ShaderMaterial で自作シェーダーを適用する体験
- Phase 8 途中:
  - ベクトル演算: subtract（方向）, normalize（正規化）, length（距離）, add（加算）
  - 回転: rotation.y, ラジアン（Math.PI/2 = 90度）
  - 物理エンジン: Havok 初期化、重力(-9.81)、mass（0=固定, 1=動く）、restitution（反発）
  - PhysicsAggregate でメッシュに物理を付与、衝突・跳ね返りを体験
  - メッシュ形状: CreateBox → CreateCylinder に変更
  - キャラクター制御: keydown/keyup でキー状態管理、onBeforeRenderObservable で毎フレーム処理
  - applyForce で物理ボディに力を加えて移動
  - ArcRotateCamera のキーボード入力を無効化（removeByType）してキー操作の競合を解決
  - 弾の発射: メッシュ生成 + applyForce で飛ばす、position.clone() で位置をコピー
  - 初期化時の1回実行 vs onBeforeRenderObservable 内の毎フレーム実行の違い
- Phase 9 完了: ボクセルエディタ
  - Voxel型: x, y, z, color でブロック1つを定義
  - ボクセル = 3Dのピクセル（小さな立方体の集まり）
  - state変更 → useEffect → 3D再描画のパターン
  - sceneRef でBabylon.jsのSceneを保持（useRefの活用）
  - Color3.FromHexString で16進カラーコードを変換
  - mesh.dispose() で既存メッシュを削除して再描画
  - JSON保存/読み込み: Blob, URL.createObjectURL, FileReader
- Phase 10 完了: Blender Integration
  - bpy（Blender Python API）で頂点・面を定義してメッシュ生成
  - blender --background --python でヘッドレス実行
  - glTF(.glb)エクスポート → SceneLoader.ImportMesh で読み込み
- Phase 11 完了: WebAssembly
  - Rust のインストール（rustup, cargo, wasm-pack）
  - Visual Studio Build Tools（C++ ワークロード）が必要だった
  - #[wasm_bindgen] で Rust 関数を JS から呼べるようにする
  - wasm-pack build --target web でコンパイル
  - Next.js から import("wasm-lib") で動的読み込み
