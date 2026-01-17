import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle'); // idle | success | error | loading

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');
    try {
      await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      }, { withCredentials: true });
      setLoginStatus('success');
    } catch (err) {
      setLoginStatus('error');
    }
  };

  return (
    <div style={{ width: 'fill', height: 'fill', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: loginStatus === 'error' ? '#e74c3c' : loginStatus === 'success' ? '#a2e3b6ff' : '#a2e3b6ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(158, 175, 205, 0.12)'
      }}>
        <form onSubmit={handleLogin} style={{ width: '80%', display: loginStatus === 'loading' ? 'none' : 'block' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: loginStatus === 'error' ? 'white' : 'black' }}>Username:</label><br />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: 170, padding: '4px 8px', height: 28, borderRadius: 4, border: 'none', marginTop: 4, fontSize: 15 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: loginStatus === 'error' ? 'white' : 'black' }}>Password:</label><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: 170, padding: '4px 8px', height: 28, borderRadius: 4, border: 'none', marginTop: 4, fontSize: 15 }} />
          </div>
          <button type="submit" style={{ padding: '8px 28px', borderRadius: 4, border: 'none', background: '#fff', color: '#153060', fontWeight: 'bold', cursor: 'pointer', width: 'auto', minWidth: 80 }}>Login</button>
        </form>
        {loginStatus === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120 }}>
            <div style={{
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #153060',
              borderRadius: '50%',
              width: 48,
              height: 48,
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
