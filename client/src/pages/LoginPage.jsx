
import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../providers/UserProvider';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const auth = useContext(UserContext);

  // Check if Google OAuth is configured
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidGoogleConfig = googleClientId && googleClientId !== 'your_google_client_id_here';

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    const payload = {
      email: formData.email.trim(),
      password: formData.password,
    };
    const response = await auth.login(payload);
    if (response.success) {
      toast.success(response.message);
      setRedirect(true);
    } else {
      const msg = response.message || 'Login failed';
      setErrorMsg(msg);
      toast.error(msg);
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);
      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl">Login</h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            required
            minLength={6}
          />
          {errorMsg && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}
          <button className="primary my-2" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* Divider - only show if Google login is available */}
        {hasValidGoogleConfig && (
          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">or</p>
            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>
        )}

        {/* Google login button - only show if configured */}
        {hasValidGoogleConfig && (
          <div className="flex h-[50px] justify-center">
            {/* GoogleLogin button here if you have the component installed */}
          </div>
        )}

        <div className="py-2 text-center text-gray-500">
          Don't have an account yet?{' '}
          <Link className="text-black underline" to={'/register'}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
