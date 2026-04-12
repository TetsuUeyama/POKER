"""
ボクセルJSON → ボーン付き3Dモデル（.glb）変換スクリプト

使い方:
  blender --background --python scripts/create_voxel_character.py

学習ポイント:
  1. JSONからボクセルデータを読み込む
  2. 各ボクセルを立方体メッシュとして生成
  3. 全体を1つのメッシュに結合（Join）
  4. アーマチュア（骨格）を作成
  5. 各頂点をボーンに紐付け（スキニング / ウェイト設定）
  6. 複数アニメーション（Action）を作成 — idle / attack / damage
  7. glTFエクスポート（複数 AnimationGroup として出力）
"""

import bpy
import json
import os
import math

# ====================
# 0. 準備: シーンをクリア
# ====================
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ====================
# 1. JSONからボクセルデータを読み込む
# ====================
json_path = os.path.join(os.path.dirname(__file__), "..", "public", "models", "samurai_voxel.json")
with open(json_path, "r") as f:
    data = json.load(f)

voxels = data["voxels"]
print(f"読み込んだボクセル数: {len(voxels)}")

# ====================
# 2. 各ボクセルを立方体メッシュとして生成 + 頂点グループを割り当て
# ====================
# 【変更点】Join する前に各立方体に頂点グループを設定する
# → Join 時に同名の頂点グループが自動的にマージされる
# → 頂点インデックスのずれを気にしなくてよい（最も確実な方法）

