import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import toast from 'react-hot-toast';

/**
 * Login page — authenticates user via POST /api/auth/login, which
 * verifies the email/password combination server-side.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(email.trim(), password);
      const user = response.data;

      localStorage.setItem('loggedInUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response?.data?.message || 'Invalid email or password.');
      } else {
        console.error(error);
        toast.error('Login failed. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@campushub.edu"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
