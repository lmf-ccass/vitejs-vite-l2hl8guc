import { EVOLUTION_STRENGTH, MUTATION, BRANCH_BIAS } from './constants';

export const clamp = (v, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));
const rand = (m) => (Math.random() * 2 - 1) * m;

/** 依環境 + 當前狀態計算各特徵的「目標值」 */
export function computeTargets(env, cur, branch) {
  const b = BRANCH_BIAS[branch];
  const aquatic = cur.aquatic > 50;
  const flying = !aquatic && cur.wingSpan > 55;
  const T = {};

  T.aquatic = env.waterDepth;

  // 體型：伯格曼法則 + 氧氣 + 重力 + 分支加成
  let body = 45 + (50 - env.temperature) * 0.4 + (env.oxygen - 50) * 0.5
           - (env.gravity - 50) * 0.4 + b.bodyBonus;
  if (aquatic) body += (env.waterExpand ?? env.waterExpanse - 50) * 0 + (env.waterExpanse - 50) * 0.6;
  // 大翅膀 → 體型上限（太重飛不起來）
  if (flying) body = Math.min(body, 55 - (cur.wingSpan - 55) * 0.6);
  T.bodySize = clamp(body);

  // 四肢：陸生受獵物速度/重力影響；水生轉鰭
  T.limbLength = aquatic ? 20
    : clamp(35 + env.preySpeed * 0.4 - (env.gravity - 50) * 0.5);

  // 脖子 / 耳朵：水生退化至 0
  T.neckLength = aquatic ? 0 : clamp(10 + env.foodHeight * 0.8);
  T.earSize    = aquatic ? 0 : clamp(10 + env.temperature * 0.8);

  // 流線型 / 尾巴：水生 + 廣闊度連動
  T.streamline = aquatic
    ? clamp(25 + env.preySpeed * 0.4 + env.waterExpanse * 0.4) : 10;
  T.tailLength = aquatic
    ? clamp(30 + env.waterExpanse * 0.6) : clamp(30 + env.preySpeed * 0.2);

  // 翅膀：地形 + 捕食者；高重力大幅削弱；水生為 0
  const flightPressure = (env.terrain * 0.6 + env.predator * 0.4) * b.flightMul;
  const gravityPenalty = 1 - 0.9 * (env.gravity / 100);
  T.wingSpan = aquatic ? 0 : clamp(flightPressure * gravityPenalty);

  // 眼睛 / 發光
  T.eyeSize = clamp(20 + (100 - env.light) * 0.8);
  T.bioluminescence = env.light < 15 ? clamp((15 - env.light) / 15 * 100) : 0;

  T.dietHardness = env.dietHardness;
  T.camouflage = clamp(env.vegetation * 0.6 + env.predator * 0.4);

  // 色相：陸生 棕→綠（隨濕度）；水生 青→深藍
  T.hue = (aquatic ? 180 + (env.waterDepth - 50) * 1.2 : 30 + env.humidity * 0.9)
        + b.hueShift;

  return T;
}

/** 演化 N 代 */
export function evolve(traits, env, branch, steps = 1) {
  let cur = { ...traits };
  for (let i = 0; i < steps; i++) {
    const T = computeTargets(env, cur, branch);
    const next = {};
    for (const k of Object.keys(cur)) {
      const mut = rand(k === 'hue' ? MUTATION * 3 : MUTATION);
      const v = cur[k] + (T[k] - cur[k]) * EVOLUTION_STRENGTH + mut;
      next[k] = k === 'hue' ? Math.min(360, Math.max(0, v)) : clamp(v);
    }
    // 關鍵連動：水生時退化器官
    if (next.aquatic > 50) {
      next.earSize *= 0.97; next.neckLength *= 0.97; next.wingSpan *= 0.95;
    }
    // 體型限制：大翅膀的陸生/飛行動物
    if (next.aquatic <= 50 && next.wingSpan > 55) {
      next.bodySize = Math.min(next.bodySize, 55 - (next.wingSpan - 55) * 0.6);
    }
    cur = next;
  }
  return cur;
}