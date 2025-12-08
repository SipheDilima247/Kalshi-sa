'use client';

import { useState } from 'react';

export default function Home() {
  const [wallet, setWallet] = useState(10000); // Fake R10,000

  const markets = [
    { q: "Load-shedding gone by end of 2026?", yes: 0.58, no: 0.42 },
    { q: "Rand hits R20+ to USD in 2026?", yes: 0.67, no: 0.33 },
    { q: "EFF gets 20%+ in 2026 elections?", yes: 0.31, no: 0.69 },
    { q: "Springboks win Rugby World Cup 2027?", yes: 0.44, no: 0.56 },
    { q: "Bafana qualifies for 2026 World Cup?", yes: 0.39, no: 0.61 },
  ];

  const buy = (side: string, price: number) => {
    const cost = price * 100;
    if (wallet >= cost) {
      setWallet(wallet - cost);
      alert(`Bought R100 of ${side} @ R${price.toFixed(2)} ✅\nNew balance: R${(wallet - cost).toFixed(2)}`);
    } else {
      alert("Not enough ZAR, boet 😂");
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-2">KALSHI.CO.ZA</h1>
        <p className="text-2xl text-center mb-8">Wallet: R{wallet.toFixed(2)} ZAR (demo)</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-green-500 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">{m.q}</h3>
              <div className="space-y-3">
                <button
                  onClick={() => buy("YES", m.yes)}
                  className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold"
                >
                  YES → R{m.yes.toFixed(2)} ({(m.yes * 100).toFixed(0)}%)
                </button>
                <button
                  onClick={() => buy("NO", m.no)}
                  className="w-full bg-red-600 hover:bg-red-500 py-3 rounded font-bold"
                >
                  NO → R{m.no.toFixed(2)} ({(m.no * 100).toFixed(0)}%)
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500">
          Built by @SipheDilima247 • Demo mode • Real ZAR coming soon 🇿🇦
        </p>
      </div>
    </main>
  );
}