import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaQrcode, FaSyncAlt } from 'react-icons/fa';
import { getMemberQRCode } from '../../services/api';

const MemberQRCode = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchQR = async () => {
    try {
      const { data } = await getMemberQRCode();
      setQrData(data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchQR(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQR();
    toast.success('QR code refreshed!');
  };

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="text-lime-500 animate-pulse text-xl font-display uppercase">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/member/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-4xl font-display uppercase">My <span className="text-lime-500">QR Code</span></h1>
          </div>
        </div>

        <div className="glass-card text-center">
          {/* QR Code display */}
          <div className="flex justify-center mb-6">
            {qrData?.qrCode ? (
              <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl shadow-lime-500/10">
                <img src={qrData.qrCode} alt="Member QR Code" className="w-56 h-56 rounded-2xl" />
              </div>
            ) : (
              <div className="bg-dark-700 w-64 h-64 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-dark-500">
                <FaQrcode className="text-5xl text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">QR Code not generated yet</p>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-display uppercase mb-1">{qrData?.memberName}</h2>
          <p className="text-lime-400 font-mono font-bold mb-6">{qrData?.memberId}</p>

          <div className="bg-lime-500/5 border border-lime-500/20 rounded-2xl p-4 mb-6 text-left">
            <p className="text-lime-400 text-sm font-bold mb-1">✅ How to Use</p>
            <p className="text-gray-400 text-sm">Show this QR code to gym staff at the entrance. They'll scan it to mark your attendance automatically.</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 mx-auto text-gray-500 hover:text-lime-400 transition-colors text-sm font-bold uppercase disabled:opacity-50"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh QR Code'}
          </button>
          <p className="text-gray-600 text-xs mt-3">QR code is unique to your membership</p>
        </div>
      </div>
    </div>
  );
};

export default MemberQRCode;
