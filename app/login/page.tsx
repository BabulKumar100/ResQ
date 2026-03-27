'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const DEMO_USERS = [
  { email: 'admin@resq.gov', password: 'ResQ@2024', role: 'COMMAND', badge: 'CMD-001' },
  { email: 'field@resq.gov', password: 'FieldOps1', role: 'FIELD OPS', badge: 'FLD-042' },
  { email: 'medic@resq.gov', password: 'MedUnit9', role: 'MEDIC', badge: 'MED-009' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 900));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      // Store session
      localStorage.setItem('resq_user', JSON.stringify({ email: user.email, role: user.role, badge: user.badge }));
      router.push('/resqmap');
    } else {
      setError('Invalid credentials. Try the demo accounts below.');
    }
    setLoading(false);
  };

  const quickLogin = (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-[#080a0e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Tactical grid bg */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#41ddc2 1px, transparent 1px), linear-gradient(90deg, #41ddc2 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#41ddc2 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Sweep glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#41ddc2] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#41ddc2]/10 border border-[#41ddc2]/30 mb-4 relative">
            <Shield className="w-8 h-8 text-[#41ddc2]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#41ddc2] rounded-full animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ResQ<span className="text-[#41ddc2]">Map</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono tracking-widest">EMERGENCY INTELLIGENCE SYSTEM</p>
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#41ddc2] font-mono bg-[#41ddc2]/10 px-3 py-1 rounded-full border border-[#41ddc2]/20">
            <span className="w-1.5 h-1.5 bg-[#41ddc2] rounded-full animate-pulse" />
            SYSTEM ONLINE — SECURE CHANNEL
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111318]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(65,221,194,0.05)]">
          <h2 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Operator Login</h2>
          <p className="text-xs text-gray-400 mb-6 font-mono">Authorized personnel only — All access is logged</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider">OPERATOR EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="user@resq.gov"
                className="w-full bg-[#0c0e13] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#41ddc2]/50 focus:ring-1 focus:ring-[#41ddc2]/20 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1.5 tracking-wider">ACCESS CODE</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0e13] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#41ddc2]/50 focus:ring-1 focus:ring-[#41ddc2]/20 transition font-mono"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-[#41ddc2] hover:bg-[#65fade] disabled:opacity-50 disabled:cursor-not-allowed text-[#080a0e] font-bold text-sm rounded-lg transition shadow-[0_0_20px_rgba(65,221,194,0.3)] hover:shadow-[0_0_30px_rgba(65,221,194,0.5)] flex items-center justify-center gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[10px] font-mono text-gray-500 mb-3 tracking-widest">DEMO OPERATOR ACCOUNTS</p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => quickLogin(u)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/5 hover:border-[#41ddc2]/30 hover:bg-[#41ddc2]/5 transition group text-left"
                >
                  <div>
                    <div className="text-xs font-mono text-white group-hover:text-[#41ddc2] transition">{u.email}</div>
                    <div className="text-[10px] font-mono text-gray-500">{u.role} · Badge: {u.badge}</div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 group-hover:text-[#41ddc2] transition">AUTOFILL →</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4 font-mono">
          Powered by <span className="text-[#41ddc2]">ResQ Intelligence Network</span>
        </p>
      </div>
    </div>
  );
}
