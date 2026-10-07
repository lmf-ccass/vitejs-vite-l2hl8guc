export const ENV_PARAMS = [
  { key: 'temperature',   label: '氣候溫度',   hint: '低溫→體大 / 高溫→大耳' },
  { key: 'humidity',      label: '氣候濕度',   hint: '濕潤→體色深' },
  { key: 'oxygen',        label: '氧氣濃度',   hint: '高氧→巨大化' },
  { key: 'gravity',       label: '重力大小',   hint: '高重力→矮壯、難飛' },
  { key: 'waterDepth',    label: '水域深度',   hint: '>50 走向水生' },
  { key: 'waterExpanse',  label: '水域廣闊度', hint: '廣闊→體大、流線、尾發達' },
  { key: 'preySpeed',     label: '獵物速度',   hint: '陸:四肢長 / 水:流線' },
  { key: 'foodHeight',    label: '食物高度',   hint: '陸生→長頸' },
  { key: 'predator',      label: '捕食者威脅', hint: '保護色 / 飛行逃生' },
  { key: 'light',         label: '光照強度',   hint: '低光→大眼 / 極低→發光' },
  { key: 'terrain',       label: '地形陡峭度', hint: '高落差→翅膀' },
  { key: 'dietHardness',  label: '食物硬度',   hint: '硬→粗壯彎喙' },
  { key: 'vegetation',    label: '植被密度',   hint: '茂密→保護色斑紋' },
];

export const DEFAULT_ENV = Object.fromEntries(ENV_PARAMS.map(p => [p.key, 50]));

export const ANCESTOR = {
  aquatic: 20, bodySize: 40, limbLength: 50, neckLength: 30,
  earSize: 30, tailLength: 40, streamline: 20, wingSpan: 15,
  eyeSize: 40, dietHardness: 40, camouflage: 20, hue: 30,
  bioluminescence: 0,
};

export const TRAIT_LABELS = {
  aquatic: '水生程度', bodySize: '體型', limbLength: '四肢', neckLength: '脖子',
  earSize: '耳朵', tailLength: '尾巴', streamline: '流線型', wingSpan: '翼展',
  eyeSize: '眼睛', dietHardness: '喙/顎', camouflage: '保護色', bioluminescence: '生物發光',
};

export const EVOLUTION_STRENGTH = 0.015;
export const MUTATION = 0.3;

// 同源分歧：兩個分支的微小偏差
export const BRANCH_BIAS = {
  1: { bodyBonus: 20, flightMul: 1.0, hueShift: 0 },
  2: { bodyBonus: 0,  flightMul: 1.5, hueShift: 25 },
};