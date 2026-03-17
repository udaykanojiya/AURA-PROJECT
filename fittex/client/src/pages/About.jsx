import React from 'react';
import { FaHeartbeat, FaBullseye, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-dark-900/60 z-10"></div>
        <img 
          src="/assets/hero.png" 
          className="absolute inset-0 w-full h-full object-cover grayscale"
          alt="About Us"
        />
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-6xl md:text-8xl font-display uppercase italic">Our <span className="text-lime-500">Story</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto mt-4 uppercase tracking-widest text-sm font-bold">More than just a gym. A legacy of fitness excellence.</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-lime-500 font-bold uppercase tracking-widest text-sm">The Fittex Vision</span>
            <h2 className="text-5xl uppercase leading-tight font-display">Igniting the <span className="italic text-lime-500">Beast</span> Within Since 2001</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Started as a small warehouse gym in Mumbai, FITTEX has grown into a premium fitness sanctuary. Our philosophy is simple: **Zero Excuses, Infinite Results.** 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-4">
                <FaHeartbeat className="text-4xl text-lime-500" />
                <h4 className="text-xl font-bold uppercase">Health First</h4>
                <p className="text-sm text-gray-500">We don't just build muscle; we build long-term cardiovascular health and mental resilience.</p>
              </div>
              <div className="space-y-4">
                <FaBullseye className="text-4xl text-lime-500" />
                <h4 className="text-xl font-bold uppercase">Goal Driven</h4>
                <p className="text-sm text-gray-500">Every member has a personalized path. We track every rep and every drop of energy.</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-[3rem] overflow-hidden border-4 border-dark-600 shadow-2xl">
               <img src="/assets/personal_training.png" className="w-full h-full object-cover" alt="Focus" />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-lime-500 p-8 rounded-3xl shadow-glow">
                <FaHistory className="text-dark-900 text-4xl mb-4" />
                <h5 className="text-dark-900 font-black text-2xl">23 YEARS</h5>
                <p className="text-dark-900/70 text-xs font-bold uppercase">Of Transformations</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-dark-800 py-32 rounded-[4rem] relative overflow-hidden mx-6">
         <div className="container mx-auto text-center relative z-10">
            <h2 className="text-6xl md:text-8xl font-display uppercase italic mb-10">Join the <span className="text-lime-500 underline decoration-white underline-offset-8">Movement</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">We are not just a gym. We are a community of warriors. Are you ready to take the first step towards a legend?</p>
            <div className="flex flex-wrap justify-center gap-6">
               <Link to="/register" className="btn-primary !px-12 !py-5">Get Membership</Link>
               <Link to="/contact" className="btn-outline !px-12 !py-5">Visit Us First</Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
