import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaQrcode, FaMapMarkerAlt, FaDownload, FaPrint, FaCog } from 'react-icons/fa';
import api from '../../services/api';

const AdminGymQR = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [openTime, setOpenTime] = useState(6);
  const [closeTime, setCloseTime] = useState(22);
  const [qrResult, setQrResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load existing QR settings
    api.get('/admin/gym-qr').then(res => {
      if (res.data.data) {
        const d = res.data.data;
        setQrResult({ qrImage: d.image, qrData: d.data, generatedAt: d.generatedAt });
        if (d.settings) {
          setMaxDistance(d.settings.maxDistance || 50);
          setOpenTime(d.settings.gymHours?.openTime ?? 6);
          setCloseTime(d.settings.gymHours?.closeTime ?? 22);
        }
        if (d.location) {
          setLat(d.location.latitude?.toString() || '');
          setLng(d.location.longitude?.toString() || '');
        }
      }
    }).catch(() => {});
  }, []);

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        toast.success('Location captured!');
      },
      () => toast.error('Could not get location. Enter manually.')
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!lat || !lng) return toast.error('Please enter gym GPS coordinates');
    setGenerating(true);
    try {
      const { data } = await api.post('/admin/generate-gym-qr', {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        maxDistance: parseInt(maxDistance),
        gymHours: { openTime: parseInt(openTime), closeTime: parseInt(closeTime) }
      });
      setQrResult(data.data);
      toast.success('Gym QR code generated! Print and post at entrance.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate QR');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'FITTEX-Gym-QR.png';
    link.href = qrResult.qrImage;
    link.click();
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><body style="display:flex;flex-direction:column;align-items:center;padding:40px;font-family:Arial,sans-serif;">
        <h1 style="font-size:32px;margin-bottom:8px;">FITTEX GYM</h1>
        <p style="color:#666;margin-bottom:24px;">Scan to check in</p>
        <img src="${qrResult.qrImage}" style="width:300px;height:300px;"/>
        <p style="margin-top:24px;color:#888;font-size:12px;">${qrResult.qrData}</p>
      </body></html>
    `);
    win.print();
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const fmt = h => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-4xl font-display uppercase">Gym <span className="text-lime-500">QR Setup</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600">
              <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500"><FaCog /></div>
              <h3 className="font-display uppercase text-lg">Gym Configuration</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* GPS Coordinates */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">GPS Coordinates</label>
                  <button type="button" onClick={handleGetMyLocation} className="text-xs text-lime-400 hover:text-lime-300 font-bold uppercase flex items-center gap-1">
                    <FaMapMarkerAlt /> Use My Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude (e.g. 23.1765)" required
                    className="bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 outline-none text-white text-sm" />
                  <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude (e.g. 80.0407)" required
                    className="bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 outline-none text-white text-sm" />
                </div>
              </div>

              {/* Check-in Radius */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                  Check-in Radius: <span className="text-lime-400">{maxDistance}m</span>
                </label>
                <input type="range" min={10} max={500} step={10} value={maxDistance} onChange={e => setMaxDistance(e.target.value)}
                  className="w-full accent-lime-500" />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>10m</span><span>500m</span>
                </div>
              </div>

              {/* Gym Hours */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Gym Hours</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Open Time</p>
                    <select value={openTime} onChange={e => setOpenTime(parseInt(e.target.value))}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 outline-none text-white text-sm">
                      {hours.map(h => <option key={h} value={h}>{fmt(h)}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Close Time</p>
                    <select value={closeTime} onChange={e => setCloseTime(parseInt(e.target.value))}
                      className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 outline-none text-white text-sm">
                      {hours.map(h => <option key={h} value={h}>{fmt(h)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={generating}
                className="w-full btn-primary flex items-center justify-center gap-3 !py-4 disabled:opacity-50">
                <FaQrcode /> {generating ? 'Generating...' : 'Generate QR Code'}
              </button>
            </form>
          </div>

          {/* QR Display */}
          <div className="glass-card flex flex-col items-center">
            <div className="flex items-center gap-3 w-full mb-6 pb-4 border-b border-dark-600">
              <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500"><FaQrcode /></div>
              <h3 className="font-display uppercase text-lg">Gym QR Code</h3>
            </div>

            {qrResult ? (
              <div className="text-center flex-1 flex flex-col items-center justify-between">
                <div>
                  <div className="bg-white p-4 rounded-3xl inline-block shadow-xl shadow-lime-500/10 mb-4">
                    <img src={qrResult.qrImage} alt="Gym QR Code" className="w-64 h-64" />
                  </div>
                  <p className="font-mono text-xs text-gray-500 mb-1 break-all">{qrResult.qrData}</p>
                  {qrResult.generatedAt && (
                    <p className="text-gray-600 text-xs">Generated: {new Date(qrResult.generatedAt).toLocaleString('en-IN')}</p>
                  )}
                </div>
                <div className="bg-lime-500/5 border border-lime-500/20 rounded-2xl p-4 mt-4 text-left w-full">
                  <p className="text-lime-400 text-xs font-bold mb-1">📌 Next Steps</p>
                  <p className="text-gray-400 text-xs">Print this QR code and post it at the gym entrance. Members will scan it to check in automatically.</p>
                </div>
                <div className="flex gap-3 mt-4 w-full">
                  <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white font-bold uppercase py-3 rounded-2xl text-sm transition-all">
                    <FaDownload /> Download PNG
                  </button>
                  <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 btn-primary !py-3 text-sm">
                    <FaPrint /> Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-dark-700 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-dark-500">
                  <FaQrcode className="text-4xl text-gray-600" />
                </div>
                <p className="text-gray-500">Configure gym location and generate QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGymQR;
