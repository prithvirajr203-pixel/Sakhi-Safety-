import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { LANGUAGES } from '../../config/constant';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);

    try {
      const result = await register({ email, password, name });

      if (result.success) {
        toast.success('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">NEEPO</h1>
            <p className="text-gray-400 text-sm mt-1">Join the Safety Revolution</p>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-gray-300 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">{lang.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                placeholder="Jane Doe"
                className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                placeholder="name@example.com"
                className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                required
              />
            </div>

            <div className="md:col-span-2 flex items-start gap-2 py-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 bg-white/5 border-white/20 rounded focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-normal">
                I agree to the <Link to="/terms" className="text-purple-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button
              type="submit"
              className="md:col-span-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-600/20 transition-all border-none"
              loading={loading}
            >
              Create Portal Account
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Login to Portal
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
