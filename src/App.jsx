import { useState, useEffect, useRef } from 'react';
import { ENV_PARAMS, DEFAULT_ENV, ANCESTOR, TRAIT_LABELS } from './engine/constants';
import { evolve } from './engine/evolution';
import CreatureCanvas from './components/CreatureCanvas';
import ImagePanel from './components/ImagePanel';

const PRESETS = {
  '🌊 遼闊深海': { waterDepth: 90, waterExpanse: 90, light: 5, temperature: 20 },
  '🏜️ 乾熱沙漠': { temperature: 90, humidity: 10, vegetation: 10, light: 95 },
  '⛰️ 陡峭山地': { terrain: 95, gravity: 25, predator: 80 },
  '🌳 高大雨林': { humidity: 90, foodHeight: 90, vegetation: 90, light: 30 },
};

export default function App() {
  const [env, setEnv] = useState(DEFAULT_ENV);
  const [c, setC] = useState({ 1: ANCESTOR, 2: ANCESTOR });
  const [gen, setGen] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const envRef = useRef(env);
  envRef.current = env;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGen(g => g + speed);
      setC(p => ({
        1: evolve(p[1], envRef.current, 1, speed),
        2: evolve(p[2], envRef.current, 2, speed),
      }));
    }, 100);
    return () => clearInterval(id);
  }, [running, speed]);

  const reset = () => { setRunning(false); setGen(0); setC({ 1: ANCESTOR, 2: ANCESTOR }); };

  return (
    <div className="app">
      <header>
        <h1>🧬 同源分歧演化模擬器</h1>
        <div className="row">
          <span className="badge">世代 {gen}</span>
          <button onClick={() => setRunning(r => !r)}>{running ? '⏸ 暫停' : '▶ 開始演化'}</button>
          <button onClick={() => { setC(p => ({ 1: evolve(p[1], env, 1, 200), 2: evolve(p[2], env, 2, 200) })); setGen(g => g + 200); }}>⏩ +200 代</button>
          <button onClick={reset}>↺ 重置</button>
          <label>速度 {speed}<input type="range" min="1" max="30" value={speed} onChange={e => setSpeed(+e.target.value)} /></label>
        </div>
      </header>

      <main>
        <aside className="glass">
          <h2>環境壓力</h2>
          <div className="row wrap">
            {Object.entries(PRESETS).map(([n, v]) => (
              <button key={n} className="chip" onClick={() => setEnv({ ...DEFAULT_ENV, ...v })}>{n}</button>
            ))}
          </div>
          {ENV_PARAMS.map(p => (
            <label key={p.key} className="slider" title={p.hint}>
              <span>{p.label}<b>{env[p.key]}</b></span>
              <input type="range" min="0" max="100" value={env[p.key]}
                onChange={e => setEnv({ ...env, [p.key]: +e.target.value })} />
            </label>
          ))}
        </aside>

        <section className="branches">
          {[1, 2].map(b => (
            <div key={b} className="branch">
              <CreatureCanvas title={`分支 ${b}`} traits={c[b]} env={env} />
              <div className="card glass bars">
                {Object.entries(TRAIT_LABELS).map(([k, l]) => (
                  <div key={k} className="bar"><span>{l}</span>
                    <div><i style={{ width: `${c[b][k]}%` }} /></div></div>
                ))}
              </div>
              <ImagePanel title={`分支 ${b}`} traits={c[b]} env={env} />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}