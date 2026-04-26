import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authstores';
import { LANGUAGES } from '../../config/constant';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';
import {
    EnvelopeIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login = () => {
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, googleLogin } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@') || !email.includes('.')) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                toast.success('Login successful!');
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } else {
                toast.error(result.error || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const result = await googleLogin();
            if (result.success) {
                toast.success('Login successful!');
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } else {
                toast.error(result.error || 'Google login failed.');
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('An unexpected error occurred with Google login.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20"
                        >
                            <ShieldCheckIcon className="w-12 h-12 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">NEEPO</h1>
                        <p className="text-gray-400 text-sm mt-1">Women Safety & Justice Portal</p>
                        <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Language Selector */}
                    <div className="mb-6">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:outline-none text-sm transition-all"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code} className="bg-slate-800">{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                                placeholder="name@example.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-600/20 transition-all border-none"
                            loading={loading}
                        >
                            Login to Portal
                        </Button>
                    </form>

                    <div className="my-8 flex items-center justify-center space-x-4">
                        <div className="h-px flex-1 bg-white/10"></div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">or sign in with</span>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    {/* Demo Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center mt-8 text-sm text-gray-400">
                        New to NEEPO?{' '}
                        <Link to="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
