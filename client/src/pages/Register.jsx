import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, Calendar, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { setAuthSession } from '../utils/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full name is required';

    if (!email.trim()) {
      tempErrors.email = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      tempErrors.terms = 'You must accept the Terms & Conditions';
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
      const res = await axios.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim(),
        role,
        password
      });

      if (res.data && res.data.status === 'success') {
        if (res.data.token) {
          setAuthSession(res.data.token, res.data.user);
        }
        setIsSubmitting(false);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('[REGISTRATION ERROR]', error);
      setErrors({
        submit: error.response?.data?.message || 'Unable to complete registration. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-6 overflow-hidden">
      <div className="max-w-md w-full">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/10 mb-4">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
          <p className="text-slate-400 mt-2 text-sm">Join CampusConnect today and start exploring college life</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Account Created!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-4">
                Your CampusConnect account has been created successfully. Welcome aboard, {name}!
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-2.5">
                <div className="flex justify-between text-xs border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500 font-medium">Selected Role:</span>
                  <span className="text-indigo-400 font-semibold uppercase tracking-wider">{role}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">College Email:</span>
                  <span className="text-slate-300 font-mono">{email}</span>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition text-sm font-semibold"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Alex Johnson"
                    className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.name
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800/80 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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
                    }}
                    placeholder="you@university.edu"
                    className={`block w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.email
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800/80 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      role === 'student'
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      role === 'organizer'
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Club Organizer</span>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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
                    }}
                    placeholder="Min. 8 characters"
                    className={`block w-full pl-10 pr-12 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
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
                {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="Re-enter password"
                    className={`block w-full pl-10 pr-12 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.confirmPassword
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-slate-800/80 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-400 cursor-pointer">
                  I agree to the Terms of Service & Campus Conduct Code
                </label>
              </div>
              {errors.terms && <p className="text-xs text-rose-400">{errors.terms}</p>}

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
                className="group relative flex items-center justify-center w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 mt-2"
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;