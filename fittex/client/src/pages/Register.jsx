import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { FaPhone, FaLock, FaUser, FaEnvelope, FaRulerVertical, FaWeight, FaBullseye, FaChartLine, FaCloudUploadAlt, FaCalendarCheck, FaInfoCircle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    otp: '',
    email: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'beginner',
    planId: '',
    paymentScreenshot: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [plansRes, payRes] = await Promise.all([
        api.get('/public/plans'),
        api.get('/public/payment-details')
      ]);
      if (plansRes.data.success) {
        setPlans(plansRes.data.data);
        if (plansRes.data.data.length > 0) {
          setFormData(prev => ({ ...prev, planId: plansRes.data.data[0]._id }));
        }
      }
      if (payRes.data.success) setPaymentDetails(payRes.data.data);
    } catch (err) {
      console.log('Error fetching initial data');
    }
  };

  // Removed OTP handlers

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be less than 5MB');
    }

    const reader = new FileReader();
    reader.onloadstart = () => setLoading(true);
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, paymentScreenshot: event.target.result }));
      toast.success('Screenshot processed successfully!');
      setLoading(false);
    };
    reader.onerror = () => {
      toast.error('Failed to process image');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentScreenshot) return toast.error('Please upload payment screenshot');

    setLoading(true);
    try {
      // Use public endpoint for registration without auth
      const { data } = await api.post('/public/register', formData);
      if (data.success) {
        toast.success(data.message, { duration: 6000 });
        setStep(3); // Success step
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height) / 100;
      const w = parseFloat(formData.weight);
      return (w / (h * h)).toFixed(1);
    }
    return '0.0';
  };

  const renderStepIcon = (s) => {
    const active = step >= s;
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${active ? 'bg-lime-500 text-dark-900 shadow-lime-500/30 shadow-lg' : 'bg-dark-700 text-gray-500 border border-dark-600'}`}>
        {s}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-dark-900">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {renderStepIcon(1)} <div className={`h-px w-8 md:w-32 ${step > 1 ? 'bg-lime-500' : 'bg-dark-700'}`}></div>
          {renderStepIcon(2)} 
        </div>

        <div className="glass-card bg-dark-800/90 p-8 md:p-12 overflow-hidden">
          {/* Removed old Step 1 and Step 2 OTP sections */}

          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-5xl uppercase font-black mb-4">Complete your <span className="text-lime-500">Profile</span></h2>
                <p className="text-gray-400">Tell us about yourself so we can tailor your experience.</p>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal */}
                  <div className="space-y-6">
                    <h4 className="text-lime-500 uppercase font-black tracking-widest text-xs flex items-center gap-2">
                       <FaUser className="bg-lime-500/20 p-1 rounded text-xl" /> Personal Details
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative hover:border-lime-500 focus-within:border-lime-500 border border-dark-600 rounded-xl overflow-hidden bg-dark-700 transition-colors">
                          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-transparent py-3 pl-12 pr-4 focus:outline-none" required />
                        </div>
                        <div className="relative hover:border-lime-500 focus-within:border-lime-500 border border-dark-600 rounded-xl overflow-hidden bg-dark-700 transition-colors">
                          <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full bg-transparent py-3 pl-12 pr-4 focus:outline-none" required />
                        </div>
                      </div>
                      <div className="relative hover:border-lime-500 focus-within:border-lime-500 border border-dark-600 rounded-xl overflow-hidden bg-dark-700 transition-colors">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent py-3 pl-12 pr-4 focus:outline-none" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="bg-dark-700 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500" required />
                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="bg-dark-700 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Physical */}
                  <div className="space-y-6">
                    <h4 className="text-lime-500 uppercase font-bold tracking-wider text-sm flex items-center gap-2">
                       <FaRulerVertical className="bg-lime-500/10 p-1 rounded text-xl" /> Physical Stats
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <FaRulerVertical className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="number" placeholder="Height (cm)" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full bg-dark-700 border border-dark-600 rounded-xl py-3 pl-12 pr-4 focus:border-lime-500" required />
                        </div>
                        <div className="relative">
                          <FaWeight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full bg-dark-700 border border-dark-600 rounded-xl py-3 pl-12 pr-4 focus:border-lime-500" required />
                        </div>
                      </div>
                      <div className="bg-dark-900 border border-dark-600 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Calculated BMI</span>
                        <div className="text-right">
                          <span className="text-3xl font-display text-lime-500 italic leading-none">{calculateBMI()}</span>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Normal is 18.5 - 24.9</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-6">
                    <h4 className="text-lime-500 uppercase font-bold tracking-wider text-sm flex items-center gap-2">
                       <FaBullseye className="bg-lime-500/10 p-1 rounded text-xl" /> Fitness Profile
                    </h4>
                    <div className="space-y-4">
                      <select value={formData.fitnessGoal} onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })} className="w-full bg-dark-700 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500">
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                      <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })} className="w-full bg-dark-700 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Membership */}
                  <div className="space-y-6">
                    <h4 className="text-lime-500 uppercase font-bold tracking-wider text-sm flex items-center gap-2">
                       <FaCalendarCheck className="bg-lime-500/10 p-1 rounded text-xl" /> Selected Plan
                    </h4>
                    <div className="space-y-4">
                      <select 
                        value={formData.planId} 
                        onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl py-3 px-4 focus:border-lime-500 font-bold"
                      >
                        {plans.map(p => (
                          <option key={p._id} value={p._id}>{p.planName} - ₹{p.price.toLocaleString('en-IN')}</option>
                        ))}
                      </select>
                      <div className="p-3 bg-lime-500/5 border border-lime-500/20 rounded-xl flex items-start gap-3">
                        <FaInfoCircle className="text-lime-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-gray-400 italic">
                          Membership starts from date of approval. You'll receive a confirmation invoice via email.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button type="submit" className="btn-primary !px-12 !py-4 uppercase tracking-wider text-sm">Next Step</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in relative">
              <div className="text-center mb-12">
                <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">Final Step</span>
                <h2 className="text-5xl uppercase font-black mb-4">Payment <span className="text-lime-500">Verification</span></h2>
                <p className="text-gray-400">Scan QR to pay ₹{plans.find(p => p._id === formData.planId)?.price.toLocaleString('en-IN')} and upload screenshot.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left: QR and Details */}
                <div className="lg:w-1/2 space-y-8 w-full">
                  <div className="bg-white p-6 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-lime-500/10 max-w-[300px] mx-auto group">
                    {paymentDetails.upiQRCode ? (
                      <img src={paymentDetails.upiQRCode} alt="UPI QR" className="w-full aspect-square object-contain" />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center flex-col text-gray-400">
                        <FaChartLine className="text-4xl mb-4 opacity-30 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">QR Not Available</span>
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <p className="text-dark-900 font-black text-lg tracking-tight uppercase">Pay with UPI</p>
                      <p className="text-dark-900/40 text-xs font-bold font-mono">{paymentDetails.upiId || 'fittexgym@paytm'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lime-500 uppercase font-black tracking-widest text-xs flex items-center gap-2">
                      <FaArrowRight className="bg-lime-500/20 p-1 rounded text-xl" /> Bank Details
                    </h4>
                    <div className="bg-dark-900/50 rounded-2xl p-6 border border-dark-600 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 uppercase text-[10px] font-black tracking-widest leading-none">Account Name</span>
                        <span className="text-white font-bold">{paymentDetails.accountHolderName || 'FITTEX GYM'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 uppercase text-[10px] font-black tracking-widest leading-none">Account Number</span>
                        <span className="text-white font-bold">{paymentDetails.bankAccount || '1234567890'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 uppercase text-[10px] font-black tracking-widest leading-none">IFSC Code</span>
                        <span className="text-white font-bold tracking-widest">{paymentDetails.bankIFSC || 'SBIN0001234'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Upload */}
                <div className="lg:w-1/2 w-full space-y-8">
                  <div className="space-y-6">
                    <h4 className="text-lime-500 uppercase font-black tracking-widest text-xs flex items-center gap-2">
                       <FaCloudUploadAlt className="bg-lime-500/20 p-1 rounded text-xl" /> Upload Screenshot
                    </h4>
                    
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="screenshot" 
                        onChange={handleScreenshotUpload}
                        className="hidden" 
                        accept="image/*"
                      />
                      <label 
                        htmlFor="screenshot" 
                        className={`w-full h-80 border-4 border-dashed rounded-[3rem] transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${formData.paymentScreenshot ? 'border-lime-500/50' : 'border-dark-600 hover:border-lime-500/50 bg-dark-700/50'}`}
                      >
                        {formData.paymentScreenshot ? (
                          <div className="relative w-full h-full group">
                            <img src={formData.paymentScreenshot} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="bg-white text-dark-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <FaCloudUploadAlt className="text-4xl text-lime-500" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-white mb-2">Tap to upload</span>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tight">JPEG, PNG up to 5MB</p>
                          </>
                        )}
                      </label>
                      {loading && (
                        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm rounded-[3rem] flex items-center justify-center">
                          <div className="w-10 h-10 border-t-2 border-lime-500 rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="bg-dark-900/50 p-6 rounded-2xl border border-blue-500/20 flex gap-4">
                      <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-400 leading-relaxed italic">
                        Processing takes up to 24 hours. Once verified, you'll receive your member login details via SMS and email.
                      </p>
                    </div>
                    <button 
                      onClick={handleSubmit} 
                      disabled={loading || !formData.paymentScreenshot} 
                      className="w-full btn-primary !py-5 uppercase text-sm tracking-[0.2em] font-black disabled:opacity-30 disabled:grayscale"
                    >
                      {loading ? 'Submitting...' : 'Register as Member'}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Go Back to Profile</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-fade-in relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-500/20 blur-[100px] rounded-full"></div>
              <div className="relative z-10 scale-125 md:scale-150 mb-10 inline-block">
                 <FaCheckCircle className="text-lime-500 text-6xl drop-shadow-[0_0_20px_rgba(191,255,0,0.5)]" />
              </div>
              <h2 className="text-5xl uppercase font-black mb-6 relative z-10 leading-tight">Registration <br /><span className="text-lime-500 italic">Submitted!</span></h2>
              <p className="max-w-md mx-auto text-gray-400 mb-12 relative z-10 leading-relaxed">
                Thank you, <span className="text-white font-bold">{formData.fullName}</span>! Your registration is currently under review by our team.
              </p>
              <div className="space-y-4 relative z-10">
                <div className="bg-dark-900/80 p-6 rounded-3xl border border-dark-600 inline-block text-left mb-10 w-full max-w-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest animate-pulse">Pending Approval</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</span>
                    <span className="text-[10px] font-bold text-white tracking-widest">+91 {formData.phone}</span>
                  </div>
                </div>
                <br />
                <button onClick={() => navigate('/')} className="btn-primary !px-12">Return Home</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
