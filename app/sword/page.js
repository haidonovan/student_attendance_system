'use client';

import { useState } from 'react';

export default function Home() {
  const [swords, setSwords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSwords() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/sword');
      if (!res.ok) throw new Error('Failed to fetch swords');
      const data = await res.json();
      setSwords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Minecraft Swords</h1>
      <button onClick={fetchSwords} disabled={loading}>
        {loading ? 'Loading...' : 'Load Swords'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {swords.map((sword) => (
          <li key={sword.id}>
            {sword.name} — Material: {sword.material} — Damage: {sword.damage}
          </li>
        ))}
      </ul>
    </div>
  );
}
