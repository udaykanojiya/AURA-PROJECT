import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const Navbar = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      if (setUser) setUser(null);
      setMobileMenu(false);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/90 backdrop-blur-lg py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={() => setMobileMenu(false)} className="flex items-center gap-2 group">
          <div className="bg-lime-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20,18a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V11H20ZM12,2a1,1,0,0,1,1,1V4h2V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6a1,1,0,0,1-1,1H18V6H15V7h2v1H7V7H9V6H6V7H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H7A1,1,0,0,1,8,3V4h2V3A1,1,0,0,1,11,2ZM3,11v7H2V11ZM22,11v7H21V11Z" />
            </svg>
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">Fittex<span className="text-lime-500">Gym</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-base font-semibold uppercase tracking-wider hover:text-lime-400 transition-colors ${isActive(link.path) ? 'text-lime-500' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} className="flex items-center gap-2 bg-dark-700 px-4 py-2 rounded-full border border-dark-600 hover:border-lime-500 transition-all">
                <FaUser className="text-lime-500" />
                <span className="text-base font-bold uppercase">{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm uppercase font-black text-gray-500 hover:text-red-500 transition-colors">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-base font-bold uppercase hover:text-lime-500 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary flex items-center gap-2 text-sm !px-6 !py-2">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden text-white text-2xl relative z-50">
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-dark-900 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${mobileMenu ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'} lg:hidden`}>
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            onClick={() => setMobileMenu(false)}
            className="text-3xl font-display uppercase tracking-widest text-white hover:text-lime-500"
          >
            {link.name}
          </Link>
        ))}
        {user ? (
          <div className="flex flex-col gap-4 mt-4 w-64 items-center">
            <Link onClick={() => setMobileMenu(false)} to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} className="btn-primary w-full text-center italic">Go to {user.role === 'admin' ? 'Admin' : 'Member'} Panel</Link>
            <button onClick={handleLogout} className="text-gray-500 uppercase font-black text-xs tracking-[0.2em]">Sign Out</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4 w-64">
            <Link onClick={() => setMobileMenu(false)} to="/login" className="btn-outline text-center">Login</Link>
            <Link onClick={() => setMobileMenu(false)} to="/register" className="btn-primary text-center">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
