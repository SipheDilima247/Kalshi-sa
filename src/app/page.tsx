'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

const TOKEN_NAME = '$MZANSHI'; // ← Change to '$KALSHI' if you want
const TOKEN_ADDRESS = 'YOUR_TOKEN_ADDRESS_HERE'; // ← Paste your real token address when ready

export default function Home() {
  const [wallet, setWallet] = useState(10000); // Fake ZAR
  const [mzanshiBalance, setMzanshiBalance] = useState(0); // $MZANSHI balance

  const { publicKey, connect, connected } = useWallet();

  const markets = [
    { q: "Load-shedding gone by end of 2026?", yes: 0.58, no: 0.42 },
    { q: "Rand hits R20+ to USD in 2026?", yes: 0.67, no: 0.33 },
    { q: "EFF gets 20%+ in 2026 elections?", yes: 0.31, no: 0.69 },
    { q: "Springboks win Rugby World Cup 2027?", yes: 0.44, no: 0.56 },
    { q: "Bafana qualifies for 2026 World Cup?", yes: 0.39, no: 0.61 },
  ];

  const depositMzanshi = () => {
    const amount = 5000; // Free airdrop-style deposit for demo
    setMzanshiBalance(prev => prev + amount);
    alert(`🎉 Deposited ${amount.toLocaleString()} ${TOKEN_NAME}!\nBalance: ${mzanshiBalance + amount}`);
  };

  const buy = (side: string, price: number) => {
    const cost = price * 100;
    const usingToken = mzanshiBalance >= cost;

    if (usingToken || wallet >= cost) {
      if (usingToken) {
        setMzanshiBalance(prev => prev - cost);
      } else {
        setWallet(prev => prev - cost);
      }
      alert(`Bought R100 of ${side} @ R${price.toFixed(2)} ✅\nPaid with ${usingToken ? TOKEN_NAME : 'ZAR'}`);
    } else {
      alert(`Not enough funds, boet 😂\nNeed R${cost} more ${usingToken ? TOKEN_NAME : 'ZAR'}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-2">KALSHI.CO.ZA</h1>

        {/* Wallet Connect + Balances */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg">
          <div>ZAR Wallet: R{wallet.toFixed(2)}</div>
          <div>{TOKEN_NAME} Balance: {mzanshiBalance.toLocaleString()}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
          {connected && (
            <Button onClick={depositMzanshi} className="bg-green-600 hover:bg-green-700">
              Claim 5,000 {TOKEN_NAME} (Demo Airdrop)
            </Button>
          )}
        </div>

        {/* Markets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-green-500 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">{m.q}</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => buy("YES", m.yes)}
                  className="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold"
                >
                  YES → R{m.yes.toFixed(2)} ({(m.yes * 100).toFixed(0)}%)
                </Button>
                <Button
                  onClick={() => buy("NO", m.no)}
                  className="w-full bg-red-600 hover:bg-red-500 py-3 rounded font-bold"
                >
                  NO → R{m.no.toFixed(2)} ({(m.no * 100).toFixed(0)}%)
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500">
          Built by @SipheDilima247 • Live on Solana • {TOKEN_NAME} = real utility 🇿🇦
        </p>
      </div>
    </main>
  );
}

// Wrap the page with providers (only once)
export function KALSHIApp() {
  const network = clusterApiUrl('mainnet-beta');
  const wallets = []; // Auto-detect Phantom, etc.

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Home />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}