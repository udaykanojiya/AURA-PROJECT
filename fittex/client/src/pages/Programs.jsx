import React from 'react';
import { FaBolt, FaDumbbell, FaFire, FaMusic } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Programs = () => {
  const categories = [
    { title: 'Body Building', icon: <FaDumbbell />, desc: 'High-intensity strength training for maximum hypertrophy.', bg: '/assets/trainer1.png' },
    { title: 'Cardio Blaze', icon: <FaBolt />, desc: 'Endurance focused HIIT and treadmill sessions to melt fat.', bg: '/assets/functional.png' },
    { title: 'Weight Loss', icon: <FaFire />, desc: 'Expert guidance to reach your target weight and maintain it.', bg: '/assets/weight_loss.png' },
    { title: 'Personal Training', icon: <FaMusic />, desc: 'One-on-one sessions tailored to your specific fitness needs.', bg: '/assets/personal_training.png' }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="section-padding text-center">
        <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">World-Class Facilities</span>
        <h1 className="text-7xl md:text-9xl font-display uppercase italic">Our <span className="text-lime-500">Programs</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 container mx-auto">
          {categories.map((cat, i) => (
            <div key={i} className="group relative h-[500px] overflow-hidden rounded-[2.5rem] bg-dark-800 border border-white/5">
              <img src={cat.bg} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt={cat.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full text-left">
                <div className="w-12 h-12 bg-lime-500 rounded-xl flex items-center justify-center text-dark-900 text-2xl mb-6 shadow-glow">
                  {cat.icon}
                </div>
                <h3 className="text-3xl font-display uppercase mb-4 group-hover:text-lime-500 transition-colors">{cat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">{cat.desc}</p>
                <Link to="/register" className="inline-block text-xs font-black uppercase tracking-widest text-lime-500 border-b-2 border-lime-500 pb-1">Join Program</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-dark-800 max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden text-left">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-5xl font-display uppercase leading-tight mb-4 text-gradient">Custom Workout Plans <br /> For Your DNA</h2>
                 <p className="text-gray-400">Our AI-driven analysis takes your height, weight, and goals to generate the perfect routine.</p>
              </div>
              <Link to="/register" className="btn-primary !px-12 !py-5 text-lg">Calculate BMI</Link>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 blur-[100px]"></div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
