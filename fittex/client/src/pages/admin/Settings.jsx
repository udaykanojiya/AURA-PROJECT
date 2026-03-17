import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaStore, FaQrcode, FaShieldAlt, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    gymName: '',
    address: '',
    phone: '',
    email: '',
    upiId: '',
    adminUsername: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrPreview, setQrPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/admin/settings');
      const s = data.data || {};
      setSettings({
        gymName: s.gymName || 'FITTEX Gym',
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
        upiId: s.upiId || '',
        adminUsername: s.adminUsername || '',
        adminPassword: '',
      });
      if (s.upiQRCode) setQrPreview(s.upiQRCode);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin-secret-panel');
      else toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setQrPreview(ev.target.result);
      setSettings(prev => ({ ...prev, upiQRCode: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...settings };
      if (qrPreview && qrPreview !== settings.upiQRCode) {
        payload.upiQRCode = qrPreview;
      }
      if (!payload.adminPassword) delete payload.adminPassword;
      await api.patch('/admin/settings', payload);
      toast.success('Settings saved successfully!');
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-lime-500 animate-pulse text-xl font-display uppercase">Loading Settings...</div>
      </div>
    );
  }

  const Section = ({ title, icon, children }) => (
    <div className="glass-card mb-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600">
        <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500">{icon}</div>
        <h3 className="font-display uppercase text-lg tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, value, field, type = 'text', placeholder }) => (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 outline-none text-white text-sm transition-colors"
      />
    </div>
  );

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
            <h1 className="text-4xl font-display uppercase">Gym <span className="text-lime-500">Settings</span></h1>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Gym Info */}
          <Section title="Gym Information" icon={<FaStore />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Gym Name" value={settings.gymName} field="gymName" placeholder="FITTEX Gym" />
              <Field label="Phone" value={settings.phone} field="phone" placeholder="+91 98765 43210" />
              <Field label="Email" value={settings.email} field="email" type="email" placeholder="info@fittexgym.com" />
              <div className="md:col-span-2">
                <Field label="Address" value={settings.address} field="address" placeholder="123, Gym Street, City, State" />
              </div>
            </div>
          </Section>

          {/* Payment Info */}
          <Section title="Payment & UPI" icon={<FaQrcode />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Field label="UPI ID" value={settings.upiId} field="upiId" placeholder="fittexgym@paytm" />
                <p className="text-gray-600 text-xs mt-2">This UPI ID will be shown to members during registration</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">UPI QR Code</label>
                {qrPreview ? (
                  <div className="relative inline-block">
                    <img src={qrPreview} alt="QR Code" className="w-32 h-32 rounded-xl border-2 border-lime-500/30 object-cover" />
                    <button type="button" onClick={() => { setQrPreview(''); setSettings(p => ({ ...p, upiQRCode: '' })); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600">
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 border-2 border-dashed border-dark-600 hover:border-lime-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <FaQrcode className="text-2xl text-gray-600 group-hover:text-lime-500 mb-2" />
                    <span className="text-[10px] text-gray-600 group-hover:text-lime-500">Upload QR</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} />
                  </label>
                )}
              </div>
            </div>
          </Section>

          {/* Admin Credentials */}
          <Section title="Admin Credentials" icon={<FaShieldAlt />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Admin Username" value={settings.adminUsername} field="adminUsername" placeholder="admin" />
              <Field label="New Password (leave blank to keep current)" value={settings.adminPassword} field="adminPassword" type="password" placeholder="••••••••" />
            </div>
            <p className="text-yellow-500/70 text-xs mt-4">⚠️ Changing credentials will require you to log in again.</p>
          </Section>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-3 disabled:opacity-50 !px-10 !py-4">
              <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
