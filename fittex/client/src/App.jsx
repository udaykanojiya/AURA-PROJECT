import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import api from './services/api';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Trainers from './pages/Trainers';
import Contact from './pages/Contact';

// Auth Components
import OTPLogin from './pages/OTPLogin';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminRegistrations from './pages/admin/Registrations';
import AdminMembers from './pages/admin/Members';
import AdminSettings from './pages/admin/Settings';
import AdminGymQR from './pages/admin/GymQR';
import AdminLiveAttendance from './pages/admin/LiveAttendance';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import MemberAttendance from './pages/member/Attendance';
import MemberWorkout from './pages/member/Workout';
import MemberInvoices from './pages/member/Invoices';
import MemberQRCode from './pages/member/QRCode';
import MemberCheckIn from './pages/member/CheckIn';

// Helper to detect admin routes
const AdminRouteWrapper = ({ children, user, setUser }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  
  if (isAdmin) {
    return <div className="min-h-screen bg-dark-900 text-white font-sans">{children}</div>;
  }
  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-white font-sans selection:bg-lime-500 selection:text-dark-900">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isMember = location.pathname.startsWith('/member');
  const isPortal = isAdmin || isMember; // admin or member portal = no Navbar/Footer

  useEffect(() => {
    const checkAuthStatus = async () => {
      // If we have a token, we should specify it or let the interceptor handle it
      // The interceptor in api.js already adds it from localStorage
      try {
        const { data } = await api.get('/auth/status');
        setUser(data);
      } catch (err) {
        // If status check fails, clear token if it was invalid
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
        }
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-dark-900 text-white font-sans ${!isPortal ? 'selection:bg-lime-500 selection:text-dark-900' : ''}`}>
      {!isPortal && <Navbar user={user} setUser={setUser} />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<OTPLogin setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-secret-panel" element={<AdminLogin setUser={setUser} />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard setUser={setUser} />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/gym-qr-code" element={<AdminGymQR />} />
          <Route path="/admin/live-attendance" element={<AdminLiveAttendance />} />

          {/* Member Routes */}
          <Route path="/member/dashboard" element={<MemberDashboard setUser={setUser} />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/attendance" element={<MemberAttendance />} />
          <Route path="/member/workout" element={<MemberWorkout />} />
          <Route path="/member/invoices" element={<MemberInvoices />} />
          <Route path="/member/qr" element={<MemberQRCode />} />
          <Route path="/member/check-in" element={<MemberCheckIn />} />
        </Routes>
      </main>
      {!isPortal && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
