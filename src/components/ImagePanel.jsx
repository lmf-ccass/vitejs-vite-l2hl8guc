import { useState } from 'react';
import { buildPrompt } from '../engine/prompt';

export default function ImagePanel({ traits, env, title }) {
  const [provider, setProvider] = useState('pollinations');
  const [key, setKey] = useState(localStorage.getItem('evo_key_' + 'pollinations') || '');
  const [src, setSrc] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const prompt = buildPrompt(traits, env);

  const generate = async () => {
    setBusy(true); setErr(''); setSrc('');
    try {
      if (provider === 'pollinations') {
        const seed = Math.floor(Math.random() * 1e6);
        const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}` +
          `?model=flux&width=768&height=768&seed=${seed}` + (key ? `&key=${encodeURIComponent(key)}` : '');
        const r = await fetch(url);
        if (!r.ok) throw new Error(`Pollinations 回應 ${r.status}（可能需要 API Key）`);
        setSrc(URL.createObjectURL(await r.blob()));
      } else {
        const r = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: 'dall-e-3', prompt, size: '1024x1024', response_format: 'b64_json' }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error?.message || r.status);
        setSrc('data:image/png;base64,' + j.data[0].b64_json);
      }
    } catch (e) { setErr(String(e.message || e)); }
    setBusy(false);
  };

  return (
    <div className="card glass">
      <h3>{title} · AI 寫實照片</h3>
      <div className="row">
        <select value={provider} onChange={e => setProvider(e.target.value)}>
          <option value="pollinations">Pollinations (Flux)</option>
          <option value="openai">OpenAI DALL·E 3</option>
        </select>
        <input type="password" placeholder="API Key（pk_… / sk-…）" value={key}
          onChange={e => { setKey(e.target.value); localStorage.setItem('evo_key_pollinations', e.target.value); }} />
      </div>
      <textarea readOnly value={prompt} rows={5} />
      <button onClick={generate} disabled={busy}>{busy ? '生成中…' : '🎨 生成照片'}</button>
      {err && <p className="err">{err}</p>}
      {src && <img src={src} alt="evolved creature" />}
    </div>
  );
}