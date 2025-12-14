'use client';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertCircle, Wallet, CheckCircle2, Zap, LogOut, Menu, History } from 'lucide-react';
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

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

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
  const [hasClaimedSignupAirdrop, setHasClaimedSignupAirdrop] = useState(false);
  const { connected, publicKey, connecting, disconnect } = useWallet();
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [wagerAmount, setWagerAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<'ZAR' | TOKEN_NAME>('ZAR');

  const [transactionHistory, setTransactionHistory] = useState([
    { date: "2025-12-14", type: "Airdrop", amount: "+5,000", token: TOKEN_NAME, status: "Completed" },
    { date: "2025-12-13", type: "Bet", amount: "-200", token: "ZAR", market: "Load-shedding ends by 2026?", side: "YES", status: "Pending" },
    { date: "2025-12-12", type: "Bet", amount: "-500", token: TOKEN_NAME, market: "Springboks win RWC 2027?", side: "YES", status: "Won (+1,136)" },
  ]);

  useEffect(() => {
    if (connected && publicKey && mzanshiBalance === 0 && !hasClaimedSignupAirdrop) {
      setMzanshiBalance(5000);
      setHasClaimedSignupAirdrop(true);
      setTransactionHistory(prev => [{
        date: new Date().toISOString().split('T')[0],
        type: "Signup Airdrop",
        amount: "+5,000",
        token: TOKEN_NAME,
        status: "Completed"
      }, ...prev]);
      setTimeout(() => {
        alert(`🎉 Welcome to KALSHI.CO.ZA!\n5,000 ${TOKEN_NAME} airdropped as signup bonus!`);
      }, 1000);
    }
  }, [connected, publicKey, mzanshiBalance, hasClaimedSignupAirdrop]);

  const claimExtraAirdrop = () => {
    setMzanshiBalance(prev => prev + 5000);
    setTransactionHistory(prev => [{
      date: new Date().toISOString().split('T')[0],
      type: "Extra Airdrop",
      amount: "+5,000",
      token: TOKEN_NAME,
      status: "Completed"
    }, ...prev]);
    alert(`🎉 Extra 5,000 ${TOKEN_NAME} airdropped!`);
  };

  const buy = (side: string, price: number, fromModal = false) => {
    const cost = price * wagerAmount;
    const usingToken = paymentMethod === TOKEN_NAME && mzanshiBalance >= cost;

    if (usingToken || wallet >= cost) {
      if (usingToken) {
        setMzanshiBalance(p => p - cost);
      } else {
        setWallet(p => p - cost);
      }
      const newTx = {
        date: new Date().toISOString().split('T')[0],
        type: "Bet",
        amount: `-${wagerAmount}`,
        token: usingToken ? TOKEN_NAME : 'ZAR',
        market: market?.q || "Unknown",
        side,
        status: "Pending"
      };
      setTransactionHistory(prev => [newTx, ...prev]);
      alert(`Bet placed: R${wagerAmount} on ${side} ✅\nPaid with ${usingToken ? TOKEN_NAME : 'ZAR'}`);
      if (fromModal) setSelectedMarket(null);
    } else {
      alert(`Not enough ${usingToken ? TOKEN_NAME : 'ZAR'}!`);
    }
  };

  const markets = [
    { id: 1, q: "Load-shedding ends by end of 2026?", description: "Will Eskom and the South African government finally solve the electricity crisis and eliminate scheduled power cuts (load-shedding) nationwide by December 31, 2026? This market resolves YES if there are no official load-shedding stages implemented in 2026.", yes: 0.58, no: 0.42, volumeYes: 12450, volumeNo: 8750, image: "/images/load-shedding.jpg" },
    { id: 2, q: "Rand breaks R20 to USD in 2026?", description: "Will the South African Rand weaken to trade at or above R20 per USD at any point in 2026? This market resolves YES if the official USD/ZAR rate hits 20.00 or higher on any trading day in 2026.", yes: 0.67, no: 0.33, volumeYes: 18900, volumeNo: 9200, image: "/images/rand-crash.jpg" },
    { id: 3, q: "EFF gets 20%+ in 2026 elections?", description: "Will the Economic Freedom Fighters (EFF) receive 20% or more of the national vote in the 2026 South African general elections? Market resolves based on official IEC results.", yes: 0.31, no: 0.69, volumeYes: 5600, volumeNo: 14200, image: "/images/eff.jpg" },
    { id: 4, q: "Springboks win Rugby World Cup 2027?", description: "Will the South African Springboks win the Rugby World Cup in 2027? Market resolves YES if South Africa lifts the Webb Ellis Cup in the final.", yes: 0.44, no: 0.56, volumeYes: 15800, volumeNo: 11200, image: "/images/springboks.jpg" },
    { id: 5, q: "Bafana qualifies for 2026 World Cup?", description: "Will Bafana Bafana (South Africa national football team) qualify for the 2026 FIFA World Cup? Includes any route (automatic or playoffs). Resolves based on official FIFA qualification.", yes: 0.39, no: 0.61, volumeYes: 9800, volumeNo: 15200, image: "/images/bafana.jpg" },
  ];

  const market = selectedMarket !== null ? markets.find(m => m.id === selectedMarket) : null;

  return (
    <main className="min-h-screen bg-black text-green-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto relative">
        {/* Logo + Headline */}
        <div className="text-center mb-8">
          <img src="/mzanshi-logo.jpg" alt="$MZANSHI Logo" className="mx-auto w-24 h-24 md:w-32 md:h-32 object-contain mb-4 drop-shadow-2xl animate-pulse-slow" />
          <h1 className="text-4xl md:text-6xl font-bold">KALSHI.CO.ZA</h1>
          <p className="text-lg md:text-xl text-green-300 mt-2">Mzansi Prediction Markets • Powered by {TOKEN_NAME}</p>
        </div>

        {/* Burger Menu Icon - Now always visible */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 right-4 z-50 bg-gray-900 border-green-500 hover:bg-gray-800 shadow-lg"
            >
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 border-l border-green-500 text-green-400 w-80">
            <SheetHeader>
              <SheetTitle className="text-2xl flex items-center gap-3">
                <History className="text-green-500" size={28} />
                Transaction History
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 overflow-y-auto max-h-[80vh]">
              {transactionHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No transactions yet. Place your first bet!</p>
              ) : (
                transactionHistory.map((tx, i) => (
                  <div key={i} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{tx.type}</p>
                        <p className="text-sm text-gray-400">{tx.date}</p>
                        {tx.market && <p className="text-sm mt-1 line-clamp-2">{tx.market} → {tx.side}</p>}
                      </div>
                      <div className="text-right">
                        <p className={tx.amount.startsWith('+') ? "text-green-500" : "text-red-400"}>{tx.amount} {tx.token}</p>
                        <p className="text-xs text-gray-500">{tx.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Wallet / Login Section */}
        <div className="bg-gray-900 border border-green-500 rounded-xl p-6 mb-10 text-center">
          <div className="flex justify-center items-center gap-6 flex-wrap mb-6">
            {connected ? (
              <>
                <WalletMultiButtonDynamic className="!bg-purple-600 hover:!bg-purple-700 !text-lg !px-8 !py-4" />
                <Button onClick={disconnect} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900 text-lg px-8 py-4">
                  <LogOut className="mr-2" size={20} /> Logout
                </Button>
                <Button onClick={claimExtraAirdrop} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                  Claim Extra 5,000 {TOKEN_NAME}
                </Button>
              </>
            ) : (
              <WalletMultiButtonDynamic className="!bg-purple-600 hover:!bg-purple-700 !text-xl !px-10 !py-5" />
            )}
          </div>

          <div className="flex justify-center items-center gap-3 text-lg">
            {connected && publicKey && (
              <>
                <CheckCircle2 className="text-green-500" size={28} />
                <span>Logged in: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}</span>
              </>
            )}
            {connecting && (
              <>
                <AlertCircle className="text-yellow-500 animate-pulse" size={28} />
                <span>Logging in with wallet...</span>
              </>
            )}
            {!connected && !connecting && (
              <>
                <Wallet className="text-gray-500" size={28} />
                <span>Login with wallet to bet & claim airdrop</span>
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-8 text-xl">
            <div>ZAR Balance: <strong>R{wallet.toLocaleString('en-US')}</strong></div>
            <div>{TOKEN_NAME} Balance: <strong>{mzanshiBalance.toLocaleString('en-US')}</strong></div>
          </div>
        </div>

        {/* Markets */}
        {!connected ? (
          <div className="text-center py-20">
            <Wallet size={64} className="mx-auto mb-6 text-gray-600" />
            <p className="text-2xl text-gray-400">Login with your wallet to place bets and claim {TOKEN_NAME} airdrop</p>
            <p className="text-lg text-gray-500 mt-4">Phantom or Brave Wallet recommended</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((m) => (
              <div
                key={m.id}
                className="bg-gray-900 border-2 border-green-500 rounded-xl overflow-hidden hover:border-green-400 transition cursor-pointer"
                onClick={() => setSelectedMarket(m.id)}
              >
                <div className="h-48 bg-gray-800 relative overflow-hidden">
                  <img src={m.image} alt={m.q} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-center line-clamp-3">{m.q}</h3>
                  <div className="text-sm space-y-1">
                    <div>YES: {(m.yes * 100).toFixed(0)}% • R{m.yes.toFixed(2)}</div>
                    <div>NO: {(m.no * 100).toFixed(0)}% • R{m.no.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Market Detail Modal */}
        <Dialog open={selectedMarket !== null} onOpenChange={() => setSelectedMarket(null)}>
          <DialogContent className="bg-gray-900 border-green-500 text-green-400 max-w-3xl max-h-[90vh] overflow-y-auto">
            {market && (
              <>
                <DialogHeader>
                  <img src={market.image} alt={market.q} className="w-full h-64 object-cover rounded-lg mb-4" />
                  <DialogTitle className="text-2xl text-center">{market.q}</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold mb-3">Market Details</h4>
                    <p className="text-base leading-relaxed">{market.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div className="bg-green-900/50 p-6 rounded-xl">
                      <p className="text-4xl font-bold">{(market.yes * 100).toFixed(0)}%</p>
                      <p className="text-lg">YES • R{market.yes.toFixed(2)} per share</p>
                      <p className="text-sm mt-3">Volume: R{market.volumeYes.toLocaleString('en-US')}</p>
                    </div>
                    <div className="bg-red-900/50 p-6 rounded-xl">
                      <p className="text-4xl font-bold">{(market.no * 100).toFixed(0)}%</p>
                      <p className="text-lg">NO • R{market.no.toFixed(2)} per share</p>
                      <p className="text-sm mt-3">Volume: R{market.volumeNo.toLocaleString('en-US')}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h4 className="text-xl font-bold text-center mb-4">Choose Payment Method</h4>
                    <div className="flex justify-center gap-6 mb-6">
                      <Button
                        onClick={() => setPaymentMethod('ZAR')}
                        variant={paymentMethod === 'ZAR' ? 'default' : 'outline'}
                        className={paymentMethod === 'ZAR' ? 'bg-green-600 hover:bg-green-500' : 'border-green-500'}
                      >
                        Pay with ZAR
                        {paymentMethod === 'ZAR' && <Zap className="ml-2" size={20} />}
                      </Button>
                      <Button
                        onClick={() => setPaymentMethod(TOKEN_NAME)}
                        variant={paymentMethod === TOKEN_NAME ? 'default' : 'outline'}
                        className={paymentMethod === TOKEN_NAME ? 'bg-purple-600 hover:bg-purple-500' : 'border-purple-500'}
                        disabled={mzanshiBalance === 0}
                      >
                        Pay with {TOKEN_NAME}
                        {paymentMethod === TOKEN_NAME && <Zap className="ml-2" size={20} />}
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-400 mb-4">
                      {paymentMethod === 'ZAR' ? `Using ZAR balance: R${wallet.toLocaleString('en-US')}` : `Using ${TOKEN_NAME} balance: ${mzanshiBalance.toLocaleString('en-US')}`}
                    </div>

                    <label className="block text-center text-lg mb-6">
                      Wager Amount (R):
                      <input
                        type="number"
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(Number(e.target.value) || 0)}
                        className="w-40 ml-4 px-4 py-2 bg-gray-900 border border-green-500 rounded text-center text-white"
                        min="10"
                        step="10"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <p className="text-sm mb-2">Potential return on YES:</p>
                        <p className="text-3xl font-bold">R{(wagerAmount / market.yes).toFixed(0)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm mb-2">Potential return on NO:</p>
                        <p className="text-3xl font-bold">R{(wagerAmount / market.no).toFixed(0)}</p>
                      </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-8">
                      <Button onClick={() => buy("YES", market.yes, true)} className="bg-green-600 hover:bg-green-500 text-xl px-10 py-6">
                        BET YES ({paymentMethod})
                      </Button>
                      <Button onClick={() => buy("NO", market.no, true)} className="bg-red-600 hover:bg-red-500 text-xl px-10 py-6">
                        BET NO ({paymentMethod})
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <footer className="text-center mt-16 text-gray-500">
          Built by @SipheDilima247 • Live on Solana • Bet on the future of Mzansi 🇿🇦
        </footer>
      </div>
    </main>
  );
}