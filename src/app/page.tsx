'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  BackpackWalletAdapter,
  OKXWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

const TOKEN_NAME = '$MZANSHI';

export default function Page() {
  const endpoint = clusterApiUrl('mainnet-beta');

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new BackpackWalletAdapter(),
    new OKXWalletAdapter(),
    new SolflareWalletAdapter(),
    new TrustWalletAdapter(),
  ], []);

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

function HomeContent() {
  const [wallet, setWallet] = useState(10000);
  const [mzanshiBalance, setMzanshiBalance] = useState(0);

  const depositMzanshi = () => {
    setMzanshiBalance(prev => prev + 5000);
    alert('5000 $MZANSHI airdropped!');
  };

  const buy = (side: string, price: number) => {
    const cost = price * 100;
    if (mzanshiBalance >= cost || wallet >= cost) {
      if (mzanshiBalance >= cost) setMzanshiBalance(p => p - cost);
      else setWallet(p => p - cost);
      alert(`Bought ${side} with ${mzanshiBalance >= cost ? TOKEN_NAME : 'ZAR'}`);
    } else alert('Not enough funds');
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
        <h1 className="text-6xl font-bold text-center mb-4">KALSHI.CO.ZA</h1>

        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white" />
          <Button onClick={depositMzanshi} className="bg-green-600 hover:bg-green-700">
            Claim 5,000 {TOKEN_NAME}
          </Button>
        </div>

        <div className="text-center mb-8 text-xl">
          ZAR: R{wallet} | {TOKEN_NAME}: {mzanshiBalance.toLocaleString()}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-green-500 rounded-lg p-6">
              <h3 className="font-bold mb-4">{m.q}</h3>
              <div className="space-y-3">
                <Button onClick={() => buy("YES", m.yes)} className="w-full bg-green-600 hover:bg-green-500">
                  YES — R{m.yes.toFixed(2)} ({(m.yes * 100).toFixed(0)}%)
                </Button>
                <Button onClick={() => buy("NO", m.no)} className="w-full bg-red-600 hover:bg-red-500">
                  NO — R{m.no.toFixed(2)} ({(m.no * 100).toFixed(0)}%)
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500">
          Built by @SipheDilima247 • $MZANSHI powered
        </p>
      </div>
    </main>
  );
}