for i, voxel in enumerate(voxels):
    bpy.ops.mesh.primitive_cube_add(size=0.95, location=(voxel["x"], voxel["z"], voxel["y"]))
    # ↑ Blender は Z が上方向なので、JSON の y → Blender の z に変換

    cube = bpy.context.active_object
    cube.name = f"voxel_{i}"

    # マテリアル（色）を設定
    mat = bpy.data.materials.new(f"mat_{i}")
    hex_color = voxel["color"].lstrip("#")
    r = int(hex_color[0:2], 16) / 255
    g = int(hex_color[2:4], 16) / 255
    b = int(hex_color[4:6], 16) / 255
    mat.diffuse_color = (r, g, b, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    cube.data.materials.append(mat)

    # 【ここが新しい】Join 前に、この立方体に頂点グループを割り当てる
    bone_name = voxel.get("bone", "spine")
    vg = cube.vertex_groups.new(name=bone_name)
    # この立方体の全頂点（0〜7）をウェイト1.0で追加
    all_vert_indices = list(range(len(cube.data.vertices)))
    vg.add(all_vert_indices, 1.0, 'REPLACE')
    print(f"  voxel_{i}: bone='{bone_name}', 頂点数={len(cube.data.vertices)}")

# ====================
# 3. 全ての立方体を1つのメッシュに結合（Join）
# ====================
# Join すると、同じ名前の頂点グループが自動マージされる
# 例: voxel_5 と voxel_7 にそれぞれ "leg.L" グループがある
#   → Join 後は1つの "leg.L" グループに両方の頂点が含まれる

bpy.ops.object.select_all(action='SELECT')
bpy.context.view_layer.objects.active = bpy.data.objects["voxel_0"]
bpy.ops.object.join()

character_mesh = bpy.context.active_object
character_mesh.name = "SamuraiVoxel"

# 頂点グループの確認
print(f"\n結合後の頂点数: {len(character_mesh.data.vertices)}")
print("頂点グループ一覧:")
for vg in character_mesh.vertex_groups:
    # このグループに属する頂点数を数える
    count = 0
    for v in character_mesh.data.vertices:
        for g in v.groups:
            if g.group == vg.index:
                count += 1
    print(f"  '{vg.name}': {count}頂点")

# ====================
# 4. アーマチュア（骨格）を作成
# ====================
# アーマチュア = ボーンの入れ物
# Edit Mode で個々のボーンを追加する

bpy.ops.object.armature_add(location=(1, 0, 0))
armature_obj = bpy.context.active_object
armature_obj.name = "Armature"
armature = armature_obj.data
armature.name = "SamuraiSkeleton"

# Edit Mode に入ってボーンを編集
bpy.ops.object.mode_set(mode='EDIT')

# デフォルトのボーンを root に使う
# ボーンの head = 根元の位置、tail = 先端の位置
root_bone = armature.edit_bones[0]
root_bone.name = "root"
root_bone.head = (0, 0, 2)    # 腰の位置（x=0はアーマチュアのローカル座標）
root_bone.tail = (0, 0, 2.5)

# spine（胴体）— root の子
spine = armature.edit_bones.new("spine")
spine.head = (0, 0, 2)
spine.tail = (0, 0, 3.5)
spine.parent = root_bone

# head（頭）— spine の子
head = armature.edit_bones.new("head")
head.head = (0, 0, 3.5)
head.tail = (0, 0, 4.5)
head.parent = spine

# arm.L（左腕）— spine の子
arm_l = armature.edit_bones.new("arm.L")
arm_l.head = (0, 0, 3)
arm_l.tail = (-1, 0, 3)  # 左に伸びる
arm_l.parent = spine

# arm.R（右腕）— spine の子
arm_r = armature.edit_bones.new("arm.R")
arm_r.head = (0, 0, 3)
arm_r.tail = (1, 0, 3)   # 右に伸びる
arm_r.parent = spine

# leg.L（左脚）— root の子
leg_l = armature.edit_bones.new("leg.L")
leg_l.head = (-0.5, 0, 2)
leg_l.tail = (-0.5, 0, 0)  # 下に伸びる
leg_l.parent = root_bone

# leg.R（右脚）— root の子
leg_r = armature.edit_bones.new("leg.R")
leg_r.head = (0.5, 0, 2)
leg_r.tail = (0.5, 0, 0)
leg_r.parent = root_bone

# Object Mode に戻る
bpy.ops.object.mode_set(mode='OBJECT')

print("ボーン構造:")
for bone in armature.edit_bones if armature.edit_bones else armature.bones:
    parent_name = bone.parent.name if bone.parent else "なし"
    print(f"  {bone.name} (親: {parent_name})")

# ====================
# 5. スキニング（メッシュとアーマチュアの紐付け）
# ====================

# 5a. メッシュをアーマチュアの子にする（Armature モディファイア）
character_mesh.select_set(True)
armature_obj.select_set(True)
bpy.context.view_layer.objects.active = armature_obj
bpy.ops.object.parent_set(type='ARMATURE_NAME')
# ↑ これで character_mesh にアーマチュアモディファイアが自動追加される
# ↑ 'ARMATURE_NAME' = ボーン名と同名の頂点グループを使ってウェイトを設定する方式

# 5b. 頂点グループの確認（Join 前に設定済み）
bpy.context.view_layer.objects.active = character_mesh
print("\nスキニング確認（Join 前に設定済みの頂点グループ）:")
for vg in character_mesh.vertex_groups:
    count = sum(1 for v in character_mesh.data.vertices for g in v.groups if g.group == vg.index)
    print(f"  '{vg.name}': {count}頂点 (ウェイト1.0)")

# ====================
# 6. 複数アニメーション（Action）を作成
# ====================
#
# 【重要な概念: Action】
# Action = キーフレームの集まり。1つのモーションに対して1つの Action を作る。
# glTF エクスポート時に、各 Action は AnimationGroup として出力される。
# Babylon.js 側では animationGroups の名前で呼び分けて再生できる。
#
# 【NLA (Non-Linear Animation) Editor】
# 複数の Action を管理するための仕組み。
# Action を NLA トラックに「Push」すると、エクスポート時に全 Action が含まれる。
# Push しないと、最後に編集した Action しかエクスポートされない。

bpy.context.view_layer.objects.active = armature_obj
bpy.ops.object.mode_set(mode='POSE')

# ポーズボーンへの参照を取得
root_pose = armature_obj.pose.bones["root"]
spine_pose = armature_obj.pose.bones["spine"]
head_pose = armature_obj.pose.bones["head"]
arm_l_pose = armature_obj.pose.bones["arm.L"]
arm_r_pose = armature_obj.pose.bones["arm.R"]
leg_l_pose = armature_obj.pose.bones["leg.L"]
leg_r_pose = armature_obj.pose.bones["leg.R"]

# --- ヘルパー関数 ---
def reset_all_bones():
    """全ボーンをデフォルト位置/回転に戻す"""
    for bone in armature_obj.pose.bones:
        bone.location = (0, 0, 0)
        bone.rotation_euler = (0, 0, 0)

def create_action(name):
    """
    新しい Action を作成してアーマチュアに割り当てる。

    Action の仕組み:
    - bpy.data.actions.new(name) で新しい Action を作る
    - armature_obj.animation_data.action に代入すると、
      以降の keyframe_insert はその Action に記録される
    """
    action = bpy.data.actions.new(name=name)
    if not armature_obj.animation_data:
        armature_obj.animation_data_create()
    armature_obj.animation_data.action = action
    reset_all_bones()
    return action

def push_to_nla(action):
    """
    Action を NLA トラックに Push する。

    なぜ必要か:
    - アーマチュアの animation_data.action には1つしか設定できない
    - 新しい Action を作ると、前の Action が上書きされる
    - NLA に Push しておくと、エクスポート時に全 Action が含まれる
    """
    track = armature_obj.animation_data.nla_tracks.new()
    track.name = action.name
    track.strips.new(action.name, int(action.frame_range[0]), action)
    armature_obj.animation_data.action = None  # アクティブから外す

# ============================
# Action 1: idle（待機）
# ============================
# 軽く上下に揺れる + 腕が少し揺れる
idle_action = create_action("idle")

# root: 上下に浮遊
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=1)
root_pose.location = (0, 0, 0.15)
root_pose.keyframe_insert(data_path="location", frame=15)
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=30)

