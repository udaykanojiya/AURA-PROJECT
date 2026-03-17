import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaFire } from 'react-icons/fa';
import { getMemberAttendance } from '../../services/api';

const MemberAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMemberAttendance()
      .then(({ data }) => setData(data))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else toast.error('Failed to load attendance');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="text-lime-500 animate-pulse text-xl font-display uppercase">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/member/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-4xl font-display uppercase">Attendance <span className="text-lime-500">History</span></h1>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card text-center">
            <p className="text-4xl font-display text-white">{data?.summary?.total || 0}</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Total Sessions</p>
          </div>
          <div className="glass-card text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-display text-orange-400">{data?.summary?.currentStreak || 0}</p>
              <FaFire className="text-orange-400 text-2xl" />
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Day Streak</p>
          </div>
        </div>

        {/* Records */}
        <div className="glass-card">
          <h3 className="font-display uppercase text-lg mb-6">Recent Check-ins</h3>
          {!data?.records?.length ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No attendance records yet</p>
              <p className="text-gray-600 text-sm mt-2">Visit the gym to start your streak!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.records.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-4 bg-dark-700/50 rounded-2xl">
                  <div>
                    <p className="font-bold text-white">
                      {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {record.checkInTime && (
                      <p className="text-gray-500 text-xs mt-1">
                        Check-in: {new Date(record.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  {record.status === 'present' ? (
                    <div className="flex items-center gap-2 bg-lime-500/10 border border-lime-500/20 text-lime-400 px-4 py-2 rounded-full text-sm font-black uppercase">
                      <FaCheckCircle /> Present
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-black uppercase">
                      <FaTimesCircle /> Absent
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberAttendance;
