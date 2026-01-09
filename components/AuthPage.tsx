
import React, { useState } from 'react';
import { CloseIcon, GlobeIcon, PhoneIcon, LockClosedIcon, UserIcon, CalendarIcon, AtSymbolIcon } from './icons';
import RotatingGlobe from './RotatingGlobe';
import type { User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthPageProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

type ViewMode = 'login' | 'signup';

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, onAuthSuccess }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Email or Phone
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [place, setPlace] = useState('');
  
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const resetForms = () => {
    setPhone('');
    setPassword('');
    setError('');
    setName('');
    setDateOfBirth('');
    setConfirmPassword('');
    setLoginIdentifier('');
    setEmail('');
    setGender('');
    setPlace('');
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const identifier = loginIdentifier.trim();
        const loginEmail = identifier.includes('@') ? identifier : `${identifier}@geosick.placeholder`;

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: password,
        });

        if (authError) throw authError;

        if (data.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw new Error("Profile not found. Make sure signup was completed.");

            if (profile) {
                onAuthSuccess({
                    id: profile.id,
                    phone: profile.phone || '',
                    name: profile.full_name || 'User',
                    email: profile.email,
                    date_of_birth: profile.dob,
                    gender: profile.gender,
                    place: profile.place,
                    created_at: profile.created_at,
                    isAdmin: profile.is_admin,
                });
            }
        }
    } catch (err: any) {
        console.error("Login error:", err);
        setError(err.message || "Invalid credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (!name.trim() || (!phone.trim() && !email.trim()) || !dateOfBirth || !password) {
        setError("Please fill out all required fields.");
        return;
    }
    setIsLoading(true);
    
    try {
        const signupEmail = email.trim() || `${phone.trim()}@geosick.placeholder`;
        
        // 1. Create user in Auth
        const { data, error: signupError } = await supabase.auth.signUp({
            email: signupEmail,
            password: password,
        });

        if (signupError) throw signupError;

        if (data.user) {
            // 2. Create the public profile record
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    full_name: name.trim(),
                    email: signupEmail,
                    phone: phone.trim() || null,
                    dob: dateOfBirth,
                    gender: gender || null,
                    place: place.trim() || null,
                    is_admin: false
                });

            if (profileError) {
                console.error("Profile Insert Error:", profileError);
                throw new Error(`Profile creation failed: ${profileError.message}. If this is an RLS error, ensure you ran the SQL policy script.`);
            }

            onAuthSuccess({
                id: data.user.id,
                phone: phone.trim(),
                name: name.trim(),
                email: signupEmail,
                date_of_birth: dateOfBirth,
                gender: gender || null,
                place: place.trim() || null,
                created_at: new Date().toISOString(),
                isAdmin: false
            });
        }
    } catch (err: any) {
         console.error("Signup process error:", err);
         setError(err.message || "An unexpected error occurred.");
    } finally {
         setIsLoading(false);
    }
  };
  
  const inputClasses = "w-full pl-11 pr-3 py-3 bg-white border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-shadow";
  const buttonClasses = "w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 shadow-sm hover:shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed";

  const renderSignUpForm = () => (
     <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} placeholder="Full Name *" />
            </div>
            <div className="relative">
                <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClasses} placeholder="Phone Number *" />
            </div>
        </div>
        <div className="relative">
            <AtSymbolIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="Email Address (Optional)" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
                <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className={inputClasses} placeholder="Date of Birth *" />
            </div>
            <div className="relative">
                <GlobeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} className={inputClasses} placeholder="Place (Optional)" />
            </div>
        </div>
        <div className="relative">
             <select value={gender} onChange={(e) => setGender(e.target.value)} className={`${inputClasses} pl-4`}>
                <option value="">Select Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
            </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClasses} placeholder="Password *" />
            </div>
             <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClasses} placeholder="Confirm Password *" />
            </div>
        </div>
        <button type="submit" disabled={isLoading} className={buttonClasses}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
            <AtSymbolIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} required className={inputClasses} placeholder="Phone or Email" />
        </div>
        <div className="relative">
            <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClasses} placeholder="Password" />
        </div>
        <button type="submit" disabled={isLoading} className={buttonClasses}>
            {isLoading ? 'Logging In...' : 'Login Securely'}
        </button>
    </form>
  );


  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md lg:max-w-4xl flex flex-col lg:grid lg:grid-cols-2 animate-fade-in-up overflow-hidden max-h-[90vh] lg:max-h-none">
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-blue-600 to-slate-800 text-white relative order-first">
            <div className="absolute inset-0 z-0 h-full w-full opacity-50"><RotatingGlobe /></div>
            <div className="z-10 text-center">
                <GlobeIcon className="w-16 h-16 lg:w-20 lg:h-20 text-white mx-auto mb-4"/>
                <h2 className="text-2xl lg:text-3xl font-bold">GeoSick</h2>
                <p className="mt-2 text-blue-200 text-sm lg:text-base">AI-Powered Environmental Health Intelligence.</p>
            </div>
        </div>
        <div className="p-8 sm:p-12 relative overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10" aria-label="Close authentication"><CloseIcon className="w-6 h-6" /></button>
            <div className="w-full flex border-b border-slate-200 mb-8">
                 <button onClick={() => { setViewMode('login'); resetForms(); }} className={`flex-1 text-center font-semibold pb-3 border-b-2 transition-colors ${viewMode === 'login' ? 'text-slate-800 border-blue-500' : 'text-slate-400 border-transparent hover:border-slate-300'}`}>
                    Login
                </button>
                 <button onClick={() => { setViewMode('signup'); resetForms(); }} className={`flex-1 text-center font-semibold pb-3 border-b-2 transition-colors ${viewMode === 'signup' ? 'text-slate-800 border-blue-500' : 'text-slate-400 border-transparent hover:border-slate-300'}`}>
                    Sign Up
                </button>
            </div>
            
            {viewMode === 'login' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-1 mb-6">Login to access your dashboard.</p>
                    {renderLoginForm()}
                </div>
            )}

            {viewMode === 'signup' && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                    <p className="text-slate-500 mt-1 mb-6">Get started with GeoSick's health tools.</p>
                    {renderSignUpForm()}
                </div>
            )}

            {error && (
                <div className="text-sm text-red-600 text-center pt-4 bg-red-50 p-4 rounded-lg mt-6 border border-red-200 animate-pulse">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
