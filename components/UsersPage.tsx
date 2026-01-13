/**
 * Users Management Page
 * View all users and register new ones
 */

import React, { useState } from 'react';
import { UserPlus, X, Check, Loader2, Eye, EyeOff, Edit3, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterFormData, UserRole } from '../types';
import { InputField } from './InputField';
import { validateStep } from '../utils/validation';

interface UsersPageProps {
  t: any;
}

const STATIONS = [
  { code: 'FR-KAN', name: 'Freedom Radio 99.5 FM Kano' },
  { code: 'FR-DUT', name: 'Freedom Radio 99.5 FM Dutse' },
  { code: 'FR-KAD', name: 'Freedom Radio 92.9 FM Kaduna' },
  { code: 'DL-KAN', name: 'Dala FM 88.5 Kano' },
];

// Mock users data - in real app, fetch from API
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@freedomradio.ng',
    full_name: 'System Administrator',
    phone: '+234 803 000 0001',
    role: 'super_admin' as UserRole,
    station_codes: ['FR-KAN', 'FR-DUT', 'FR-KAD', 'DL-KAN'],
    status: 'active' as const,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    username: 'aisha_bello',
    email: 'aisha@freedomradio.ng',
    full_name: 'Aisha Bello',
    phone: '+234 803 000 0002',
    role: 'accountant' as UserRole,
    station_codes: ['FR-KAN'],
    status: 'active' as const,
    created_at: '2024-02-10',
  },
  {
    id: '3',
    username: 'musa_lawal',
    email: 'musa@freedomradio.ng',
    full_name: 'Musa Lawal',
    phone: '+234 803 000 0003',
    role: 'sales_executive' as UserRole,
    station_codes: ['FR-KAD'],
    status: 'active' as const,
    created_at: '2024-03-05',
  },
];

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-700';
    case 'station_manager':
      return 'bg-blue-100 text-blue-700';
    case 'sales_executive':
      return 'bg-emerald-100 text-emerald-700';
    case 'accountant':
      return 'bg-orange-100 text-orange-700';
    case 'viewer':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const UsersPage: React.FC<UsersPageProps> = ({ t }) => {
  const { user: currentUser, register, loading, error, clearError } = useAuth();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
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

  const canManageUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'station_manager';

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
        setShowRegisterForm(false);
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleCancelRegister = () => {
    setShowRegisterForm(false);
    setStep(1);
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
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">User Management</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage system users and their permissions
          </p>
        </div>
        {canManageUsers && !showRegisterForm && (
          <button
            onClick={() => setShowRegisterForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <UserPlus size={18} />
            Register New User
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check size={20} className="text-white" strokeWidth={3} />
          </div>
          <div className="flex-1">
            <p className="text-emerald-900 font-bold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      {showRegisterForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in slide-in-from-top duration-300">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                    s < step
                      ? 'bg-emerald-500 text-white'
                      : s === step
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s < step ? <Check size={18} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 flex-1 mx-3 rounded ${
                      s < step ? 'bg-emerald-500' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Account Credentials'}
              {step === 3 && 'Role & Permissions'}
            </h3>
            <p className="text-slate-500 text-sm">Step {step} of 3</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl mb-6">
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

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCancelRegister}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#0f172a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
                >
                  Continue
                </button>
              </div>
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

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleBackStep}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#0f172a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs active:scale-95 transition-all"
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
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  disabled={loading}
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-50 active:scale-95 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
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
        </div>
      )}

      {/* Users Table */}
      {!showRegisterForm && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    User
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Stations
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-all">
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-slate-900">{user.full_name}</p>
                        <p className="text-slate-500 text-xs">@{user.username}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm text-slate-700">{user.email}</p>
                        <p className="text-slate-500 text-xs">{user.phone}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {user.station_codes.map((code) => (
                          <span
                            key={code}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-[8px] font-black text-slate-600"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {canManageUsers && (
                          <>
                            <button
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                              title="Edit user"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Users State (when table is empty) */}
      {!showRegisterForm && MOCK_USERS.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
            No Users Yet
          </h3>
          <p className="text-slate-500 text-sm">
            Get started by registering your first user
          </p>
        </div>
      )}
    </div>
  );
};
