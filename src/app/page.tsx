'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

const TOKEN_NAME = '$MZANSHI'; // ← change if you want

// Main page component
function HomeContent() {
  const [wallet, setWallet] = useState(10000);
  const [mzanshiBalance, setMzanshiBalance] = useState(0);

  const depositMzanshi = () => {
    const amount = 5000;
    setMzanshiBalance(prev => prev + amount);
    alert(`Deposited ${amount.toLocaleString()} ${TOKEN_NAME}!`);
  };

  const buy = (side: string, price: number) => {
    const cost = price * 100;
    const usingToken = mzanshiBalance >= cost;

    if (usingToken || wallet >= cost) {
      if (usingToken) setMzanshiBalance(prev => prev - cost);
      else setWallet(prev => prev - cost);
      alert(`Bought R100 of ${side} with ${usingToken ? TOKEN_NAME : 'ZAR'}`);
    } else {
      alert('Not enough funds');
    }
  };

  const markets = [
    { q: "Load-shedding gone by 2026?", yes: 0.58, no: 0.42 },
    { q: "Rand > R20 in 2026?", yes: 0.67, no: 0.33 },
    { q: "EFF > 20% in 2026?", yes: 0.31, no: 0.69 },
    { q: "Springboks win RWC 2027?", yes: 0.44, no: 0.56 },
    { q: "Bafana qualifies for 2026 WC?", yes: 0.39, no: 0.61 },
  ];

  return (
    <main className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-2">KALSHI.CO.ZA</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg">
          <div>ZAR Wallet: R{wallet.toFixed(2)}</div>
          <div>{TOKEN_NAME} Balance: {mzanshiBalance.toLocaleString()}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
          <Button onClick={depositMzanshi} className="bg-green-600 hover:bg-green-700">
            Claim 5,000 {TOKEN_NAME} (Demo)
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-green-500 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">{m.q}</h3>
              <div className="space-y-3">
                <Button onClick={() => buy("YES", m.yes)} className="w-full bg-green-600 hover:bg-green-500">
                  YES → R{m.yes.toFixed(2)} ({(m.yes * 100).toFixed(0)}%)
                </Button>
                <Button onClick={() => buy("NO", m.no)} className="w-full bg-red-600 hover:bg-red-500">
                  NO → R{m.no.toFixed(2)} ({(m.no * 100).toFixed(0)}%)
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500">
          Built by @SipheDilima247 • Live on Solana • {TOKEN_NAME} = real utility
        </p>
      </div>
    </main>
  );
}

// This is the actual page — wraps everything correctly
export default function Page() {
  const endpoint = clusterApiUrl('mainnet-beta');
  const wallets: any[] = []; // auto-detects Phantom

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <HomeContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}