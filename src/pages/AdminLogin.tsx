import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apex-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-white">ADMIN ACCESS</h1>
          <p className="text-apex-white-dim text-sm mt-2">Secure login to KingAutos Dashboard</p>
        </div>

        <div className="bg-apex-black-light rounded-2xl border border-apex-gray/30 p-8">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apex-white-dim" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-apex-black border border-apex-gray/30 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-apex-white-dim/50"
                />
              </div>
            </div>

            <div>
              <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apex-white-dim" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-apex-black border border-apex-gray/30 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-apex-white-dim/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium bg-gradient-premium text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-apex-gray/30 text-center">
            <p className="text-apex-white-dim text-xs">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
