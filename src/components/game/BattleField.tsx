"use client";
import { useEffect, useRef } from "react";
import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import { StandardMaterial, Color3, ArcRotateCamera } from "@babylonjs/core";
import { PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import { Action } from "@/types/game";
import { createHumanoid } from "@/lib/createHumanoid";
import { shootBullet, punchTarget, dashForward, activateGuard } from "@/lib/battleActions";

type Props = {
  isBattling: boolean;
  playerStats: { spd: number; atk: number; def: number };
  enemyStats: { spd: number; atk: number; def: number };
  battleTimer: number;
  actions: Action[];
  onActionUsed?: (slotIndex: number) => void;
};

export default function BattleField({ isBattling, playerStats, enemyStats, battleTimer, actions, onActionUsed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isBattlingRef = useRef(isBattling);
  const playerStatsRef = useRef(playerStats);
  const enemyStatsRef = useRef(enemyStats);
  const actionsRef = useRef(actions);
  const onActionUsedRef = useRef(onActionUsed);

  useEffect(() => { isBattlingRef.current = isBattling; }, [isBattling]);
  useEffect(() => { playerStatsRef.current = playerStats; }, [playerStats]);
  useEffect(() => { enemyStatsRef.current = enemyStats; }, [enemyStats]);
  useEffect(() => { actionsRef.current = actions; }, [actions]);
  useEffect(() => { onActionUsedRef.current = onActionUsed; }, [onActionUsed]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let engineRef: Engine | null = null;

    const init = async () => {
      const engine = new Engine(canvasRef.current!, true);
      engineRef = engine;
      const scene = new Scene(engine);

      // Havok 物理エンジン初期化
      const havok = await import("@babylonjs/havok");
      const havokInstance = await havok.default();
      const { HavokPlugin } = await import("@babylonjs/core/Physics/v2/Plugins/havokPlugin");
      scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havokInstance));

      // カメラ・ライト
      const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
      camera.attachControl(canvasRef.current!, true);
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // 盤面
      const boardMat = new StandardMaterial("boardMat", scene);
      boardMat.diffuseColor = new Color3(0.87, 0.72, 0.53);
      const board = MeshBuilder.CreateBox("board", { width: 10, height: 0.2, depth: 10 }, scene);
      board.material = boardMat;
      new PhysicsAggregate(board, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3 }, scene);

      // 見えない壁（リングアウト防止）
      const wallPositions = [
        { x: 0, z: 5 }, { x: 0, z: -5 }, { x: 5, z: 0 }, { x: -5, z: 0 },
      ];
      const wallSizes = [
        { width: 10, height: 2, depth: 0.2 },
        { width: 10, height: 2, depth: 0.2 },
        { width: 0.2, height: 2, depth: 10 },
        { width: 0.2, height: 2, depth: 10 },
      ];
      wallPositions.forEach((pos, i) => {
        const wall = MeshBuilder.CreateBox(`wall${i}`, wallSizes[i], scene);
        wall.position = new Vector3(pos.x, 1, pos.z);
        wall.isVisible = false;
        new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0, restitution: 0.5 }, scene);
      });

      // 物理コライダー（透明）
      const playerMass = 1 + playerStats.def * 0.1;
      const playerCollider = MeshBuilder.CreateBox("playerCollider", { width: 0.5, height: 1.3, depth: 0.5 }, scene);
      playerCollider.position = new Vector3(-3, 0.75, 0);
      playerCollider.isVisible = false;
      new PhysicsAggregate(playerCollider, PhysicsShapeType.BOX, {
        mass: playerMass,
        restitution: 0.3 + playerStats.atk * 0.05,
      }, scene);

      const enemyCollider = MeshBuilder.CreateBox("enemyCollider", { width: 0.5, height: 1.3, depth: 0.5 }, scene);
      enemyCollider.position = new Vector3(3, 0.75, 0);
      enemyCollider.isVisible = false;
      new PhysicsAggregate(enemyCollider, PhysicsShapeType.BOX, {
        mass: 1 + enemyStats.def * 0.1,
        restitution: 0.3 + enemyStats.atk * 0.05,
      }, scene);

      // 人型モデル
      const playerModel = createHumanoid(scene, "player", new Color3(0, 0.4, 1), new Vector3(0, 0, 0));
      const enemyModel = createHumanoid(scene, "enemy", new Color3(1, 0.2, 0.2), new Vector3(0, 0, 0));
      playerModel.playIdle();
      enemyModel.playIdle();

      // メインループ
      let wasBattling = false;
      scene.onBeforeRenderObservable.add(() => {
        // モデル追従
        playerModel.root.position.x = playerCollider.position.x;
        playerModel.root.position.z = playerCollider.position.z;
        playerModel.root.position.y = Math.max(0.1, playerCollider.position.y - 0.75);

        enemyModel.root.position.x = enemyCollider.position.x;
        enemyModel.root.position.z = enemyCollider.position.z;
        enemyModel.root.position.y = Math.max(0.1, enemyCollider.position.y - 0.75);

        // 向き
        const toEnemyDir = enemyCollider.position.subtract(playerCollider.position);
        const toPlayerDir = playerCollider.position.subtract(enemyCollider.position);
        playerModel.root.rotation.y = Math.atan2(toEnemyDir.x, toEnemyDir.z);
        enemyModel.root.rotation.y = Math.atan2(toPlayerDir.x, toPlayerDir.z);

        if (!isBattlingRef.current) {
          if (wasBattling) {
            playerModel.playIdle();
            enemyModel.playIdle();
            wasBattling = false;
          }
          return;
        }

        if (!wasBattling) {
          playerModel.playWalk();
          enemyModel.playWalk();
          wasBattling = true;
        }

        const playerBody = playerCollider.physicsBody;
        const enemyBody = enemyCollider.physicsBody;
        if (!playerBody || !enemyBody) return;

        // 基本移動
        const pSpd = playerStatsRef.current.spd * 0.5;
        const eSpd = enemyStatsRef.current.spd * 0.5;
        const toEnemy = enemyCollider.position.subtract(playerCollider.position).normalize();
        const toPlayer = playerCollider.position.subtract(enemyCollider.position).normalize();
        playerBody.applyForce(toEnemy.scale(pSpd), playerCollider.getAbsolutePosition());
        enemyBody.applyForce(toPlayer.scale(eSpd), enemyCollider.getAbsolutePosition());

        // 距離
        const distance = Vector3.Distance(playerCollider.position, enemyCollider.position);

        // アクション判定
        const currentActions = actionsRef.current;
        for (let i = 0; i < currentActions.length; i++) {
          const a = currentActions[i];
          if (a.currentCool > 0) continue;

          let shouldUse = false;
          switch (a.type) {
            case "shoot": shouldUse = distance > 1.5; break;
            case "punch": shouldUse = distance < 1.5; break;
            case "dash":  shouldUse = distance > 2; break;
            case "guard": shouldUse = distance < 2; break;
          }

          if (shouldUse) {
            switch (a.type) {
              case "shoot":
                shootBullet(scene, playerCollider, enemyCollider, a.power, playerModel);
                break;
              case "punch":
                punchTarget(playerCollider, enemyCollider, a.power, playerModel);
                break;
              case "dash":
                dashForward(playerCollider, enemyCollider, a.power);
                break;
              case "guard":
                activateGuard(playerCollider, a.power, playerModel, playerMass);
                break;
            }
            onActionUsedRef.current?.(i);
          }
        }
      });

      engine.runRenderLoop(() => scene.render());
    };

    init();
    return () => engineRef?.dispose();
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-200 h-200 rounded-lg" />
      {battleTimer > 0 && (
        <div className="absolute top-2 left-2 right-2 h-4 bg-zinc-700 rounded overflow-hidden">
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${(1 - battleTimer / 10) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
