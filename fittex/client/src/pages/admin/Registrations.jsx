import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheck, FaTimes, FaEye, FaImage } from 'react-icons/fa';
import api from '../../services/api';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations(activeTab);
  }, [activeTab]);

  const fetchRegistrations = async (status) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/registrations?status=${status}`);
      setRegistrations(data.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin-secret-panel');
      else toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this registration? A member account will be created.')) return;
    setActionLoading(id + '_approve');
    try {
      const res = await api.post(`/admin/registrations/${id}/approve`);
      toast.success(res.data.message || 'Registration approved!');
      setSelectedReg(null);
      fetchRegistrations(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error('Please provide a reason');
    setActionLoading(selectedReg._id + '_reject');
    try {
      await api.post(`/admin/registrations/${selectedReg._id}/reject`, { reason: rejectReason });
      toast.success('Registration rejected');
      setShowRejectModal(false);
      setSelectedReg(null);
      setRejectReason('');
      fetchRegistrations(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = ['pending', 'approved', 'rejected'];

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex-shrink-0 flex items-center justify-center hover:border-lime-500 transition-all">
              <FaArrowLeft />
            </button>
            <div>
              <p className="text-lime-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-2xl md:text-4xl font-display uppercase">Member <span className="text-lime-500">Registrations</span></h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-700 pb-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 text-[10px] md:text-sm font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-lime-500 text-lime-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-dark-800 rounded-3xl p-6 h-28 animate-pulse"></div>)}
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-dark-800 rounded-3xl p-16 text-center">
            <p className="text-gray-500 text-xl uppercase tracking-widest">No {activeTab} registrations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map(reg => (
              <div key={reg._id} className="bg-dark-800 border border-dark-700 rounded-3xl p-6 hover:border-lime-500/30 transition-all">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Member</p>
                      <p className="font-bold text-white text-sm md:text-base">{reg.fullName}</p>
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">{reg.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Plan</p>
                      <p className="font-bold text-lime-400 text-sm md:text-base">{reg.planName}</p>
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">₹{reg.amount?.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Profile</p>
                      <p className="text-white text-xs md:text-sm">{reg.age}yr • {reg.gender}</p>
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">BMI: {reg.bmi}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                      <p className="text-white text-xs md:text-sm">{new Date(reg.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-gray-400 text-[10px] md:text-xs mt-1">{new Date(reg.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-3 flex-shrink-0">
                    <button onClick={() => { setSelectedReg(reg); setShowRejectModal(false); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase transition-all">
                      <FaImage /> Screenshot
                    </button>
                    {reg.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(reg._id)} disabled={actionLoading === reg._id + '_approve'} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-400 text-dark-900 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-black uppercase transition-all disabled:opacity-50">
                          <FaCheck /> Approve
                        </button>
                        <button onClick={() => { setSelectedReg(reg); setShowRejectModal(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase transition-all">
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                    {reg.status !== 'pending' && (
                      <span className={`w-full md:w-auto text-center px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase ${reg.status === 'approved' ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                        {reg.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedReg && !showRejectModal && (
        <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-display uppercase">{selectedReg.fullName}</h2>
                <p className="text-gray-400 text-xs md:text-sm mt-1">{selectedReg.planName} • ₹{selectedReg.amount?.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-gray-500 hover:text-white text-3xl leading-none transition-colors">×</button>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-dark-600 mb-6">
              <img src={selectedReg.paymentScreenshot} alt="Payment Screenshot" className="w-full h-auto" />
            </div>
            {selectedReg.status === 'pending' && (
              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => handleApprove(selectedReg._id)} disabled={!!actionLoading} className="flex-1 bg-lime-500 hover:bg-lime-400 text-dark-900 font-black uppercase py-4 rounded-2xl text-sm md:text-base transition-all disabled:opacity-50">
                  {actionLoading ? 'Processing...' : '✓ Approve Registration'}
                </button>
                <button onClick={() => setShowRejectModal(true)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold uppercase py-4 rounded-2xl text-sm md:text-base transition-all">
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedReg && (
        <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-6 md:p-8 max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-display uppercase mb-2">Reject Registration</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">Provide a reason for rejecting <strong className="text-white">{selectedReg.fullName}</strong>'s registration.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              className="w-full bg-dark-900 border border-dark-600 rounded-2xl p-4 focus:border-red-500 outline-none text-white mb-6 resize-none"
              placeholder="e.g. Payment screenshot is unclear. Please resubmit with a clearer image."
            />
            <div className="flex gap-4">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="flex-1 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white font-bold uppercase py-3 rounded-2xl transition-all">
                Cancel
              </button>
              <button onClick={handleReject} disabled={!!actionLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase py-3 rounded-2xl transition-all disabled:opacity-50">
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
