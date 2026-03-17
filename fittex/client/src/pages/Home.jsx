import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaUsers, FaMedal, FaPlay, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const Home = () => {
  const [plans, setPlans] = useState([
    { _id: '1', planName: 'Basic Plan', duration: 30, price: 1500, features: ['Gym Access', 'Standard Equipment', 'Locker Room'] },
    { _id: '2', planName: 'Standard Plan', duration: 90, price: 4000, features: ['Gym Access', 'Elite Equipment', '1 Personal Session', 'Diet Plan'] },
    { _id: '3', planName: 'Premium Plan', duration: 180, price: 7500, features: ['24/7 Access', 'All Equipment', 'Unlimited Personal Training', 'Steam & Sauna'] }
  ]);
  const [stats, setStats] = useState({
    activeMembers: '500+',
    equipmentCount: '50+',
    trainersCount: '10+',
    yearsExperience: '10+'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansRes = await api.get('/public/plans');
        if (plansRes.data.success && plansRes.data.data.length > 0) setPlans(plansRes.data.data);
        
        const statsRes = await api.get('/public/stats');
        if (statsRes.data.success) setStats(statsRes.data.data);
      } catch (err) {
        console.log('Error fetching home data, using fallbacks');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10"></div>
          <img 
            src="/assets/hero.png" 
            alt="Gym" 
            className="w-full h-full object-cover grayscale opacity-40"
          />
          {/* Lime Glows */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-lime-500/10 blur-[150px] rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">The Power of Fitness</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bebas uppercase leading-tight mb-8 animate-slide-up">
              Sculpt <span className="text-lime-500 text-gradient">Your</span> Body,<br />
              Elevate Your <span className="text-lime-500">Spirit</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in delay-200">
              Break your limits and transform your life with the most advanced fitness training in Mumbai. State-of-the-art equipment and elite trainers waiting for you.
            </p>

            <div className="flex flex-wrap gap-6 animate-fade-in delay-300">
              <Link to="/register" className="btn-primary flex items-center gap-3 group">
                Join Today <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-lime-500 group-hover:border-lime-500 transition-all duration-500">
                  <FaPlay className="text-white group-hover:text-dark-900 translate-x-0.5" />
                </div>
                <span className="font-bold uppercase tracking-widest text-sm">Watch Video</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl border-t border-white/10 pt-10 animate-fade-in delay-500">
              <div>
                <h3 className="text-4xl text-white mb-2">{stats.activeMembers}</h3>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Active Members</p>
              </div>
              <div>
                <h3 className="text-4xl text-white mb-2">{stats.equipmentCount}</h3>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Equipments</p>
              </div>
              <div>
                <h3 className="text-4xl text-white mb-2">{stats.trainersCount}</h3>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Expert Trainers</p>
              </div>
              <div>
                <h3 className="text-4xl text-white mb-2">{stats.yearsExperience}</h3>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-dark-900 section-padding relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="max-w-xl">
              <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">Our Services</span>
              <h2 className="text-5xl md:text-7xl uppercase leading-tight">Experience Reliable Fitness <span className="text-lime-500">Services</span></h2>
            </div>
            <div className="flex gap-4">
              <Link to="/programs" className="btn-primary !py-2 !px-6 text-sm uppercase">More Services</Link>
              <Link to="/contact" className="btn-outline !py-2 !px-6 text-sm uppercase">Contact Us</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Personal Training', icon: <FaDumbbell />, img: '/assets/personal_training.png' },
              { title: 'Functional Fitness', icon: <FaUsers />, img: '/assets/functional.png' },
              { title: 'Weight Loss Coaching', icon: <FaMedal />, img: '/assets/weight_loss.png' }
            ].map((service, idx) => (
              <div key={idx} className="group relative h-[450px] overflow-hidden rounded-3xl cursor-pointer">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-lime-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-dark-900 text-xl font-bold">
                    {service.icon}
                  </div>
                  <h3 className="text-3xl uppercase mb-2 group-hover:text-lime-500 transition-colors">{service.title}</h3>
                  <p className="text-gray-400 text-sm overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
                    Professional training tailored to your goals. Join our elite program.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-dark-800/50 section-padding relative overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-dark-900 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" alt="About" className="w-full h-full object-cover" />
            </div>
            {/* Overlapping Badge */}
            <div className="absolute -bottom-10 -right-10 z-20 bg-lime-500 p-10 rounded-[2.5rem] shadow-2xl animate-bounce-slow">
              <span className="text-7xl font-display text-dark-900 leading-none">25+</span>
              <p className="text-dark-900 font-bold uppercase tracking-widest text-[10px] mt-2">Years of Fitness Experience</p>
            </div>
            {/* Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-lime-500/10 rounded-full"></div>
          </div>

          <div className="lg:w-1/2">
            <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">About Company</span>
            <h2 className="text-5xl md:text-7xl uppercase leading-tight mb-8">Dedicated to Igniting Your <span className="text-lime-500">Fitness Health</span></h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              FITTEX GYM is more than just a training space. Founded with a vision to revolutionize the fitness industry in Mumbai, we provide an ecosystem where athletes are made. Our holistic approach combines elite equipment, expert guidance, and a relentless community.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {['Modern Facilities', 'Expert Team', 'Diverse Offering', 'Fitness Focus'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="bg-dark-700 p-2 rounded-lg border border-dark-600 group-hover:border-lime-500/50 transition-all">
                    <FaCheckCircle className="text-lime-500" />
                  </div>
                  <span className="text-white font-bold uppercase tracking-widest text-sm">{item}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-primary inline-block">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="programs" className="section-padding bg-dark-900">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-20 text-center">
            <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">Choose Our Pricing</span>
            <h2 className="text-5xl md:text-7xl uppercase">Subscription <span className="text-lime-500">Plans</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((plan, idx) => (
              <div key={idx} className={`glass-card !bg-dark-800 flex flex-col p-0 overflow-hidden relative ${idx === 1 ? 'border-lime-500/50 scale-105 z-10' : ''}`}>
                {idx === 1 && (
                  <div className="bg-lime-500 text-dark-900 text-[10px] font-black uppercase tracking-[0.2em] py-1 absolute top-6 right-[-35px] w-32 rotate-45">Popular</div>
                )}
                <div className="p-10 border-b border-white/5 text-left">
                  <h4 className="text-white text-2xl mb-4">{plan.planName}</h4>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-display text-lime-500 italic">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 uppercase text-xs">/ {plan.duration} days</span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <ul className="space-y-6 text-left mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-gray-400">
                        <FaCheckCircle className="text-lime-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${idx === 1 ? 'bg-lime-500 text-dark-900 shadow-xl' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                    Choose Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Section Preview */}
      <section id="trainers" className="section-padding bg-dark-800">
        <div className="container mx-auto text-center">
          <span className="text-lime-500 font-bold uppercase tracking-widest text-sm mb-4 block">Meet Our Experts</span>
          <h2 className="text-5xl md:text-7xl uppercase mb-16">The Elite <span className="text-lime-500">Squad</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Marcus Steel', role: 'Head Weightlifter', img: '/assets/trainer1.png' },
              { name: 'Serena Storm', role: 'HIIT Specialist', img: '/assets/trainer2.png' },
              { name: 'Vikram Power', role: 'Strength Coach', img: 'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?auto=format&fit=crop&q=80&w=400' },
              { name: 'Elena Grace', role: 'Yoga Master', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400' },
            ].map((t, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-3xl aspect-[3/4]">
                <img src={t.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={t.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-left">
                  <h4 className="text-xl font-bold uppercase">{t.name}</h4>
                  <p className="text-lime-500 text-[10px] uppercase font-black tracking-widest">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/trainers" className="btn-outline !px-10">View All Trainers</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[4rem] bg-lime-500 p-12 md:p-20 overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-dark-900 flex items-center justify-center p-12 clip-path-slant">
              <FaDumbbell className="text-lime-500 text-9xl -rotate-45 opacity-20 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 lg:w-2/3">
              <h2 className="text-4xl md:text-6xl text-dark-900 uppercase font-black tracking-tight mb-8">Ready to Unleash Your <br /><span className="underline decoration-dark-900 underline-offset-8">Inner Beast?</span></h2>
              <div className="flex flex-wrap gap-6">
                <Link to="/register" className="bg-dark-900 text-white font-black uppercase tracking-[0.2em] px-10 py-5 rounded-2xl hover:scale-105 transition-transform flex items-center gap-4">
                  Get Started Now <FaArrowRight />
                </Link>
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-14 h-14 rounded-full border-4 border-lime-500 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-14 h-14 rounded-full bg-dark-900 border-4 border-lime-500 flex items-center justify-center text-xs font-bold text-white tracking-tighter">
                    +10K
                  </div>
                </div>
              </div>
            </div>
            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 h-full opacity-30">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="border-r border-dark-900 h-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
