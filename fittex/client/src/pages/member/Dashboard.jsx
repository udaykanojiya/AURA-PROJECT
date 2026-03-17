import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaQrcode, FaCalendarAlt, FaDumbbell, FaFileInvoice, FaUser, FaSignOutAlt, FaFire, FaCheckCircle, FaClock, FaCamera } from 'react-icons/fa';
import { getMemberDashboard, memberLogout } from '../../services/api';

const MemberDashboard = ({ setUser }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await getMemberDashboard();
      setDashboard(data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await memberLogout();
      if (setUser) setUser(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (e) {
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-lime-400 bg-lime-500/10 border-lime-500/30';
    if (status === 'expired') return 'text-red-400 bg-red-500/10 border-red-500/30';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  };

  const getDaysColor = (days) => {
    if (days > 30) return 'text-lime-400';
    if (days > 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const quickLinks = [
    { label: 'Check In', icon: <FaCamera />, path: '/member/check-in', color: 'lime', highlight: true },
    { label: 'My Profile', icon: <FaUser />, path: '/member/profile', color: 'blue' },
    { label: 'Attendance', icon: <FaCalendarAlt />, path: '/member/attendance', color: 'purple' },
    { label: 'Workout Plan', icon: <FaDumbbell />, path: '/member/workout', color: 'orange' },
    { label: 'My Invoices', icon: <FaFileInvoice />, path: '/member/invoices', color: 'pink' },
    { label: 'QR Code', icon: <FaQrcode />, path: '/member/qr', color: 'lime' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-2">Member Portal</p>
            <h1 className="text-4xl font-display uppercase leading-tight">
              {loading ? 'Loading...' : <>Welcome, <span className="text-lime-500">{dashboard?.memberName?.split(' ')[0]}</span></>}
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-1">{dashboard?.memberId}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-dark-700 border border-dark-600 hover:border-red-500 text-gray-400 hover:text-red-400 px-4 py-2.5 rounded-full transition-all text-sm font-bold uppercase">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Membership Status */}
        {loading ? (
          <div className="bg-dark-800 rounded-3xl p-6 h-36 animate-pulse mb-6"></div>
        ) : (
          <div className={`glass-card mb-6 border ${getStatusColor(dashboard?.status)}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Plan</p>
                <p className="font-bold text-white text-lg">{dashboard?.planName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                <span className={`text-sm font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(dashboard?.status)}`}>
                  {dashboard?.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Days Left</p>
                <p className={`text-3xl font-display ${getDaysColor(dashboard?.daysRemaining)}`}>{dashboard?.daysRemaining}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Expires</p>
                <p className="text-white font-bold">{dashboard?.endDate ? new Date(dashboard.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
              </div>
            </div>
            {dashboard?.daysRemaining > 0 && dashboard?.daysRemaining < 7 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 text-sm font-bold">⚠️ Membership expiring soon! Please renew to continue access.</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-dark-800 rounded-3xl h-28 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card text-center">
              <div className="w-10 h-10 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mx-auto mb-3">
                <FaCheckCircle />
              </div>
              <p className="text-3xl font-display text-white">{dashboard?.attendanceThisMonth}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Sessions This Month</p>
            </div>
            <div className="glass-card text-center">
              <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 mx-auto mb-3">
                <FaFire />
              </div>
              <p className="text-3xl font-display text-white">{dashboard?.currentStreak}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Day Streak 🔥</p>
            </div>
            <div className="glass-card text-center">
              <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-3">
                <FaClock />
              </div>
              <p className="text-3xl font-display text-white">{dashboard?.totalAttendance}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Total Sessions</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickLinks.map(({ label, icon, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="glass-card text-center group hover:border-lime-500/50 transition-all cursor-pointer flex flex-col items-center gap-3 py-6"
            >
              <div className={`w-12 h-12 bg-${color}-500/10 group-hover:bg-lime-500 rounded-2xl flex items-center justify-center text-${color}-400 group-hover:text-dark-900 transition-all text-lg`}>
                {icon}
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-400 group-hover:text-white transition-colors">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
