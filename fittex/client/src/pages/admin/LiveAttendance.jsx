import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSync, FaUserCheck, FaClock } from 'react-icons/fa';
import api from '../../services/api';

const AdminLiveAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const { data: res } = await api.get('/admin/live-attendance');
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin-secret-panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(intervalRef.current);
  }, []);

  const fmt = (dt) => dt ? new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

  const maxHourly = data?.hourlyStats?.length
    ? Math.max(...data.hourlyStats.map(h => h.count), 1)
    : 1;

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-4 md:px-6 pb-12">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex-shrink-0 flex items-center justify-center hover:border-lime-500 transition-all">
              <FaArrowLeft />
            </button>
            <div>
              <p className="text-lime-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-2xl md:text-4xl font-display uppercase">Live <span className="text-lime-500">Attendance</span></h1>
            </div>
          </div>
          <button onClick={fetchData} className="w-fit flex items-center gap-2 text-gray-500 hover:text-lime-400 text-[10px] md:text-sm font-bold uppercase transition-colors">
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-2 mb-8 text-xs text-gray-600">
          <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
          Auto-refreshing every 10 seconds
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-dark-800 rounded-3xl h-24 animate-pulse"></div>)}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-500 mx-auto mb-4 text-lg md:text-xl">
                  <FaUserCheck />
                </div>
                <p className="text-4xl md:text-5xl font-display text-white">{data?.todayCheckIns || 0}</p>
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-2">Today's Check-ins</p>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4 text-lg md:text-xl">
                  <FaClock />
                </div>
                <p className="text-4xl md:text-5xl font-display text-white">
                  {data?.hourlyStats?.find(h => h.hour === new Date().getHours())?.count || 0}
                </p>
                <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-2">This Hour</p>
              </div>
            </div>

            {/* Hourly Bar Chart */}
            {data?.hourlyStats?.length > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6 mb-8">
                <h3 className="font-display uppercase text-base md:text-lg mb-6">Hourly Check-ins</h3>
                <div className="overflow-x-auto no-scrollbar pt-4">
                  <div className="flex items-end gap-1 h-32 min-w-[400px]">
                    {data.hourlyStats.map(({ hour, count }) => (
                      <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[8px] text-gray-500">{count}</span>
                        <div
                          className="w-full bg-lime-500 rounded-t-sm transition-all"
                          style={{ height: `${(count / maxHourly) * 100}%`, minHeight: '4px' }}
                        />
                        <span className="text-[8px] text-gray-600 uppercase">
                          {hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Check-ins */}
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-6">
              <h3 className="font-display uppercase text-base md:text-lg mb-6">Recent Check-ins</h3>
              {!data?.recentCheckIns?.length ? (
                <div className="text-center py-12 text-gray-500">No check-ins today yet</div>
              ) : (
                <div className="space-y-3">
                  {data.recentCheckIns.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-dark-700/50 rounded-2xl">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500 text-xs md:text-sm font-black">
                          {r.memberName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs md:text-base">{r.memberName}</p>
                          <p className="text-lime-400 font-mono text-[10px] md:text-xs">{r.memberId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-xs md:text-base">{fmt(r.checkInTime)}</p>
                        <p className="text-lime-400 text-[10px] md:text-xs">✅ Present</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLiveAttendance;
