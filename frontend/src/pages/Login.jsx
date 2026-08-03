import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../api/userApi';
import toast from 'react-hot-toast';

/**
 * Login page — authenticates user by email/password lookup.
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
      const response = await userApi.getAll();
      const users = response.data;
      const matched = users.find(
        (u) => u.email === email.trim()
      );

      if (!matched) {
        toast.error('Invalid email or password.');
      } else {
        localStorage.setItem('loggedInUser', JSON.stringify(matched));
        toast.success(`Welcome back, ${matched.name}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Is the backend running?');
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
