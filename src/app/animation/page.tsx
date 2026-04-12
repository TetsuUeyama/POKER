"use client";
import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  HemisphericLight,
  Vector3,
  ArcRotateCamera,
  Color4,
} from "@babylonjs/core";
import { AnimationGroup } from "@babylonjs/core/Animations/animationGroup";
import "@babylonjs/loaders/glTF";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

export default function AnimationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animGroupsRef = useRef<AnimationGroup[]>([]);
  const [currentAnim, setCurrentAnim] = useState("(読み込み中)");
  const [animNames, setAnimNames] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>(["ページ読み込み完了"]);

  // ログ追加（画面に表示 + コンソール）
  const addLog = useRef((msg: string) => {
    console.log("[DEBUG]", msg);
    setLogs((prev) => [...prev, msg]);
  });

  const playAnimation = (name: string, loop: boolean = true) => {
    const groups = animGroupsRef.current;
    groups.forEach((g) => g.stop());

    const target = groups.find((g) => g.name === name);
    if (target) {
      target.loopAnimation = loop;
      target.play(loop);
      setCurrentAnim(name + (loop ? " (ループ)" : " (1回)"));
      addLog.current(`再生: ${name}`);

      if (!loop) {
        target.onAnimationEndObservable.addOnce(() => {
          playAnimation("idle", true);
        });
      }
    } else {
      addLog.current(`"${name}" が見つかりません`);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const log = addLog.current;

    log("Engine 初期化中...");

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.1, 0.1, 0.15, 1);

    const camera = new ArcRotateCamera(
      "camera", Math.PI / 4, Math.PI / 3, 10,
      new Vector3(1, 2, 0), scene
    );
    camera.attachControl(canvasRef.current, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    log("モデル読み込み開始...");

    SceneLoader.ImportMeshAsync("", "/models/", "samurai_voxel.glb", scene)
      .then((result) => {
        log(`読み込み完了 — メッシュ: ${result.meshes.length}`);
        log(`result.animationGroups: ${result.animationGroups.length}`);
        log(`scene.animationGroups: ${scene.animationGroups.length}`);

        // スケルトン確認
        result.skeletons.forEach((sk) => {
          log(`スケルトン: ${sk.name} (ボーン数: ${sk.bones.length})`);
          sk.bones.forEach((b) => {
            log(`  ボーン: ${b.name} (親: ${b.getParent()?.name || "なし"})`);
          });
        });

        // アニメーション確認 — scene から取得
        const groups = scene.animationGroups;
        const names: string[] = [];
        groups.forEach((g) => {
          log(`アニメーション: "${g.name}" (${g.from}〜${g.to})`);
          names.push(g.name);
        });

        animGroupsRef.current = groups;
        setAnimNames(names);

        // 全停止 → idle 再生
        groups.forEach((g) => g.stop());
        const idle = groups.find((g) => g.name === "idle");
        if (idle) {
          idle.loopAnimation = true;
          idle.play(true);
          setCurrentAnim("idle (ループ)");
          log("idle 再生開始");
        } else {
          log("idle が見つかりません。全グループ名: " + names.join(", "));
          setCurrentAnim("アニメーションなし");
        }
      })
      .catch((err) => {
        log(`読み込みエラー: ${err}`);
      });

    engine.runRenderLoop(() => scene.render());

    return () => engine.dispose();
  }, []);

  return (
    <div style={{ background: "#1a1a2e", color: "#eee", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "10px" }}>
        <h1 style={{ margin: "5px 0" }}>3D アニメーション テスト</h1>
        <p>現在: <strong>{currentAnim}</strong></p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "10px 0" }}>
          {animNames.map((name) => (
            <button
              key={name}
              onClick={() => playAnimation(name, name === "idle")}
              style={{
                padding: "8px 20px",
                fontSize: "14px",
                cursor: "pointer",
                background: currentAnim.startsWith(name) ? "#4169e1" : "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "4px",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: "100%", height: "55vh" }} />

      {/* デバッグログ — 画面内に直接表示 */}
      <div style={{
        background: "#000",
        color: "#0f0",
        padding: "10px",
        fontSize: "13px",
        fontFamily: "monospace",
        height: "25vh",
        overflow: "auto",
        borderTop: "2px solid #333",
      }}>
        <div style={{ color: "#ff0", marginBottom: "5px" }}>== デバッグログ ==</div>
        {logs.map((log, i) => (
          <div key={i}>{`[${i}] ${log}`}</div>
        ))}
      </div>
    </div>
  );
}
