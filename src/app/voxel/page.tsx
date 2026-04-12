"use client";
  import { useEffect, useRef, useState, useCallback } from "react";
  import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
  import { StandardMaterial, Color3, ArcRotateCamera } from "@babylonjs/core";
  import { Voxel } from "@/types/voxel";

  const initialVoxels: Voxel[] = [
    { x: 2, y: 0, z: 0, color: "#deb887" },
    { x: 3, y: 0, z: 0, color: "#deb887" },
    { x: 4, y: 0, z: 0, color: "#deb887" },
    { x: 5, y: 0, z: 0, color: "#deb887" },
    { x: 6, y: 0, z: 0, color: "#deb887" },
    { x: 2, y: 1, z: 0, color: "#deb887" },
    { x: 3, y: 1, z: 0, color: "#deb887" },
    { x: 4, y: 1, z: 0, color: "#deb887" },
    { x: 5, y: 1, z: 0, color: "#deb887" },
    { x: 6, y: 1, z: 0, color: "#deb887" },
    { x: 3, y: 2, z: 0, color: "#deb887" },
    { x: 4, y: 2, z: 0, color: "#deb887" },
    { x: 5, y: 2, z: 0, color: "#deb887" },
    { x: 4, y: 3, z: 0, color: "#deb887" },
  ];

  export default function VoxelPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [voxels, setVoxels] = useState<Voxel[]>(initialVoxels);
    const [color, setColor] = useState("#deb887");

    const sceneRef = useRef<Scene | null>(null);

    // ボクセルを再描画する関数
    const renderVoxels = useCallback((scene: Scene, voxelList: Voxel[]) => {
      // 既存のボクセルメッシュを削除
      scene.meshes
        .filter((m) => m.name.startsWith("voxel"))
        .forEach((m) => m.dispose());

      // 新しく描画
      voxelList.forEach((voxel, i) => {
        const box = MeshBuilder.CreateBox("voxel" + i, { size: 0.95 }, scene);
        box.position = new Vector3(voxel.x, voxel.y, voxel.z);
        const mat = new StandardMaterial("mat" + i, scene);
        mat.diffuseColor = Color3.FromHexString(voxel.color);
        box.material = mat;
      });
    }, []);

    useEffect(() => {
      if (!canvasRef.current) return;

      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);
      sceneRef.current = scene;

      const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 15, new Vector3(4, 2, 0), scene);
      camera.attachControl(canvasRef.current, true);
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // グリッド線（地面の目印）
      for (let x = 0; x <= 8; x++) {
        for (let z = 0; z <= 0; z++) {
          const grid = MeshBuilder.CreateBox("grid" + x + "_" + z, { size: 0.98 }, scene);
          grid.position = new Vector3(x, -0.5, z);
          const gridMat = new StandardMaterial("gridMat" + x + "_" + z, scene);
          gridMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
          gridMat.alpha = 0.2;
          grid.material = gridMat;
        }
      }

      renderVoxels(scene, voxels);

      engine.runRenderLoop(() => scene.render());
      return () => engine.dispose();
    }, []);

    // voxels が変わったら再描画
    useEffect(() => {
      if (sceneRef.current) {
        renderVoxels(sceneRef.current, voxels);
      }
    }, [voxels, renderVoxels]);

    // ボクセルを追加
    const addVoxel = (x: number, y: number, z: number) => {
      const exists = voxels.some((v) => v.x === x && v.y === y && v.z === z);
      if (exists) return; // 既にある場所には追加しない
      setVoxels([...voxels, { x, y, z, color }]);
    };

    // ボクセルを削除
    const removeVoxel = (x: number, y: number, z: number) => {
      setVoxels(voxels.filter((v) => !(v.x === x && v.y === y && v.z === z)));
    };

    return (
      <div>
        <div style={{ textAlign: "center", padding: "10px", display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
          <h1>ボクセルエディタ</h1>
          <label>
            色:
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <span>ブロック数: {voxels.length}</span>
        </div>

        {/* 座標入力で追加・削除 */}
        <div style={{ textAlign: "center", padding: "5px", display: "flex", gap: "5px", justifyContent: "center" }}>
          <input id="vx" type="number" placeholder="X" defaultValue={4} style={{ width: "50px" }} />
          <input id="vy" type="number" placeholder="Y" defaultValue={4} style={{ width: "50px" }} />
          <input id="vz" type="number" placeholder="Z" defaultValue={0} style={{ width: "50px" }} />
          <button onClick={() => {
            const x = Number((document.getElementById("vx") as HTMLInputElement).value);
            const y = Number((document.getElementById("vy") as HTMLInputElement).value);
            const z = Number((document.getElementById("vz") as HTMLInputElement).value);
            addVoxel(x, y, z);
          }}>追加</button>
          <button onClick={() => {
            const x = Number((document.getElementById("vx") as HTMLInputElement).value);
            const y = Number((document.getElementById("vy") as HTMLInputElement).value);
            const z = Number((document.getElementById("vz") as HTMLInputElement).value);
            removeVoxel(x, y, z);
          }}>削除</button>
          <button onClick={() => {
            const data = JSON.stringify({ name: "shogi-piece", size: 8, voxels }, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "voxel-model.json";
            a.click();
          }}>保存</button>

      <button onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const data = JSON.parse(reader.result as string);
            setVoxels(data.voxels);
          };
          reader.readAsText(file);
        };
        input.click();
      }}>読み込み</button>
        </div>

        <canvas ref={canvasRef} style={{ width: "100%", height: "75vh" }} />
      </div>
    );
  }