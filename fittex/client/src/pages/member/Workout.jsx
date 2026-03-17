import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaDumbbell } from 'react-icons/fa';
import { getMemberWorkoutPlan } from '../../services/api';

const MemberWorkout = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMemberWorkoutPlan()
      .then(({ data }) => setPlan(data))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else toast.error('Failed to load workout plan');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="text-lime-500 animate-pulse text-xl font-display uppercase">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/member/dashboard')} className="w-10 h-10 rounded-full border border-dark-600 flex items-center justify-center hover:border-lime-500 transition-all">
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-lime-500 text-xs font-bold uppercase tracking-widest mb-1">Member Portal</p>
            <h1 className="text-4xl font-display uppercase">Workout <span className="text-lime-500">Plan</span></h1>
          </div>
        </div>

        {!plan ? (
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 bg-lime-500/10 rounded-3xl flex items-center justify-center text-lime-500 mx-auto mb-6 text-2xl">
              <FaDumbbell />
            </div>
            <h3 className="font-display uppercase text-2xl mb-3">No Plan Assigned</h3>
            <p className="text-gray-500">Your trainer will assign a personalized workout plan soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan header */}
            <div className="glass-card">
              <h2 className="text-2xl font-display uppercase mb-2">{plan.planName}</h2>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="flex gap-3">
                {plan.targetLevel && <span className="bg-lime-500/20 text-lime-400 px-3 py-1 rounded-full text-xs font-black uppercase border border-lime-500/20">{plan.targetLevel}</span>}
                {plan.targetGoal && <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase border border-blue-500/20">{plan.targetGoal?.replace(/_/g, ' ')}</span>}
              </div>
            </div>

            {/* Schedule */}
            {plan.schedule?.map((day) => (
              <div key={day.day} className="glass-card">
                <h3 className="font-display uppercase text-xl mb-6 pb-4 border-b border-dark-600">
                  Day {day.day}: <span className="text-lime-500">{day.dayName}</span>
                </h3>
                <div className="space-y-3">
                  {day.exercises?.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-dark-700/50 rounded-2xl px-5 py-4">
                      <div>
                        <p className="font-bold text-white">{ex.name}</p>
                        {ex.rest && <p className="text-gray-500 text-xs mt-1">Rest: {ex.rest}s</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lime-400 font-black">{ex.sets} × {ex.reps}</p>
                        <p className="text-gray-500 text-xs">sets × reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberWorkout;
