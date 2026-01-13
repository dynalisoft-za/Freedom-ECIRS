/**
 * User Registration Page
 * Multi-step registration form for creating new users
 */

import React, { useState } from 'react';
import { Radio, UserPlus, Loader2, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterFormData, UserRole } from '../types';
import { InputField } from './InputField';
import { validateStep } from '../utils/validation';

interface RegisterPageProps {
  onBack: () => void;
  onSuccess: () => void;
  t: any;
}

const STATIONS = [
  { code: 'FR-KAN', name: 'Freedom Radio 99.5 FM Kano' },
  { code: 'FR-DUT', name: 'Freedom Radio 99.5 FM Dutse' },
  { code: 'FR-KAD', name: 'Freedom Radio 92.9 FM Kaduna' },
  { code: 'DL-KAN', name: 'Dala FM 88.5 Kano' },
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onSuccess, t }) => {
  const { register, loading, error, clearError } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'viewer',
    station_codes: [],
    status: 'active',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNext = () => {
    clearError();
    const errors = validateStep(step, formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    clearError();
    setValidationErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const errors = validateStep(3, formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
        station_codes: formData.station_codes,
        status: formData.status,
      });

      setSuccessMessage(`User ${formData.username} registered successfully!`);

      // Reset form
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          full_name: '',
          phone: '',
          role: 'viewer',
          station_codes: [],
          status: 'active',
        });
        setStep(1);
        setSuccessMessage(null);
        onSuccess();
      }, 2000);
    } catch (err) {
      // Error handled by AuthContext
      console.error('Registration error:', err);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen w-full flex bg-[#0f172a] justify-center items-center p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Registration Successful
              </h2>
              <p className="text-slate-600 font-bold">{successMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] justify-center items-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 text-emerald-500 mb-2">
            <Radio size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
            FREEDOM <span className="text-emerald-500">ECIRS</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">User Registration</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    s < step
                      ? 'bg-emerald-500 text-white'
                      : s === step
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s < step ? <Check size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      s < step ? 'bg-emerald-500' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Account Credentials'}
              {step === 3 && 'Role & Permissions'}
            </h2>
            <p className="text-slate-500 text-sm">Step {step} of 3</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <InputField
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                error={validationErrors.full_name}
                placeholder="e.g., Sadiq Ibrahim"
                autoFocus
              />

              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={validationErrors.phone}
                placeholder="+234 803 000 0000"
              />

              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={validationErrors.email}
                placeholder="user@freedomradio.com.ng"
              />

              <button
                onClick={handleNext}
                className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Account Credentials */}
          {step === 2 && (
            <div className="space-y-4">
              <InputField
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                error={validationErrors.username}
                placeholder="sadiq_ibrahim"
                hint="3-50 characters, alphanumeric only"
                autoFocus
              />

              <InputField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={validationErrors.password}
                placeholder="••••••••"
                hint="Minimum 6 characters"
              />

              <InputField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={validationErrors.confirmPassword}
                placeholder="••••••••"
              />

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleBackStep}
                  className="flex-1 bg-slate-100 text-slate-700 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#0f172a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Role & Permissions */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  User Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className={`w-full px-6 py-4 bg-slate-50 border-2 ${
                    validationErrors.role ? 'border-red-300' : 'border-slate-100'
                  } rounded-2xl font-bold text-slate-900 outline-none focus:border-slate-900 transition-all`}
                >
                  <option value="viewer">Viewer</option>
                  <option value="sales_executive">Sales Executive</option>
                  <option value="accountant">Accountant</option>
                  <option value="station_manager">Station Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                {validationErrors.role && (
                  <p className="text-red-500 text-xs ml-1 font-bold">{validationErrors.role}</p>
                )}
              </div>

              {/* Station Access */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Station Access
                </label>
                <div className="space-y-2">
                  {STATIONS.map((station) => (
                    <label
                      key={station.code}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.station_codes.includes(station.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              station_codes: [...formData.station_codes, station.code],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              station_codes: formData.station_codes.filter((c) => c !== station.code),
                            });
                          }
                        }}
                        className="w-5 h-5 rounded-lg"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{station.code}</p>
                        <p className="text-slate-500 text-xs">{station.name}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {validationErrors.station_codes && (
                  <p className="text-red-500 text-xs ml-1 font-bold">{validationErrors.station_codes}</p>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</p>
                  <p className="font-bold text-slate-900">
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: formData.status === 'active' ? 'inactive' : 'active',
                    })
                  }
                  className={`w-14 h-8 rounded-full transition-all relative ${
                    formData.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform absolute top-1 ${
                      formData.status === 'active' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleBackStep}
                  disabled={loading}
                  className="flex-1 bg-slate-100 text-slate-700 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-50 active:scale-95 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Register
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Dashboard Link */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-sm font-bold"
          >
            <ArrowLeft size={16} />
            Cancel & Return
          </button>
        </div>

        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Secured by Freedom Radio Group Infrastructure
        </p>
      </div>
    </div>
  );
};