# 腕: 軽く前後に揺れる
arm_l_pose.rotation_euler = (0, 0, 0)
arm_l_pose.keyframe_insert(data_path="rotation_euler", frame=1)
arm_l_pose.rotation_euler = (0, math.radians(10), 0)
arm_l_pose.keyframe_insert(data_path="rotation_euler", frame=15)
arm_l_pose.rotation_euler = (0, 0, 0)
arm_l_pose.keyframe_insert(data_path="rotation_euler", frame=30)

arm_r_pose.rotation_euler = (0, 0, 0)
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=1)
arm_r_pose.rotation_euler = (0, math.radians(-10), 0)
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=15)
arm_r_pose.rotation_euler = (0, 0, 0)
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=30)

push_to_nla(idle_action)
print("Action 'idle': 30フレーム（上下浮遊 + 腕揺れ）")

# ============================
# Action 2: attack（攻撃）
# ============================
# 右腕を大きく振り下ろす + 体を前に傾ける
attack_action = create_action("attack")

# フレーム 1: 構え（溜め）
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=1)
spine_pose.rotation_euler = (0, 0, 0)
spine_pose.keyframe_insert(data_path="rotation_euler", frame=1)
arm_r_pose.rotation_euler = (0, 0, 0)
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=1)

# フレーム 5: 腕を後ろに振りかぶる
arm_r_pose.rotation_euler = (0, math.radians(-60), 0)  # 後ろに引く
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=5)
spine_pose.rotation_euler = (0, math.radians(-10), 0)  # 少し後ろに反る
spine_pose.keyframe_insert(data_path="rotation_euler", frame=5)

# フレーム 8: 振り下ろし（速い！ フレーム間隔が短い = 速い動き）
arm_r_pose.rotation_euler = (0, math.radians(80), 0)   # 前に大きく振る
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=8)
spine_pose.rotation_euler = (0, math.radians(15), 0)   # 前に傾く
spine_pose.keyframe_insert(data_path="rotation_euler", frame=8)
root_pose.location = (0, 0.2, 0)  # 少し前に踏み込む
root_pose.keyframe_insert(data_path="location", frame=8)

# フレーム 15: 戻り
arm_r_pose.rotation_euler = (0, 0, 0)
arm_r_pose.keyframe_insert(data_path="rotation_euler", frame=15)
spine_pose.rotation_euler = (0, 0, 0)
spine_pose.keyframe_insert(data_path="rotation_euler", frame=15)
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=15)

push_to_nla(attack_action)
print("Action 'attack': 15フレーム（振りかぶり → 振り下ろし → 戻り）")

# ============================
# Action 3: damage（被ダメージ）
# ============================
# 後ろによろめく + 頭が揺れる
damage_action = create_action("damage")

# フレーム 1: 通常状態
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=1)
spine_pose.rotation_euler = (0, 0, 0)
spine_pose.keyframe_insert(data_path="rotation_euler", frame=1)
head_pose.rotation_euler = (0, 0, 0)
head_pose.keyframe_insert(data_path="rotation_euler", frame=1)

# フレーム 3: 衝撃（速い！）
root_pose.location = (0, -0.3, 0)  # 後ろに押される
root_pose.keyframe_insert(data_path="location", frame=3)
spine_pose.rotation_euler = (0, math.radians(-20), 0)  # 仰け反る
spine_pose.keyframe_insert(data_path="rotation_euler", frame=3)
head_pose.rotation_euler = (0, math.radians(-15), 0)   # 頭が後ろに
head_pose.keyframe_insert(data_path="rotation_euler", frame=3)

# フレーム 8: 少し戻る
root_pose.location = (0, -0.1, 0)
root_pose.keyframe_insert(data_path="location", frame=8)
spine_pose.rotation_euler = (0, math.radians(5), 0)  # 少し前に反動
spine_pose.keyframe_insert(data_path="rotation_euler", frame=8)
head_pose.rotation_euler = (0, math.radians(5), 0)
head_pose.keyframe_insert(data_path="rotation_euler", frame=8)

# フレーム 12: 元に戻る
root_pose.location = (0, 0, 0)
root_pose.keyframe_insert(data_path="location", frame=12)
spine_pose.rotation_euler = (0, 0, 0)
spine_pose.keyframe_insert(data_path="rotation_euler", frame=12)
head_pose.rotation_euler = (0, 0, 0)
head_pose.keyframe_insert(data_path="rotation_euler", frame=12)

push_to_nla(damage_action)
print("Action 'damage': 12フレーム（衝撃 → よろめき → 回復）")

bpy.ops.object.mode_set(mode='OBJECT')

# アニメーションの設定
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 30
bpy.context.scene.render.fps = 30

print(f"\n全 Action 数: {len(bpy.data.actions)}")

# ====================
# 7. glTFエクスポート
# ====================
output_path = os.path.join(os.path.dirname(__file__), "..", "public", "models", "samurai_voxel.glb")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_animations=True,     # アニメーションを含める
)

print(f"エクスポート完了: {output_path}")
