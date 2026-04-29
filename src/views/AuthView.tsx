import { useState } from 'react';
import { supabase } from '../services/supabase';
import GlitchText from '../components/GlitchText';
import { Mail, Lock, Zap, UserPlus, Info } from 'lucide-react';

export default function AuthView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // --- LOGIC LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password 
    });
    
    if (error) {
      // Jika email belum dikonfirmasi, Supabase bakal kasih error ini
      if (error.message.includes("Email not confirmed")) {
        setMessage({ type: 'error', text: "Email lu belum diverifikasi, bro. Cek inbox!" });
      } else {
        setMessage({ type: 'error', text: "Access Denied: " + error.message });
      }
    }
    setLoading(false);
  };

  // --- LOGIC REGISTER (Real Email Protocol) ---
  const handleSignUp = async () => {
    if (!email || !password) return setMessage({ type: 'error', text: "Data identitas belum lengkap!" });
    if (password.length < 6) return setMessage({ type: 'error', text: "Access Key minimal 6 karakter!" });

    setLoading(true);
    setMessage(null);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setMessage({ type: 'error', text: "Gagal Daftar: " + error.message });
    } else {
      // Sukses daftar, instruksikan buka email
      setMessage({ 
        type: 'success', 
        text: "PROTOCOL SENT! 🚀 Cek email asli lu sekarang (Inbox/Spam) dan klik link konfirmasi buat aktifin akun!" 
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto p-6 animate-in fade-in zoom-in duration-700">
      <div className="w-full p-8 md:p-12 rounded-[3rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <header className="text-center mb-8">
            <GlitchText 
              text="FLUX AUTH" 
              className="text-4xl font-black italic tracking-tighter text-cyan-400 mb-2" 
            />
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Real-Identity Protocol</p>
          </header>

          {/* NOTIFICATION BOX */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border animate-in slide-in-from-top-2 duration-300 ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
            }`}>
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed tracking-tight">{message.text}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Real Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:border-cyan-500/50 outline-none text-white transition-all placeholder:text-white/10"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Security Access Key" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:border-cyan-500/50 outline-none text-white transition-all placeholder:text-white/10"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative bg-white text-black font-black py-4 rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]">
                <Zap size={16} fill="currentColor" />
                <span>{loading ? 'Processing...' : 'Connect Identity'}</span>
              </div>
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
            <p className="text-white/10 text-[9px] font-bold uppercase mb-4 tracking-widest">No Identity Detected?</p>
            <button 
              onClick={handleSignUp}
              disabled={loading}
              className="flex items-center gap-2 text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.2em] hover:text-cyan-400 transition-all"
            >
              <UserPlus size={14} />
              <span>Register New Neural Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}