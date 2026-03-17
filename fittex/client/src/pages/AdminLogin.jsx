import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { FaUserShield, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const AdminLogin = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin-login', { username, password });
      if (data.success) {
        toast.success(data.message);
        
        // Use data directly from login response instead of second API call
        setUser(data.data);
        
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 relative bg-dark-900">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 border-2 border-lime-500/20 w-20 h-20 rounded-3xl flex items-center justify-center group transform transition-transform hover:rotate-12">
            <FaUserShield className="text-lime-500 text-3xl" />
          </div>
        </div>

        <div className="glass-card bg-dark-800/90 p-10 relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Admin <span className="text-lime-500">Access</span></h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-none">Confidential System Property</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Username</label>
              <div className="relative">
                <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-lime-500/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-lime-500 focus:bg-dark-900 text-white font-bold transition-all"
                  placeholder="admin_id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Password</label>
              <div className="relative">
                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-lime-500/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-lime-500 focus:bg-dark-900 text-white font-bold transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
              <FaArrowRight className={loading ? 'animate-pulse' : ''} />
            </button>
          </form>

          {/* Hidden footer decor */}
          <div className="mt-10 pt-6 border-t border-dark-700/50 flex justify-between items-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">
             <span>Secure Session</span>
             <span>Encrypted 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
