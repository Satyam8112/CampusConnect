import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Calendar, Sparkles, Eye, EyeOff } from 'lucide-react';
import { setAuthSession } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await axios.post('/api/auth/login', {
        email: email.trim(),
        password
      });

      if (res.data && res.data.status === 'success') {
        setAuthSession(res.data.token, res.data.user, rememberMe);
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      setErrors({
        submit: error.response?.data?.message || 'Unable to connect to the server. Please check your credentials.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/10 mb-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your account to manage events and connect</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Login Successful!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Welcome back to CampusConnect. Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      if (errors.submit) setErrors((prev) => ({ ...prev, submit: '' }));
                    }}
                    placeholder="you@university.edu"
                    className={`block w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.email
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800/80 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      if (errors.submit) setErrors((prev) => ({ ...prev, submit: '' }));
                    }}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-12 py-3 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.password
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800/80 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400 font-medium cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs text-rose-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center justify-center w-full px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;