import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Trainers = () => {
  const trainers = [
    { name: 'Marcus Steel', role: 'Head Weightlifter', img: '/assets/trainer1.png' },
    { name: 'Serena Storm', role: 'HIIT Specialist', img: '/assets/trainer2.png' },
    { name: 'Vikram Power', role: 'Strength Coach', img: 'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?auto=format&fit=crop&q=80&w=800' },
    { name: 'Elena Grace', role: 'Yoga Master', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="section-padding text-center">
        <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">The Elite Team</span>
        <h1 className="text-7xl md:text-9xl font-display uppercase italic">Expert <span className="text-lime-500">Trainers</span></h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto mt-8 mb-20 text-lg">Our trainers aren't just experts; they're champions. With decades of combined experience, they are here to ensure you reach your peak performance.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 container mx-auto">
          {trainers.map((t, i) => (
            <div key={i} className="group relative">
               <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <img src={t.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={t.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Social Overlay */}
                  <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4 transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                     <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-dark-900 cursor-pointer hover:bg-white transition-colors"><FaInstagram /></div>
                     <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-dark-900 cursor-pointer hover:bg-white transition-colors"><FaTwitter /></div>
                     <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-dark-900 cursor-pointer hover:bg-white transition-colors"><FaLinkedin /></div>
                  </div>
               </div>
               <div className="mt-6">
                  <h3 className="text-2xl font-display uppercase tracking-wider">{t.name}</h3>
                  <p className="text-lime-500 text-xs font-black uppercase tracking-[0.2em] mt-2">{t.role}</p>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Trainers;
