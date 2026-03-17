import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-lime-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-dark-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,18a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V11H20ZM12,2a1,1,0,0,1,1,1V4h2V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6a1,1,0,0,1-1,1H18V6H15V7h2v1H7V7H9V6H6V7H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H7A1,1,0,0,1,8,3V4h2V3A1,1,0,0,1,11,2ZM3,11v7H2V11ZM22,11v7H21V11Z" />
                </svg>
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">Fittex<span className="text-lime-500">Gym</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sculpt your body, elevate your spirit. Experience the best fitness services with premium equipment and elite trainers.
            </p>
            <div className="flex gap-4">
              {['fb', 'ig', 'tw', 'yt'].map((social) => (
                <div key={social} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:bg-lime-500 hover:text-dark-900 transition-all cursor-pointer">
                  <span className="uppercase text-xs font-bold">{social}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-4 border-lime-500 pl-3">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-lime-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-lime-500 transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-lime-500 transition-colors">Our Programs</Link></li>
              <li><Link to="/trainers" className="hover:text-lime-500 transition-colors">Elite Trainers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-4 border-lime-500 pl-3">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/login" className="hover:text-lime-500 transition-colors">Member Login</Link></li>
              <li><Link to="/register" className="hover:text-lime-500 transition-colors">Enquiry</Link></li>
              <li><Link to="/terms" className="hover:text-lime-500 transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-lime-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-4 border-lime-500 pl-3">Contact Us</h4>
            <div className="space-y-4 text-gray-400 text-sm">
              <p>📍 123 Fitness Street, Andheri West, Mumbai</p>
              <p>📞 +91 98765 43210</p>
              <p>📧 info@fittexgym.com</p>
              <p>⏰ Mon - Sat: 5 AM - 10 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 text-center">
          <p>© 2024 FITTEX GYM. All Rights Reserved.</p>
          <p className="font-medium">Designed for Champions 💪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
