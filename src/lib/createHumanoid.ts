import {
  Scene, MeshBuilder, Vector3, Color3, TransformNode, Mesh,
  StandardMaterial, Animation, AnimationGroup,
} from "@babylonjs/core";

export type Humanoid = {
  root: TransformNode;
  playIdle: () => void;
  playWalk: () => void;
  playShoot: () => void;
  playPunch: () => void;
  playGuard: () => void;
  stopAll: () => void;
};

export function createHumanoid(
  scene: Scene,
  name: string,
  color: Color3,
  position: Vector3,
): Humanoid {
  const root = new TransformNode(`${name}_root`, scene);
  root.position = position;

  const mat = new StandardMaterial(`${name}_mat`, scene);
  mat.diffuseColor = color;

  // ============================
  // パーツ構成
  // ============================
  //
  // root
  //  ├─ spine1Pivot (腰)
  //  │   └─ spine1
  //  │       └─ spine2Pivot (腹)
  //  │           └─ spine2
  //  │               └─ spine3Pivot (胸)
  //  │                   └─ spine3
  //  │                       ├─ head
  //  │                       ├─ leftArmPivot → upperArm → elbowPivot → lowerArm
  //  │                       └─ rightArmPivot → upperArm → elbowPivot → lowerArm
  //  ├─ leftLegPivot → upperLeg → kneePivot → lowerLeg
  //  └─ rightLegPivot → upperLeg → kneePivot → lowerLeg

  // ---- 胴体 spine1/2/3 ----
  // spine1（腰）
  const spine1Pivot = new TransformNode(`${name}_spine1_pivot`, scene);
  spine1Pivot.position = new Vector3(0, 0.5, 0);
  spine1Pivot.parent = root;

  const spine1 = MeshBuilder.CreateBox(`${name}_spine1`, { width: 0.38, height: 0.17, depth: 0.22 }, scene);
  spine1.material = mat;
  spine1.position = new Vector3(0, 0.085, 0);
  spine1.parent = spine1Pivot;

  // spine2（腹）
  const spine2Pivot = new TransformNode(`${name}_spine2_pivot`, scene);
  spine2Pivot.position = new Vector3(0, 0.17, 0);
  spine2Pivot.parent = spine1Pivot;

  const spine2 = MeshBuilder.CreateBox(`${name}_spine2`, { width: 0.36, height: 0.17, depth: 0.23 }, scene);
  spine2.material = mat;
  spine2.position = new Vector3(0, 0.085, 0);
  spine2.parent = spine2Pivot;

  // spine3（胸）
  const spine3Pivot = new TransformNode(`${name}_spine3_pivot`, scene);
  spine3Pivot.position = new Vector3(0, 0.17, 0);
  spine3Pivot.parent = spine2Pivot;

  const spine3 = MeshBuilder.CreateBox(`${name}_spine3`, { width: 0.4, height: 0.17, depth: 0.25 }, scene);
  spine3.material = mat;
  spine3.position = new Vector3(0, 0.085, 0);
  spine3.parent = spine3Pivot;

  // 頭（spine3の上に接続）
  const head = MeshBuilder.CreateSphere(`${name}_head`, { diameter: 0.3 }, scene);
  head.material = mat;
  head.position = new Vector3(0, 0.32, 0);
  head.parent = spine3Pivot;

  // 顔パーツ（正面方向 = +Z）
  const faceMat = new StandardMaterial(`${name}_face_mat`, scene);
  faceMat.diffuseColor = new Color3(0.1, 0.1, 0.1);

  const leftEye = MeshBuilder.CreateSphere(`${name}_leye`, { diameter: 0.06 }, scene);
  leftEye.material = faceMat;
  leftEye.position = new Vector3(-0.06, 0.03, 0.12);
  leftEye.parent = head;

  const rightEye = MeshBuilder.CreateSphere(`${name}_reye`, { diameter: 0.06 }, scene);
  rightEye.material = faceMat;
  rightEye.position = new Vector3(0.06, 0.03, 0.12);
  rightEye.parent = head;

  const mouth = MeshBuilder.CreateBox(`${name}_mouth`, { width: 0.08, height: 0.02, depth: 0.02 }, scene);
  mouth.material = faceMat;
  mouth.position = new Vector3(0, -0.05, 0.13);
  mouth.parent = head;

  // ---- 左腕（spine3に接続）----
  const leftArmPivot = new TransformNode(`${name}_larm_pivot`, scene);
  leftArmPivot.position = new Vector3(-0.28, 0.14, 0);
  leftArmPivot.parent = spine3Pivot;

  const upperLeftArm = MeshBuilder.CreateCylinder(`${name}_upper_larm`, { diameter: 0.12, height: 0.25 }, scene);
  upperLeftArm.material = mat;
  upperLeftArm.position = new Vector3(0, -0.125, 0);
  upperLeftArm.parent = leftArmPivot;

  const leftElbowPivot = new TransformNode(`${name}_lelbow_pivot`, scene);
  leftElbowPivot.position = new Vector3(0, -0.25, 0);
  leftElbowPivot.parent = leftArmPivot;

  const lowerLeftArm = MeshBuilder.CreateCylinder(`${name}_lower_larm`, { diameter: 0.10, height: 0.25 }, scene);
  lowerLeftArm.material = mat;
  lowerLeftArm.position = new Vector3(0, -0.125, 0);
  lowerLeftArm.parent = leftElbowPivot;

  // ---- 右腕（spine3に接続）----
  const rightArmPivot = new TransformNode(`${name}_rarm_pivot`, scene);
  rightArmPivot.position = new Vector3(0.28, 0.14, 0);
  rightArmPivot.parent = spine3Pivot;

  const upperRightArm = MeshBuilder.CreateCylinder(`${name}_upper_rarm`, { diameter: 0.12, height: 0.25 }, scene);
  upperRightArm.material = mat;
  upperRightArm.position = new Vector3(0, -0.125, 0);
  upperRightArm.parent = rightArmPivot;

  const rightElbowPivot = new TransformNode(`${name}_relbow_pivot`, scene);
  rightElbowPivot.position = new Vector3(0, -0.25, 0);
  rightElbowPivot.parent = rightArmPivot;

  const lowerRightArm = MeshBuilder.CreateCylinder(`${name}_lower_rarm`, { diameter: 0.10, height: 0.25 }, scene);
  lowerRightArm.material = mat;
  lowerRightArm.position = new Vector3(0, -0.125, 0);
  lowerRightArm.parent = rightElbowPivot;

  // ---- 左足（rootに接続）----
  const leftLegPivot = new TransformNode(`${name}_lleg_pivot`, scene);
  leftLegPivot.position = new Vector3(-0.12, 0.5, 0);
  leftLegPivot.parent = root;

  const upperLeftLeg = MeshBuilder.CreateCylinder(`${name}_upper_lleg`, { diameter: 0.14, height: 0.25 }, scene);
  upperLeftLeg.material = mat;
  upperLeftLeg.position = new Vector3(0, -0.125, 0);
  upperLeftLeg.parent = leftLegPivot;

  const leftKneePivot = new TransformNode(`${name}_lknee_pivot`, scene);
  leftKneePivot.position = new Vector3(0, -0.25, 0);
  leftKneePivot.parent = leftLegPivot;

  const lowerLeftLeg = MeshBuilder.CreateCylinder(`${name}_lower_lleg`, { diameter: 0.12, height: 0.25 }, scene);
  lowerLeftLeg.material = mat;
  lowerLeftLeg.position = new Vector3(0, -0.125, 0);
  lowerLeftLeg.parent = leftKneePivot;

  // ---- 右足（rootに接続）----
  const rightLegPivot = new TransformNode(`${name}_rleg_pivot`, scene);
  rightLegPivot.position = new Vector3(0.12, 0.5, 0);
  rightLegPivot.parent = root;

  const upperRightLeg = MeshBuilder.CreateCylinder(`${name}_upper_rleg`, { diameter: 0.14, height: 0.25 }, scene);
  upperRightLeg.material = mat;
  upperRightLeg.position = new Vector3(0, -0.125, 0);
  upperRightLeg.parent = rightLegPivot;

  const rightKneePivot = new TransformNode(`${name}_rknee_pivot`, scene);
  rightKneePivot.position = new Vector3(0, -0.25, 0);
  rightKneePivot.parent = rightLegPivot;

  const lowerRightLeg = MeshBuilder.CreateCylinder(`${name}_lower_rleg`, { diameter: 0.12, height: 0.25 }, scene);
  lowerRightLeg.material = mat;
  lowerRightLeg.position = new Vector3(0, -0.125, 0);
  lowerRightLeg.parent = rightKneePivot;

  // ============================
  // アニメーション
  // ============================

  const fps = 30;
  let currentAnim: AnimationGroup | null = null;

  function stopAll() {
    if (currentAnim) {
      currentAnim.stop();
      currentAnim = null;
    }
    spine1Pivot.rotation = Vector3.Zero();
    spine2Pivot.rotation = Vector3.Zero();
    spine3Pivot.rotation = Vector3.Zero();
    leftArmPivot.rotation = Vector3.Zero();
    rightArmPivot.rotation = Vector3.Zero();
    leftElbowPivot.rotation = Vector3.Zero();
    rightElbowPivot.rotation = Vector3.Zero();
    leftLegPivot.rotation = Vector3.Zero();
    rightLegPivot.rotation = Vector3.Zero();
    leftKneePivot.rotation = Vector3.Zero();
    rightKneePivot.rotation = Vector3.Zero();
  }

  // ヘルパー
  function rotAnim(animName: string, keys: { frame: number; value: number }[], loop: boolean) {
    const anim = new Animation(animName, "rotation.x", fps, Animation.ANIMATIONTYPE_FLOAT,
      loop ? Animation.ANIMATIONLOOPMODE_CYCLE : Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.setKeys(keys);
    return anim;
  }

  // 待機
  function playIdle() {
    stopAll();
    const group = new AnimationGroup(`${name}_idle`, scene);

    // 胴体が軽く上下（spine1で）
    const sp1Bob = new Animation(`${name}_idle_sp1`, "position.y", fps, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    sp1Bob.setKeys([
      { frame: 0, value: 0.5 }, { frame: 15, value: 0.53 }, { frame: 30, value: 0.5 },
    ]);
    group.addTargetedAnimation(sp1Bob, spine1Pivot);

    // 肘を軽く曲げる（前腕が前に出る = 正の回転）
    group.addTargetedAnimation(rotAnim(`${name}_idle_le`, [
      { frame: 0, value: -0.3 }, { frame: 15, value: -0.4 }, { frame: 30, value: -0.3 },
    ], true), leftElbowPivot);
    group.addTargetedAnimation(rotAnim(`${name}_idle_re`, [
      { frame: 0, value: -0.3 }, { frame: 15, value: -0.4 }, { frame: 30, value: -0.3 },
    ], true), rightElbowPivot);

    group.play(true);
    currentAnim = group;
  }

  // 歩行
  function playWalk() {
    stopAll();
    const group = new AnimationGroup(`${name}_walk`, scene);
    const s = 0.5;
    const e = 0.5;

    // 左腕（肩: 前+が前方振り）
    group.addTargetedAnimation(rotAnim(`${name}_w_la`, [
      { frame: 0, value: -s }, { frame: 10, value: 0 }, { frame: 20, value: s }, { frame: 30, value: 0 }, { frame: 40, value: -s },
    ], true), leftArmPivot);
    // 左肘（前腕が後ろに曲がる = 負の値、腕が前にあるとき曲がる）
    group.addTargetedAnimation(rotAnim(`${name}_w_le`, [
      { frame: 0, value: -0.1 }, { frame: 10, value: -e }, { frame: 20, value: -0.1 }, { frame: 30, value: 0 }, { frame: 40, value: -0.1 },
    ], true), leftElbowPivot);

    // 右腕（逆位相）
    group.addTargetedAnimation(rotAnim(`${name}_w_ra`, [
      { frame: 0, value: s }, { frame: 10, value: 0 }, { frame: 20, value: -s }, { frame: 30, value: 0 }, { frame: 40, value: s },
    ], true), rightArmPivot);
    group.addTargetedAnimation(rotAnim(`${name}_w_re`, [
      { frame: 0, value: -0.1 }, { frame: 10, value: 0 }, { frame: 20, value: -0.1 }, { frame: 30, value: -e }, { frame: 40, value: -0.1 },
    ], true), rightElbowPivot);

    // 左足
    group.addTargetedAnimation(rotAnim(`${name}_w_ll`, [
      { frame: 0, value: -s }, { frame: 10, value: 0 }, { frame: 20, value: s }, { frame: 30, value: 0 }, { frame: 40, value: -s },
    ], true), leftLegPivot);
    // 左膝（足が後ろにあるとき曲がる = 正の値で脛が後ろへ）
    group.addTargetedAnimation(rotAnim(`${name}_w_lk`, [
      { frame: 0, value: 0 }, { frame: 10, value: 0 }, { frame: 20, value: e }, { frame: 30, value: e * 1.5 }, { frame: 40, value: 0 },
    ], true), leftKneePivot);

    // 右足（逆位相）
    group.addTargetedAnimation(rotAnim(`${name}_w_rl`, [
      { frame: 0, value: s }, { frame: 10, value: 0 }, { frame: 20, value: -s }, { frame: 30, value: 0 }, { frame: 40, value: s },
    ], true), rightLegPivot);
    group.addTargetedAnimation(rotAnim(`${name}_w_rk`, [
      { frame: 0, value: e }, { frame: 10, value: e * 1.5 }, { frame: 20, value: 0 }, { frame: 30, value: 0 }, { frame: 40, value: e },
    ], true), rightKneePivot);

    // spine2を歩行に合わせて軽くひねる
    group.addTargetedAnimation(rotAnim(`${name}_w_sp2`, [
      { frame: 0, value: 0.03 }, { frame: 10, value: 0 }, { frame: 20, value: -0.03 }, { frame: 30, value: 0 }, { frame: 40, value: 0.03 },
    ], true), spine2Pivot);

    group.play(true);
    currentAnim = group;
  }

  // 射撃: 右腕を前に突き出す
  function playShoot() {
    stopAll();
    const group = new AnimationGroup(`${name}_shoot`, scene);

    group.addTargetedAnimation(rotAnim(`${name}_s_ra`, [
      { frame: 0, value: 0 }, { frame: 5, value: -1.3 }, { frame: 15, value: -1.3 }, { frame: 20, value: 0 },
    ], false), rightArmPivot);
    // 肘を伸ばす
    group.addTargetedAnimation(rotAnim(`${name}_s_re`, [
      { frame: 0, value: 0 }, { frame: 5, value: 0 }, { frame: 15, value: 0 }, { frame: 20, value: 0 },
    ], false), rightElbowPivot);
    // 胸を少し前に
    group.addTargetedAnimation(rotAnim(`${name}_s_sp3`, [
      { frame: 0, value: 0 }, { frame: 5, value: 0.1 }, { frame: 15, value: 0.1 }, { frame: 20, value: 0 },
    ], false), spine3Pivot);

    group.play(false);
    currentAnim = group;
    group.onAnimationEndObservable.addOnce(() => playWalk());
  }

  // パンチ: 右腕を振り上げて叩く
  function playPunch() {
    stopAll();
    const group = new AnimationGroup(`${name}_punch`, scene);

    // 振りかぶり → 叩きつけ
    group.addTargetedAnimation(rotAnim(`${name}_p_ra`, [
      { frame: 0, value: 0 }, { frame: 3, value: -1.8 }, { frame: 8, value: 0.5 }, { frame: 15, value: 0 },
    ], false), rightArmPivot);
    // 肘を曲げて振りかぶり → 伸ばして叩く
    group.addTargetedAnimation(rotAnim(`${name}_p_re`, [
      { frame: 0, value: 0 }, { frame: 3, value: -1.2 }, { frame: 8, value: 0 }, { frame: 15, value: 0 },
    ], false), rightElbowPivot);

    // spine3を前傾
    group.addTargetedAnimation(rotAnim(`${name}_p_sp3`, [
      { frame: 0, value: 0 }, { frame: 5, value: 0.25 }, { frame: 15, value: 0 },
    ], false), spine3Pivot);
    // spine2も少し
    group.addTargetedAnimation(rotAnim(`${name}_p_sp2`, [
      { frame: 0, value: 0 }, { frame: 5, value: 0.1 }, { frame: 15, value: 0 },
    ], false), spine2Pivot);

    group.play(false);
    currentAnim = group;
    group.onAnimationEndObservable.addOnce(() => playWalk());
  }

  // ガード: 両腕を上げて前腕を曲げて構える
  function playGuard() {
    stopAll();
    const group = new AnimationGroup(`${name}_guard`, scene);

    // 両肩を上げる
    group.addTargetedAnimation(rotAnim(`${name}_g_la`, [
      { frame: 0, value: 0 }, { frame: 5, value: -1.0 }, { frame: 50, value: -1.0 }, { frame: 55, value: 0 },
    ], false), leftArmPivot);
    group.addTargetedAnimation(rotAnim(`${name}_g_ra`, [
      { frame: 0, value: 0 }, { frame: 5, value: -1.0 }, { frame: 50, value: -1.0 }, { frame: 55, value: 0 },
    ], false), rightArmPivot);
    // 前腕を内側に曲げる（肘を曲げる = 負の回転で前腕が前に）
    group.addTargetedAnimation(rotAnim(`${name}_g_le`, [
      { frame: 0, value: 0 }, { frame: 5, value: -1.5 }, { frame: 50, value: -1.5 }, { frame: 55, value: 0 },
    ], false), leftElbowPivot);
    group.addTargetedAnimation(rotAnim(`${name}_g_re`, [
      { frame: 0, value: 0 }, { frame: 5, value: -1.5 }, { frame: 50, value: -1.5 }, { frame: 55, value: 0 },
    ], false), rightElbowPivot);

    // 少し身を縮める
    group.addTargetedAnimation(rotAnim(`${name}_g_sp2`, [
      { frame: 0, value: 0 }, { frame: 5, value: 0.15 }, { frame: 50, value: 0.15 }, { frame: 55, value: 0 },
    ], false), spine2Pivot);

    group.play(false);
    currentAnim = group;
    group.onAnimationEndObservable.addOnce(() => playWalk());
  }

  return {
    root,
    playIdle, playWalk, playShoot, playPunch, playGuard, stopAll,
  };
}
