  // 1つのボクセル（ブロック）
  export type Voxel = {
    x: number;
    y: number;
    z: number;
    color: string;  // 例: "#ff0000"
  };

  // ボクセルモデル全体
  export type VoxelModel = {
    name: string;
    size: number;      // グリッドのサイズ（例: 8 → 8x8x8）
    voxels: Voxel[];   // 配置されたボクセルのリスト
  };
