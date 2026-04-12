  "use client";                                                                                                                                       
  import { useEffect, useRef } from "react";                                                                                                            import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";                                                            
  import { StandardMaterial, Color3, ArcRotateCamera } from "@babylonjs/core";                                                                          import { SceneLoader } from "@babylonjs/core";                                                                                                        import "@babylonjs/loaders/glTF";                                                                                                                                                                                                                                                                         
  export default function ScenePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 3, 5, new Vector3(0, 0.6, 0), scene);
      camera.attachControl(canvasRef.current, true);
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // 盤面
      const boardMat = new StandardMaterial("boardMat", scene);
      boardMat.diffuseColor = new Color3(0.87, 0.72, 0.53);
      const board = MeshBuilder.CreateBox("board", { width: 9, height: 0.2, depth: 9 }, scene);
      board.material = boardMat;

      // glTFモデルを読み込み
      SceneLoader.ImportMesh("", "/models/", "shogi_piece.glb", scene, (meshes) => {
        console.log("読み込んだメッシュ数:", meshes.length);
        meshes.forEach((mesh) => {
          mesh.position.y = 0.1; // 盤面の上に配置
        });
      });

      engine.runRenderLoop(() => scene.render());
      return () => engine.dispose();
    }, []);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
  }