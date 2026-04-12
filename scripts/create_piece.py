import bpy
import os

# 既存オブジェクトを全削除
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# 将棋の駒の形（五角形）を頂点で定義
# 正面から見た形: 底辺 → 両端が狭まり → 頂点
vertices = [
    # 前面（z=0.1）
    (-0.5, 0, 0.1),   # 0: 左下
    (0.5, 0, 0.1),    # 1: 右下
    (0.5, 0.7, 0.1),  # 2: 右中
    (0.3, 1.0, 0.1),  # 3: 右上
    (0, 1.2, 0.1),    # 4: 頂点
    (-0.3, 1.0, 0.1), # 5: 左上
    (-0.5, 0.7, 0.1), # 6: 左中
    # 背面（z=-0.1）
    (-0.5, 0, -0.1),  # 7
    (0.5, 0, -0.1),   # 8
    (0.5, 0.7, -0.1), # 9
    (0.3, 1.0, -0.1), # 10
    (0, 1.2, -0.1),   # 11
    (-0.3, 1.0, -0.1),# 12
    (-0.5, 0.7, -0.1),# 13
]

# 面を定義（頂点のインデックスで指定）
faces = [
    (0, 1, 2, 6),       # 前面下
    (2, 3, 4, 5, 6),    # 前面上
    (7, 13, 9, 8),      # 背面下
    (9, 13, 12, 11, 10),# 背面上
    (0, 7, 8, 1),       # 底面
    (1, 8, 9, 2),       # 右面下
    (2, 9, 10, 3),      # 右面上
    (3, 10, 11, 4),     # 右面頂点
    (4, 11, 12, 5),     # 左面頂点
    (5, 12, 13, 6),     # 左面上
    (6, 13, 7, 0),      # 左面下
]

# メッシュを作成
mesh = bpy.data.meshes.new("shogi_piece")
mesh.from_pydata(vertices, [], faces)
mesh.update()

# オブジェクトを作成してシーンに追加
obj = bpy.data.objects.new("ShogiPiece", mesh)
bpy.context.collection.objects.link(obj)

# マテリアル（木の色）を追加
mat = bpy.data.materials.new("WoodMaterial")
mat.diffuse_color = (0.87, 0.72, 0.53, 1.0)
obj.data.materials.append(mat)

# glTF形式でエクスポート
output_path = os.path.join(os.path.dirname(__file__), "..", "public", "models", "shogi_piece.glb")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB')

print(f"Exported to: {output_path}")
