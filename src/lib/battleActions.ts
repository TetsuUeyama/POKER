import { Scene, MeshBuilder, Vector3, Color3, Mesh } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core";
import { PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
import { Humanoid } from "./createHumanoid";

// 弾を発射する
export function shootBullet(
  scene: Scene, from: Mesh, target: Mesh, power: number, model: Humanoid,
) {
  model.playShoot();

  const bulletMat = new StandardMaterial("bulletMat_" + Date.now(), scene);
  bulletMat.diffuseColor = new Color3(1, 1, 0);
  const bullet = MeshBuilder.CreateSphere("bullet_" + Date.now(), { diameter: 0.15 }, scene);
  bullet.material = bulletMat;
  bullet.position = from.position.clone();
  bullet.position.y = 0.8;

  new PhysicsAggregate(bullet, PhysicsShapeType.SPHERE, { mass: 0.1, restitution: 0.2 }, scene);

  const direction = target.position.subtract(from.position).normalize();
  const force = direction.scale(power * 0.8);
  setTimeout(() => {
    if (bullet.physicsBody) {
      bullet.physicsBody.applyImpulse(force, bullet.getAbsolutePosition());
    }
  }, 50);

  let hitChecks = 0;
  const observer = scene.onBeforeRenderObservable.add(() => {
    hitChecks++;
    if (hitChecks < 5) return;
    const dist = Vector3.Distance(bullet.position, target.position);
    if (dist < 0.8) {
      bullet.dispose();
      bulletMat.dispose();
      scene.onBeforeRenderObservable.remove(observer);
    }
    if (hitChecks > 120) {
      bullet.dispose();
      bulletMat.dispose();
      scene.onBeforeRenderObservable.remove(observer);
    }
  });
}

// パンチ（相手に大きな衝撃）
export function punchTarget(
  from: Mesh, target: Mesh, power: number, model: Humanoid,
) {
  model.playPunch();
  const targetBody = target.physicsBody;
  if (!targetBody) return;
  const direction = target.position.subtract(from.position).normalize();
  const impulse = direction.scale(power * 2);
  targetBody.applyImpulse(impulse, target.getAbsolutePosition());
}

// ダッシュ（自分を加速）
export function dashForward(
  unit: Mesh, target: Mesh, power: number,
) {
  const body = unit.physicsBody;
  if (!body) return;
  const direction = target.position.subtract(unit.position).normalize();
  const force = direction.scale(power * 1.5);
  body.applyImpulse(force, unit.getAbsolutePosition());
}

// ガード（一時的に重くする）
let guardTimeout: ReturnType<typeof setTimeout> | null = null;

export function activateGuard(
  unit: Mesh, power: number, model: Humanoid, defaultMass: number,
) {
  model.playGuard();
  const body = unit.physicsBody;
  if (!body) return;
  body.setMassProperties({ mass: 5 + power });
  if (guardTimeout) clearTimeout(guardTimeout);
  guardTimeout = setTimeout(() => {
    body.setMassProperties({ mass: defaultMass });
  }, 2000);
}
