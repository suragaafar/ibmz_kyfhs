import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';

export default function Login({ onNavigate }) {
  const { isUserAuthenticated, user, signIn, signUp } = useUserAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const action = isRegistering ? signUp : signIn;
    const result = isRegistering
      ? action({ displayName: name, email, password })
      : action({ email, password });

    if (!result.success) {
      setError(result.message);
      return;
    }

    onNavigate('dashboard');
  }

  if (isUserAuthenticated) {
    return (
      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-10">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Already signed in</h1>
        <p className="text-sm leading-6 text-slate-300">
          You are currently signed in as <span className="font-semibold text-white">{user?.email || 'your account'}</span>.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
        >
          Go to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-10">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Secure access</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold transition ' +
              (isRegistering ? 'bg-white/5 text-slate-300' : 'bg-cyan-400 text-slate-950')
            }
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={
              'rounded-full px-4 py-2 text-sm font-semibold transition ' +
              (isRegistering ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300')
            }
          >
            Sign up
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {isRegistering ? 'Create your AquaGuard account' : 'Sign in to AquaGuard'}
        </h1>
        <p className="text-sm leading-6 text-slate-300">
          {isRegistering
            ? 'Enter your name, email, and password to create your account.'
            : 'Sign in with your registered email and password to continue.'}
        </p>
        <p className="text-xs text-slate-400">
          Fields marked with <span className="text-rose-300">*</span> are required.
        </p>
        {isRegistering && (
          <p className="text-xs text-slate-400">
            Name is optional and will default to your email handle if left blank.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Name <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name or username"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Email <span className="text-rose-300">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Password <span className="text-rose-300">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter a password"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        {isRegistering ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Confirm password <span className="text-rose-300">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        ) : null}

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
        >
          {isRegistering ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
        <span>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</span>
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {isRegistering ? 'Log in' : 'Sign up'}
        </button>
      </div>
    </div>
  );
}
