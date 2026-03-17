import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUsers, FaUserCheck, FaClock, FaMoneyBillWave, FaSignOutAlt, FaClipboardList, FaCog, FaQrcode, FaCalendarAlt } from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboard = ({ setUser }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin-login');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      if (setUser) setUser(null);
      navigate('/admin-login');
    } catch (e) {
      navigate('/admin-login');
    }
  };

  const statCards = [
    { label: 'Total Members', value: stats?.totalMembers ?? 0, icon: <FaUsers />, color: 'lime' },
    { label: 'Active Members', value: stats?.activeMembers ?? 0, icon: <FaUserCheck />, color: 'blue' },
    { label: 'Pending Approvals', value: stats?.pendingRegistrations ?? 0, icon: <FaClock />, color: 'yellow', urgent: (stats?.pendingRegistrations ?? 0) > 0 },
    { label: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}`, icon: <FaMoneyBillWave />, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6">
      {/* Header */}
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-2">Admin Panel</p>
            <h1 className="text-4xl font-display uppercase">FITTEX <span className="text-lime-500">Dashboard</span></h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-dark-700 border border-dark-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-5 py-2.5 rounded-full transition-all text-sm font-bold uppercase"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-3xl p-6 animate-pulse h-32"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card, i) => (
              <div key={i} className={`glass-card relative overflow-hidden ${card.urgent ? 'border-yellow-500/50 animate-pulse' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{card.label}</p>
                  <div className={`p-2 rounded-xl ${card.urgent ? 'bg-yellow-500/20 text-yellow-400' : 'bg-lime-500/10 text-lime-500'}`}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-4xl font-display text-white">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/registrations')}
            className="glass-card text-left group hover:border-lime-500/50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mb-4 group-hover:bg-lime-500 group-hover:text-dark-900 transition-all">
              <FaClipboardList className="text-xl" />
            </div>
            <h3 className="text-xl font-display uppercase mb-2">Registrations</h3>
            <p className="text-gray-500 text-sm">Review and approve pending member registrations</p>
            {(stats?.pendingRegistrations ?? 0) > 0 && (
              <span className="mt-3 inline-block bg-yellow-500 text-dark-900 text-xs font-black px-2 py-1 rounded-full">
                {stats.pendingRegistrations} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/admin/members')}
            className="glass-card text-left group hover:border-lime-500/50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mb-4 group-hover:bg-lime-500 group-hover:text-dark-900 transition-all">
              <FaUsers className="text-xl" />
            </div>
            <h3 className="text-xl font-display uppercase mb-2">Members</h3>
            <p className="text-gray-500 text-sm">View and manage all registered gym members</p>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="glass-card text-left group hover:border-lime-500/50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mb-4 group-hover:bg-lime-500 group-hover:text-dark-900 transition-all">
              <FaCog className="text-xl" />
            </div>
            <h3 className="text-xl font-display uppercase mb-2">Settings</h3>
            <p className="text-gray-500 text-sm">Configure gym settings, payment info, and plans</p>
          </button>

          <button
            onClick={() => navigate('/admin/gym-qr-code')}
            className="glass-card text-left group hover:border-lime-500/50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mb-4 group-hover:bg-lime-500 group-hover:text-dark-900 transition-all">
              <FaQrcode className="text-xl" />
            </div>
            <h3 className="text-xl font-display uppercase mb-2">Gym QR Code</h3>
            <p className="text-gray-500 text-sm">Set GPS coordinates and generate check-in QR code</p>
          </button>

          <button
            onClick={() => navigate('/admin/live-attendance')}
            className="glass-card text-left group hover:border-lime-500/50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mb-4 group-hover:bg-lime-500 group-hover:text-dark-900 transition-all">
              <FaCalendarAlt className="text-xl" />
            </div>
            <h3 className="text-xl font-display uppercase mb-2">Live Attendance</h3>
            <p className="text-gray-500 text-sm">Real-time check-ins today with hourly chart</p>
            {stats?.todayAttendance > 0 && (
              <span className="mt-3 inline-block bg-lime-500/20 text-lime-400 text-xs font-black px-2 py-1 rounded-full border border-lime-500/20">
                {stats?.todayAttendance || 0} today
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
