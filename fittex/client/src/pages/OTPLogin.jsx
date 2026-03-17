import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { memberLogin } from '../services/api';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const OTPLogin = ({ setUser }) => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Enter a valid email address');
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/send-otp', { email });
      if (data.success) {
        toast.success(data.message);
        if (data.devOTP) toast(`[DEV] OTP: ${data.devOTP}`, { icon: '🔑', duration: 10000 });
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        // Try member login to create member session
        try {
          const memberResult = await memberLogin(email);
          toast.success('Welcome back! 💪');
          if (setUser) setUser({ role: 'member', ...memberResult.data });
          navigate('/member/dashboard');
        } catch (memberErr) {
          const code = memberErr.response?.data?.code;
          if (code === 'PENDING_APPROVAL') {
            toast.error('Your registration is pending admin approval. We\'ll notify you when approved!', { duration: 6000 });
          } else if (memberErr.response?.status === 404) {
            toast.error('No member account found. Please register first.');
          } else {
            toast.success(data.message);
            navigate('/');
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 glass-card p-10 bg-dark-800/90">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-lime-500/10 rounded-3xl mb-4">
             <FaLock className="text-lime-500 text-3xl" />
          </div>
          <h2 className="text-5xl uppercase font-black tracking-tighter mb-2">Member <span className="text-lime-500 italic">Login</span></h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest opacity-60">Verified Access Only</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaEnvelope className="text-lime-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-lime-500 transition-all font-bold tracking-widest"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Get OTP Code'} 
              <FaArrowRight className={loading ? 'animate-pulse' : ''} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaLock className="text-lime-500" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-lime-500 transition-all text-center text-2xl font-black tracking-[1em]"
                placeholder="••••••"
                required
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">OTP sent to {email}</span>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-lime-500 underline hover:text-white transition-colors"
              >
                Change Email
              </button>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary !py-4 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}

        <div className="mt-10 pt-10 border-t border-dark-600 text-center">
          <p className="text-gray-500 text-xs">
            Don't have an account? <Link to="/register" className="text-lime-500 font-bold hover:underline ml-1 uppercase">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
