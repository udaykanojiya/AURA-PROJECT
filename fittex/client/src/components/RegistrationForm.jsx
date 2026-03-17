import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bmi: '',
    fitnessGoal: '',
    experienceLevel: '',
    planId: '',
    paymentScreenshot: ''
  });

  const [screenshotPreview, setScreenshotPreview] = useState('');

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
    fetchPaymentDetails();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/plans`);
      setPlans(response.data.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/payment-details`);
      setPaymentDetails(response.data.data);
    } catch (err) {
      console.error('Error fetching payment details:', err);
    }
  };

  // Calculate BMI when height/weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Convert image to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, paymentScreenshot: base64String }));
      setScreenshotPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!formData.paymentScreenshot) {
        setError('Please upload payment screenshot');
        setLoading(false);
        return;
      }

      // Submit registration
      const response = await axios.post(`${API_URL}/public/register`, formData);

      setMessage(response.data.message);
      setStep(5); // Success page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const selectedPlan = plans.find(p => p._id === formData.planId);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-400 text-center mb-8">
          FITTEX REGISTRATION
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-1/4 h-2 mx-1 rounded ${
                  step >= num ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-center text-sm">
            Step {step} of 4
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Physical Stats */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Physical Stats</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="170"
                    className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  />
                </div>
              </div>

              {formData.bmi && (
                <div className="mb-6 p-4 bg-green-900 bg-opacity-30 rounded">
                  <p className="text-green-400 text-center text-lg">
                    Your BMI: <strong className="text-2xl">{formData.bmi}</strong>
                  </p>
                  <p className="text-gray-300 text-center text-sm mt-2">
                    {formData.bmi < 18.5 && 'Underweight'}
                    {formData.bmi >= 18.5 && formData.bmi < 25 && 'Normal'}
                    {formData.bmi >= 25 && formData.bmi < 30 && 'Overweight'}
                    {formData.bmi >= 30 && 'Obese'}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Fitness Goal *</label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="athletic">Athletic Performance</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-1/2 bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Plan */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Select Membership Plan</h2>

              <div className="space-y-4 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    onClick={() => setFormData({ ...formData, planId: plan._id })}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      formData.planId === plan._id
                        ? 'bg-green-400 text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{plan.planName}</h3>
                      <span className="text-2xl font-bold">₹{plan.price}</span>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{plan.duration} days</p>
                    <ul className="text-sm space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.planId}
                  className="w-1/2 bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && paymentDetails && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Payment</h2>

              {selectedPlan && (
                <div className="mb-6 p-4 bg-gray-700 rounded">
                  <p className="text-gray-300">Selected Plan:</p>
                  <p className="text-white text-xl font-bold">{selectedPlan.planName}</p>
                  <p className="text-green-400 text-2xl font-bold">₹{selectedPlan.price}</p>
                </div>
              )}

              <div className="mb-6 p-6 bg-gray-700 rounded">
                <h3 className="text-white font-bold mb-4 text-center">Pay Using UPI</h3>
                
                <div className="text-center mb-4">
                  {paymentDetails.upiQRCode && paymentDetails.upiQRCode.startsWith('data:image') ? (
                    <img
                      src={paymentDetails.upiQRCode}
                      alt="UPI QR Code"
                      className="w-48 h-48 mx-auto bg-white p-2 rounded"
                    />
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-gray-600 flex items-center justify-center rounded">
                      <p className="text-gray-400 text-sm">QR Code Placeholder</p>
                    </div>
                  )}
                  <p className="text-green-400 mt-2 font-mono">{paymentDetails.upiId}</p>
                </div>

                <div className="border-t border-gray-600 pt-4 mt-4">
                  <h3 className="text-white font-bold mb-2 text-center">OR Bank Transfer</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p><strong>Account:</strong> {paymentDetails.bankAccount}</p>
                    <p><strong>IFSC:</strong> {paymentDetails.bankIFSC}</p>
                    <p><strong>Bank:</strong> {paymentDetails.bankName}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Upload Payment Screenshot *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 text-white rounded focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
                
                {screenshotPreview && (
                  <div className="mt-4">
                    <p className="text-green-400 text-sm mb-2">✓ Screenshot uploaded</p>
                    <img 
                      src={screenshotPreview} 
                      alt="Payment Screenshot" 
                      className="max-w-full h-auto rounded border-2 border-green-400"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-700 transition"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.paymentScreenshot}
                  className="w-1/2 bg-green-400 text-black font-bold py-3 rounded hover:bg-green-500 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold text-white mb-4">Registration Submitted!</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <p className="text-gray-400 text-sm">
                You will receive a confirmation email/SMS within 24 hours after verification.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
