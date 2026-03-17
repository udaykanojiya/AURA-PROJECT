import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaFire } from 'react-icons/fa';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api';

const MemberCheckIn = () => {
  const [step, setStep] = useState('scanner'); // scanner | locating | success | error
  const [result, setResult] = useState(null);       // success data
  const [error, setError] = useState(null);          // { code, message, distance?, maxDistance? }
  const [qrData, setQrData] = useState(null);
  const [locating, setLocating] = useState(false);
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mount QR scanner
    if (!containerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr-scanner-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // Camera only
      },
      false
    );

    scanner.render(
      (decodedText) => {
        if (decodedText.startsWith('FITTEX:')) {
          scanner.clear().catch(() => {});
          setQrData(decodedText);
          handleLocationCapture(decodedText);
        } else {
          toast.error('Invalid QR code. Scan the gym entrance QR.');
        }
      },
      (err) => { /* ignore normal scan errors */ }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const handleLocationCapture = (scannedQrData) => {
    setStep('locating');
    setLocating(true);

    if (!navigator.geolocation) {
      setStep('error');
      setError({ code: 'NO_GPS', message: 'GPS is not supported on this device.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const memberLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        submitCheckIn(scannedQrData, memberLocation);
      },
      (geoErr) => {
        setLocating(false);
        setStep('error');
        setError({
          code: 'LOCATION_DENIED',
          message: geoErr.code === 1
            ? 'Location permission denied. Please allow GPS access and try again.'
            : 'Could not get your location. Please try again.'
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const submitCheckIn = async (scannedQrData, memberLocation) => {
    try {
      const { data } = await api.post('/member/check-in', {
        qrData: scannedQrData,
        memberLocation,
        timestamp: new Date().toISOString()
      });
      setLocating(false);
      setResult(data.data);
      setStep('success');
    } catch (err) {
      setLocating(false);
      const errData = err.response?.data?.error;
      setError(errData || { code: 'UNKNOWN', message: err.response?.data?.message || 'Check-in failed. Please try again.' });
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('scanner');
    setError(null);
    setResult(null);
    setQrData(null);
    // Re-mount scanner
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.render(() => {}, () => {}).catch(() => {});
      }
    }, 100);
  };

  const fmt = (dt) => new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <button onClick={() => navigate('/member/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-4xl font-display uppercase">Check <span className="text-lime-500">In</span></h1>
          </div>
        </div>

        {/* STEP: Scanner */}
        {step === 'scanner' && (
          <div>
            <div className="glass-card text-center mb-4">
              <p className="text-gray-400 text-sm mb-4">Point your camera at the gym entrance QR code</p>
              <div
                ref={containerRef}
                id="qr-scanner-container"
                className="rounded-2xl overflow-hidden"
              />
            </div>
            <div className="bg-dark-800/50 border border-dark-600 rounded-2xl p-4 text-center">
              <p className="text-gray-500 text-xs">📍 GPS will be auto-captured after scanning</p>
            </div>
          </div>
        )}

        {/* STEP: Locating */}
        {step === 'locating' && (
          <div className="glass-card text-center py-16">
            <div className="w-20 h-20 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FaCheckCircle className="text-lime-500 text-3xl" />
            </div>
            <h3 className="text-2xl font-display uppercase mb-3">QR Scanned!</h3>
            <p className="text-gray-400 mb-2">Capturing your GPS location...</p>
            <p className="text-gray-600 text-xs">This verifies you're at the gym</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* STEP: Success */}
        {step === 'success' && result && (
          <div className="glass-card text-center border-lime-500/30">
            <div className="w-20 h-20 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-lime-500 text-4xl" />
            </div>
            <h3 className="text-3xl font-display uppercase text-lime-400 mb-2">Checked In!</h3>
            <p className="text-gray-400 mb-1">Welcome to FITTEX! 💪</p>
            <p className="text-gray-500 text-sm mb-8">Time: {fmt(result.checkInTime)}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-dark-700 rounded-2xl p-4">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <FaFire /> <span className="text-xs font-black uppercase">Streak</span>
                </div>
                <p className="text-4xl font-display text-white">{result.currentStreak}</p>
                <p className="text-gray-500 text-xs">days</p>
              </div>
              <div className="bg-dark-700 rounded-2xl p-4">
                <div className="flex items-center justify-center gap-2 text-lime-400 mb-2">
                  <FaCheckCircle /> <span className="text-xs font-black uppercase">Total</span>
                </div>
                <p className="text-4xl font-display text-white">{result.totalAttendance}</p>
                <p className="text-gray-500 text-xs">sessions</p>
              </div>
            </div>

            <button onClick={() => navigate('/member/dashboard')} className="btn-primary w-full !py-4">
              Back to Dashboard
            </button>
          </div>
        )}

        {/* STEP: Error */}
        {step === 'error' && error && (
          <div className="glass-card text-center">
            {/* Error icon based on code */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              error.code === 'DUPLICATE_CHECKIN' ? 'bg-blue-500/20' : 'bg-red-500/20'
            }`}>
              {error.code === 'DUPLICATE_CHECKIN'
                ? <FaInfoCircle className="text-blue-400 text-4xl" />
                : error.code === 'OUTSIDE_GYM_HOURS'
                  ? <FaExclamationCircle className="text-yellow-400 text-4xl" />
                  : <FaTimesCircle className="text-red-400 text-4xl" />
              }
            </div>

            <h3 className={`text-2xl font-display uppercase mb-3 ${
              error.code === 'DUPLICATE_CHECKIN' ? 'text-blue-400' :
              error.code === 'OUTSIDE_GYM_HOURS' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {error.code === 'DUPLICATE_CHECKIN' ? 'Already Checked In'
                : error.code === 'LOCATION_TOO_FAR' ? 'Too Far from Gym'
                : error.code === 'OUTSIDE_GYM_HOURS' ? 'Gym is Closed'
                : error.code === 'MEMBERSHIP_EXPIRED' ? 'Membership Expired'
                : 'Check-in Failed'}
            </h3>

            <p className="text-gray-400 mb-4">{error.message}</p>

            {/* Distance info */}
            {error.code === 'LOCATION_TOO_FAR' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-sm">
                <p className="text-red-400">Distance: <strong>{error.distance}m</strong></p>
                <p className="text-gray-500">Required: within {error.maxDistance}m</p>
                <p className="text-gray-600 mt-2 text-xs">Please move closer to the gym entrance and try again.</p>
              </div>
            )}

            {/* Already checked in streak info */}
            {error.code === 'DUPLICATE_CHECKIN' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <FaFire /> <span className="font-black">Streak: {error.currentStreak} days</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {error.code !== 'MEMBERSHIP_EXPIRED' && error.code !== 'MEMBERSHIP_INACTIVE' ? (
                error.code === 'DUPLICATE_CHECKIN' ? (
                  <button onClick={() => navigate('/member/dashboard')} className="flex-1 btn-primary !py-3">
                    Back to Dashboard
                  </button>
                ) : (
                  <>
                    <button onClick={() => navigate('/member/dashboard')} className="flex-1 bg-dark-700 border border-dark-600 text-gray-300 font-bold uppercase py-3 rounded-2xl text-sm transition-all">
                      Dashboard
                    </button>
                    <button onClick={handleRetry} className="flex-1 btn-primary !py-3">
                      Try Again
                    </button>
                  </>
                )
              ) : (
                <button onClick={() => navigate('/member/dashboard')} className="flex-1 btn-primary !py-3">
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCheckIn;
