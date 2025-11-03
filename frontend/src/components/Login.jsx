import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // 登入成功後會自動更新 AuthContext 的 user 狀態
    } catch (err) {
      setError(err.message || '登入失敗，請檢查您的帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-200)' }}>
      <div className="max-w-md w-full rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--bg-100)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-100)' }}>
            📈 Stock Insight
          </h1>
          <p style={{ color: 'var(--text-200)' }}>登入您的帳號</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ 
                borderColor: 'var(--bg-300)', 
                backgroundColor: 'var(--bg-100)',
                color: 'var(--text-100)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-100)';
                e.target.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-200')}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--bg-300)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-100)' }}>
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ 
                borderColor: 'var(--bg-300)', 
                backgroundColor: 'var(--bg-100)',
                color: 'var(--text-100)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-100)';
                e.target.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-200')}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--bg-300)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div className="p-4 border rounded-lg" style={{ 
              backgroundColor: '#fee', 
              borderColor: '#fcc',
              color: '#c33'
            }}>
              <p className="text-sm">❌ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg disabled:cursor-not-allowed transition-colors font-medium"
            style={{ 
              backgroundColor: loading ? 'var(--bg-300)' : 'var(--primary-100)',
              color: 'var(--bg-100)'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = 'var(--accent-200)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = 'var(--primary-100)';
            }}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-200)' }}>
            還沒有帳號？{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-medium transition-colors"
              style={{ color: 'var(--primary-100)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-200)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--primary-100)'}
            >
              立即註冊
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
