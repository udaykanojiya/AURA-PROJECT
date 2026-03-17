import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaRuler, FaWeight, FaHeartbeat, FaUser } from 'react-icons/fa';
import { getMemberProfile } from '../../services/api';

const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMemberProfile()
      .then(({ data }) => setProfile(data))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const bmiCategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-lime-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const bmi = bmiCategory(profile?.bmi);

  const InfoItem = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-white font-bold">{value || '—'}</p>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="text-lime-500 animate-pulse text-xl font-display uppercase">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/member/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-4xl font-display uppercase">My <span className="text-lime-500">Profile</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600">
              <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500"><FaUser /></div>
              <h3 className="font-display uppercase text-lg">Personal Info</h3>
            </div>
            <div className="space-y-5">
              <InfoItem label="Full Name" value={profile?.fullName} />
              <InfoItem label="Member ID" value={<span className="font-mono text-lime-400">{profile?.memberId}</span>} />
              <InfoItem label="Phone" value={profile?.phone} />
              <InfoItem label="Email" value={profile?.email} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Age" value={profile?.age ? `${profile.age} years` : '—'} />
                <InfoItem label="Gender" value={profile?.gender} />
              </div>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600">
              <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500"><FaHeartbeat /></div>
              <h3 className="font-display uppercase text-lg">Physical Stats</h3>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Height" value={profile?.height ? `${profile.height} cm` : '—'} />
                <InfoItem label="Weight" value={profile?.weight ? `${profile.weight} kg` : '—'} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">BMI</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-display text-white">{profile?.bmi || '—'}</p>
                  {bmi && <span className={`text-sm font-black uppercase ${bmi.color}`}>{bmi.label}</span>}
                </div>
              </div>
              <InfoItem label="Fitness Goal" value={profile?.fitnessGoal?.replace(/_/g, ' ')} />
              <InfoItem label="Experience Level" value={profile?.experienceLevel} />
            </div>
          </div>

          {/* Membership */}
          <div className="glass-card md:col-span-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-600">
              <div className="w-9 h-9 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-500"><FaWeight /></div>
              <h3 className="font-display uppercase text-lg">Membership Details</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <InfoItem label="Plan" value={profile?.planName} />
              <InfoItem label="Status" value={
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${profile?.status === 'active' ? 'bg-lime-500/20 text-lime-400' : 'bg-red-500/20 text-red-400'}`}>
                  {profile?.status}
                </span>
              } />
              <InfoItem label="Start Date" value={profile?.startDate ? new Date(profile.startDate).toLocaleDateString('en-IN') : '—'} />
              <InfoItem label="End Date" value={profile?.endDate ? new Date(profile.endDate).toLocaleDateString('en-IN') : '—'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
