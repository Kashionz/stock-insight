import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 驗證密碼
    if (password !== confirmPassword) {
      setError('密碼不一致');
      return;
    }

    if (password.length < 6) {
      setError('密碼長度至少需要 6 個字元');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess(true);
      // 註冊成功後，可能需要驗證 email
    } catch (err) {
      setError(err.message || '註冊失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-200)' }}>
        <div className="max-w-md w-full rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--bg-100)' }}>
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
              註冊成功！
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-200)' }}>
              請檢查您的 Email 信箱以驗證您的帳號。
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full py-2 px-4 rounded-lg transition-colors font-medium"
              style={{ 
                backgroundColor: 'var(--primary-100)',
                color: 'var(--bg-100)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-200)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-100)'}
            >
              返回登入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-200)' }}>
      <div className="max-w-md w-full rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--bg-100)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-100)' }}>
            📈 Stock Insight
          </h1>
          <p style={{ color: 'var(--text-200)' }}>註冊新帳號</p>
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
              placeholder="至少 6 個字元"
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
              確認密碼
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次輸入密碼"
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
            {loading ? '註冊中...' : '註冊'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-200)' }}>
            已經有帳號了？{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium transition-colors"
              style={{ color: 'var(--primary-100)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-200)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--primary-100)'}
            >
              立即登入
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
