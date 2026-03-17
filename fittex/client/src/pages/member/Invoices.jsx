import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa';
import { getMemberInvoices } from '../../services/api';

const MemberInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMemberInvoices()
      .then(({ data }) => setInvoices(data || []))
      .catch(err => {
        if (err.response?.status === 401) navigate('/login');
        else toast.error('Failed to load invoices');
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
            <h1 className="text-4xl font-display uppercase">My <span className="text-lime-500">Invoices</span></h1>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 bg-lime-500/10 rounded-3xl flex items-center justify-center text-lime-500 mx-auto mb-6 text-2xl">
              <FaFileInvoiceDollar />
            </div>
            <h3 className="font-display uppercase text-2xl mb-3">No Invoices Yet</h3>
            <p className="text-gray-500">Your payment invoices will appear here after approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv._id} className="glass-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-lime-400 font-bold text-sm">{inv.invoiceNumber}</p>
                    <p className="text-white font-bold text-lg mt-1">{inv.planName}</p>
                    <p className="text-gray-500 text-sm">{inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display text-white">₹{inv.amount?.toLocaleString('en-IN')}</p>
                    {inv.verified && (
                      <div className="flex items-center gap-1 justify-end mt-1 text-lime-400 text-xs font-black uppercase">
                        <FaCheckCircle /> Verified
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-lime-500/10 text-lime-400 border border-lime-500/20 px-3 py-1 rounded-full font-bold uppercase">
                    UPI/Bank Transfer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberInvoices;
