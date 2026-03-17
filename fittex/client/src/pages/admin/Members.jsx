import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import api from '../../services/api';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/admin/members');
      setMembers(data.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin-login');
      else toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(m =>
    m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    m.memberId?.toLowerCase().includes(search.toLowerCase()) ||
    m.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex-shrink-0 flex items-center justify-center hover:border-lime-500 transition-all">
              <FaArrowLeft />
            </button>
            <div className="flex-1">
              <p className="text-lime-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-2xl md:text-4xl font-display uppercase">All <span className="text-lime-500">Members</span></h1>
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search name, ID, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-full py-3 pl-10 pr-6 focus:border-lime-500 outline-none text-sm w-full md:w-72"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-dark-800 rounded-3xl p-6 h-20 animate-pulse"></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-dark-800 rounded-3xl p-16 text-center">
            <p className="text-gray-500 text-xl uppercase tracking-widest">No members found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-3xl border border-dark-700">
              <table className="w-full">
                <thead className="bg-dark-800 border-b border-dark-700">
                  <tr>
                    {['Member ID', 'Name', 'Phone', 'Plan', 'Status', 'End Date'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr key={m._id} className={`border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-dark-800/20'}`}>
                      <td className="px-6 py-4 font-mono text-lime-500 text-sm font-bold">{m.memberId}</td>
                      <td className="px-6 py-4 font-bold">{m.fullName}</td>
                      <td className="px-6 py-4 text-gray-400">{m.phone}</td>
                      <td className="px-6 py-4 text-gray-300">{m.planName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${m.status === 'active' ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{m.endDate ? new Date(m.endDate).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden space-y-4">
              {filtered.map((m) => (
                <div key={m._id} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lime-500 font-mono text-xs font-bold mb-1">{m.memberId}</p>
                      <h3 className="text-lg font-bold text-white">{m.fullName}</h3>
                      <p className="text-gray-400 text-sm">{m.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'active' ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-700/50">
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Plan</p>
                      <p className="text-gray-300 text-sm">{m.planName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Ends On</p>
                      <p className="text-gray-400 text-sm">{m.endDate ? new Date(m.endDate).toLocaleDateString('en-IN') : '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMembers;
