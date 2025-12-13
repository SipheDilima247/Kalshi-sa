'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wallet, CheckCircle2 } from 'lucide-react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import '@solana/wallet-adapter-react-ui/styles.css';

const TOKEN_NAME = '$MZANSHI';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Page() {
  const endpoint = clusterApiUrl('mainnet-beta');

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

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
  const { connected, publicKey, connecting } = useWallet();

  const depositMzanshi = () => {
    setMzanshiBalance(prev => prev + 5000);
    alert(`🎉 5,000 ${TOKEN_NAME} airdropped to your wallet!\nUse it to bet on SA chaos.`);
  };

  const buy = (side: string, price: number) => {
    const cost = price * 100;
    if (mzanshiBalance >= cost || wallet >= cost) {
      if (mzanshiBalance >= cost) setMzanshiBalance(p => p - cost);
      else setWallet(p => p - cost);
      alert(`Bet placed: R100 on ${side} ✅\nPaid with ${mzanshiBalance >= cost ? TOKEN_NAME : 'ZAR'}`);
    } else {
      alert('Low funds — claim your airdrop or top up ZAR!');
    }
  };

  const markets = [
    {
      q: "Load-shedding ends by end of 2026?",
      yes: 0.58,
      no: 0.42,
      image: "/images/load-shedding.jpg"  // Add your image to public/images/
    },
    {
      q: "Rand breaks R20 to USD in 2026?",
      yes: 0.67,
      no: 0.33,
      image: "/images/rand-crash.jpg"
    },
    {
      q: "EFF gets 20%+ in 2026 elections?",
      yes: 0.31,
      no: 0.69,
      image: "/images/eff.jpg"
    },
    {
      q: "Springboks win Rugby World Cup 2027?",
      yes: 0.44,
      no: 0.56,
      image: "/images/springboks.jpg"
    },
    {
      q: "Bafana qualifies for 2026 World Cup?",
      yes: 0.39,
      no: 0.61,
      image: "/images/bafana.jpg"
    },
  ];

  return (
    <main className="min-h-screen bg-black text-green-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Logo + Headline */}
        <div className="text-center mb-8">
          <img
            src="/mzanshi-logo.jpg"
            alt="$MZANSHI Logo"
            className="mx-auto w-32 h-32 md:w-48 md:h-48 object-contain mb-4 drop-shadow-2xl animate-pulse-slow"
          />
          <h1 className="text-5xl md:text-7xl font-bold">KALSHI.CO.ZA</h1>
          <p className="text-xl md:text-2xl text-green-300 mt-2">Mzansi Prediction Markets • Powered by {TOKEN_NAME}</p>
        </div>

        {/* Wallet Section */}
        <div className="bg-gray-900 border border-green-500 rounded-xl p-6 mb-10 text-center">
          <div className="flex justify-center items-center gap-6 flex-wrap mb-6">
            <WalletMultiButtonDynamic className="!bg-purple-600 hover:!bg-purple-700 !text-lg !px-8 !py-4" />
            {connected && (
              <Button onClick={depositMzanshi} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                Claim 5,000 {TOKEN_NAME} Airdrop
              </Button>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex justify-center items-center gap-3 text-lg">
            {connected && publicKey && (
              <>
                <CheckCircle2 className="text-green-500" size={28} />
                <span>Connected: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}</span>
              </>
            )}
            {connecting && (
              <>
                <AlertCircle className="text-yellow-500 animate-pulse" size={28} />
                <span>Connecting wallet...</span>
              </>
            )}
            {!connected && !connecting && (
              <>
                <Wallet className="text-gray-500" size={28} />
                <span>Connect Phantom or Brave Wallet to start</span>
              </>
            )}
          </div>

          {/* Balances */}
          <div className="mt-6 grid grid-cols-2 gap-8 text-xl">
            <div>ZAR Balance: <strong>R{wallet.toLocaleString('en-US')}</strong></div>
            <div>{TOKEN_NAME} Balance: <strong>{mzanshiBalance.toLocaleString('en-US')}</strong></div>
          </div>
        </div>

        {/* Markets */}
        {!connected ? (
          <div className="text-center py-20">
            <Wallet size={64} className="mx-auto mb-6 text-gray-600" />
            <p className="text-2xl text-gray-400">Connect your wallet to place bets and claim {TOKEN_NAME} airdrop</p>
            <p className="text-lg text-gray-500 mt-4">Phantom or Brave Wallet recommended</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((m, i) => (
              <div key={i} className="bg-gray-900 border-2 border-green-500 rounded-xl overflow-hidden hover:border-green-400 transition">
                {/* Image Section */}
                <div className="h-48 bg-gray-800 relative overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.q}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-center">{m.q}</h3>
                  <div className="space-y-4">
                    <Button onClick={() => buy("YES", m.yes)} className="w-full bg-green-600 hover:bg-green-500 text-xl py-6">
                      YES — R{m.yes.toFixed(2)} <span className="block text-sm">({(m.yes * 100).toFixed(0)}% chance)</span>
                    </Button>
                    <Button onClick={() => buy("NO", m.no)} className="w-full bg-red-600 hover:bg-red-500 text-xl py-6">
                      NO — R{m.no.toFixed(2)} <span className="block text-sm">({(m.no * 100).toFixed(0)}% chance)</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center mt-16 text-gray-500">
          Built by @SipheDilima247 • Live on Solana • Bet on the future of Mzansi 🇿🇦
        </footer>
      </div>
    </main>
  );
}