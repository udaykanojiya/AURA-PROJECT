import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="pt-24 pb-20">
      <section className="section-padding container mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2 space-y-12">
            <div>
              <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">Get In Touch</span>
              <h1 className="text-7xl font-display uppercase italic text-gradient">Contact <span className="text-white">Us</span></h1>
              <p className="text-gray-400 mt-6 text-lg leading-relaxed">Have questions? We're here to help you start your journey. Drop us a message or visit us in Mumbai.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-dark-800 rounded-2xl flex items-center justify-center text-lime-500 border border-white/5">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Our Location</h4>
                  <p className="text-gray-500 text-sm">123 Fitness Street, Andheri West, Mumbai, MH</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-dark-800 rounded-2xl flex items-center justify-center text-lime-500 border border-white/5">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Call Anywhere</h4>
                  <p className="text-gray-500 text-sm">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-dark-800 rounded-2xl flex items-center justify-center text-lime-500 border border-white/5">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase mb-1">Email Support</h4>
                  <p className="text-gray-500 text-sm">info@fittexgym.com</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-2xl transition-all">
                  <FaWhatsapp className="text-xl" /> WhatsApp Now
               </button>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-dark-800 p-10 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative shadow-glow-sm">
               <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                        <input type="text" className="w-full bg-dark-900 border border-white/5 rounded-2xl p-4 focus:border-lime-500 transition-all outline-none" placeholder="John Doe" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone</label>
                        <input type="text" className="w-full bg-dark-900 border border-white/5 rounded-2xl p-4 focus:border-lime-500 transition-all outline-none" placeholder="+91" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message</label>
                     <textarea rows="4" className="w-full bg-dark-900 border border-white/5 rounded-2xl p-4 focus:border-lime-500 transition-all outline-none" placeholder="How can we help?"></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full !py-5">Send Message</button>
               </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
