import { useState } from 'react';
import { sendOTP, verifyOTP } from '../services/api';

function OTPLogin() {
  const [step, setStep] = useState(1); // 1: Enter phone/email, 2: Enter OTP
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await sendOTP(phone, email);
      setMessage(result.message);
      setStep(2); // Move to OTP input step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await verifyOTP(phone, otp);
      setMessage('Login successful!');
      console.log('User verified:', result.data);
      // TODO: Save user data and redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          FITTEX LOGIN
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                maxLength="10"
                className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-900 text-green-200 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4 text-gray-300">
              <p>OTP sent to: <strong>{email}</strong></p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-green-400 text-sm underline mt-2"
              >
                Change phone/email
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="123456"
                maxLength="6"
                className="w-full p-3 bg-gray-700 text-white text-center text-2xl tracking-widest rounded focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Valid for 5 minutes
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-900 text-green-200 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition disabled:opacity-50 mb-3"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default OTPLogin;
