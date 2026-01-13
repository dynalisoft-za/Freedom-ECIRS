/**
 * Reusable Input Field Component
 * Styled input with label, error handling, and hints
 */

import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  hint,
  autoFocus = false,
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`w-full px-6 py-4 bg-slate-50 border-2 ${
        error ? 'border-red-300' : 'border-slate-100'
      } rounded-2xl font-bold text-slate-900 outline-none focus:border-slate-900 transition-all`}
    />
    {hint && !error && <p className="text-slate-400 text-xs ml-1">{hint}</p>}
    {error && <p className="text-red-500 text-xs ml-1 font-bold">{error}</p>}
  </div>
);
