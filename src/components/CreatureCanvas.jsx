import { useEffect, useRef } from 'react';

function draw(ctx, t, env, W, H) {
  ctx.clearRect(0, 0, W, H);
  const aquatic = t.aquatic > 50;
  const flying = !aquatic && t.wingSpan > 55;

  // 背景
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (aquatic) { g.addColorStop(0, '#0b4a75'); g.addColorStop(1, '#03111f'); }
  else { g.addColorStop(0, `hsl(210,40%,${12 + env.light * 0.3}%)`); g.addColorStop(1, `hsl(30,25%,${6 + env.light * 0.15}%)`); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  const s = 0.55 + (t.bodySize / 100) * 0.85;
  const L = Math.max(25, 62 - env.humidity * 0.3);
  const col = `hsl(${t.hue},45%,${L}%)`;
  const dark = `hsl(${t.hue},50%,${L - 14}%)`;
  const sl = aquatic ? t.streamline / 100 : 0;
  const bw = 60 * s * (1 + sl * 0.7), bh = 36 * s * (1 - sl * 0.3);
  const limb = (12 + t.limbLength * 0.7) * s;
  const thick = (4 + env.gravity * 0.1) * s;
  const neck = aquatic ? 0 : t.neckLength * 1.1 * s;
  const gy = H * 0.86;
  const cx = W / 2 - 20;
  const cy = aquatic ? H * 0.5 : gy - limb - bh * 0.7;

  ctx.lineCap = 'round';
  if (!aquatic) { ctx.fillStyle = '#00000055'; ctx.fillRect(0, gy, W, H - gy); }

  // 尾巴
  const tl = (10 + t.tailLength * 0.9) * s;
  ctx.strokeStyle = dark; ctx.fillStyle = dark; ctx.lineWidth = thick * 1.2;
  ctx.beginPath();
  if (aquatic) {
    ctx.moveTo(cx - bw * 0.9, cy);
    ctx.lineTo(cx - bw - tl, cy - tl * 0.45);
    ctx.lineTo(cx - bw - tl * 0.8, cy);
    ctx.lineTo(cx - bw - tl, cy + tl * 0.45);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.moveTo(cx - bw * 0.9, cy);
    ctx.quadraticCurveTo(cx - bw - tl * 0.5, cy + tl * 0.1, cx - bw - tl, cy + tl * 0.35);
    ctx.stroke();
  }

  // 四肢 / 鰭
  if (!aquatic) {
    ctx.strokeStyle = dark; ctx.lineWidth = thick;
    [-0.6, -0.35, 0.35, 0.6].forEach(o => {
      ctx.beginPath(); ctx.moveTo(cx + bw * o, cy + bh * 0.5); ctx.lineTo(cx + bw * o, gy); ctx.stroke();
    });
  } else {
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(cx + bw * 0.1, cy + bh * 0.6);
    ctx.lineTo(cx - bw * 0.3, cy + bh * 1.6); ctx.lineTo(cx + bw * 0.4, cy + bh * 0.8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - bw * 0.2, cy - bh * 0.7);
    ctx.lineTo(cx - bw * 0.4, cy - bh * 1.5); ctx.lineTo(cx + bw * 0.2, cy - bh * 0.8); ctx.fill();
  }

  // 翅膀
  if (flying) {
    const span = t.wingSpan * 1.3 * s;
    ctx.fillStyle = `hsla(${t.hue},40%,${L - 6}%,0.85)`;
    ctx.beginPath();
    ctx.ellipse(cx - bw * 0.1, cy - bh * 0.7 - span / 2, span * 0.28, span / 2, -0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // 身體
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(cx, cy, bw, bh, 0, 0, Math.PI * 2); ctx.fill();

  // 保護色斑紋
  ctx.save(); ctx.clip();
  ctx.fillStyle = dark;
  const spots = Math.floor(t.camouflage / 6);
  for (let i = 0; i < spots; i++) {
    const x = cx + Math.sin(i * 12.9) * bw * 0.85, y = cy + Math.cos(i * 7.7) * bh * 0.8;
    ctx.beginPath(); ctx.ellipse(x, y, 4 + (i % 4) * 2, 3 + (i % 3) * 2, i, 0, Math.PI * 2); ctx.fill();
  }
  // 生物發光
  if (t.bioluminescence > 10) {
    ctx.shadowColor = '#4cf'; ctx.shadowBlur = 12; ctx.fillStyle = '#8ff';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(cx - bw * 0.7 + i * bw * 0.2, cy + bh * 0.3, 2.2, 0, 7); ctx.fill(); }
  }
  ctx.restore();

  // 頸 + 頭
  const hr = (11 + t.bodySize * 0.08) * s;
  const hx = aquatic ? cx + bw * 0.95 : cx + bw * 0.7 + neck * 0.25;
  const hy = aquatic ? cy - bh * 0.05 : cy - bh * 0.3 - neck;
  if (!aquatic) {
    ctx.strokeStyle = col; ctx.lineWidth = bh * 0.6;
    ctx.beginPath(); ctx.moveTo(cx + bw * 0.6, cy - bh * 0.2); ctx.lineTo(hx, hy); ctx.stroke();
  }
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();

  // 喙 / 吻
  const th = hr * (0.3 + (t.dietHardness / 100) * 0.9);
  const ln = hr * (0.6 + (1 - t.dietHardness / 100) * 1.1);
  ctx.fillStyle = dark; ctx.beginPath();
  ctx.moveTo(hx + hr * 0.7, hy - th / 2);
  ctx.quadraticCurveTo(hx + hr + ln * 0.7, hy - th / 2, hx + hr + ln, hy + (t.dietHardness > 70 ? th * 0.7 : 0));
  ctx.lineTo(hx + hr * 0.7, hy + th / 2); ctx.fill();

  // 耳朵
  if (!aquatic) {
    const er = 3 + t.earSize * 0.28 * s;
    ctx.fillStyle = dark; ctx.beginPath();
    ctx.ellipse(hx - hr * 0.3, hy - hr - er * 0.4, er * 0.5, er, -0.3, 0, Math.PI * 2); ctx.fill();
  }

  // 眼睛
  const er2 = 2 + t.eyeSize * 0.09 * s;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hx + hr * 0.2, hy - hr * 0.2, er2, 0, 7); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(hx + hr * 0.25, hy - hr * 0.2, er2 * 0.55, 0, 7); ctx.fill();
}

export default function CreatureCanvas({ traits, env, title }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; draw(c.getContext('2d'), traits, env, c.width, c.height);
  }, [traits, env]);
  return (
    <div className="card glass">
      <h3>{title}</h3>
      <canvas ref={ref} width={420} height={300} />
    </div>
  );
}