import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { username: 'teacher1', password: 'teacher123', role: 'ครู' },
    { username: 'teacher2', password: 'teacher123', role: 'ครู' },
    { username: 'student1', password: 'student123', role: 'นักเรียน' },
    { username: 'student2', password: 'student123', role: 'นักเรียน' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="apple-card p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            ระบบส่งงาน
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Assignment Management System
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-gray-900 font-semibold mb-3 text-sm">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="apple-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-gray-900 font-semibold mb-3 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="apple-input"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-btn-primary w-full mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Demo Accounts:</h3>
            <div className="space-y-2 text-xs">
              {demoAccounts.map((account, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <p className="text-gray-800">
                    <span className="font-semibold text-blue-700">{account.role}:</span> <span className="text-gray-700">{account.username} / {account.password}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
