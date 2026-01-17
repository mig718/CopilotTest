import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // login | signup
  
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle'); // idle | success | error | loading

  // Sign-up state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupStatus, setSignupStatus] = useState('idle'); // idle | success | error | loading
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupStatus('loading');
    setDuplicateEmailError(false);
    try {
      await axios.post('http://localhost:3000/api/auth/signup', {
        email: signupEmail,
        firstName: signupFirstName,
        lastName: signupLastName,
        password: signupPassword
      }, { withCredentials: true });
      setSignupStatus('success');
      // Reset form after successful signup
      setTimeout(() => {
        setSignupEmail('');
        setSignupFirstName('');
        setSignupLastName('');
        setSignupPassword('');
        setSignupStatus('idle');
        setCurrentView('login');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('email')) {
        setDuplicateEmailError(true);
        setSignupStatus('idle');
      } else {
        setSignupStatus('error');
      }
    }
  };

  const switchToSignup = () => {
    setUsername('');
    setPassword('');
    setLoginStatus('idle');
    setDuplicateEmailError(false);
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setSignupEmail('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupPassword('');
    setSignupStatus('idle');
    setDuplicateEmailError(false);
    setCurrentView('login');
  };

  return (
    <div style={{ width: 'fill', height: 'fill', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {currentView === 'login' ? (
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
          {loginStatus === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'green', fontWeight: 'bold' }}>
              Login Successful!
            </div>
          )}
          {loginStatus !== 'loading' && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 14, margin: '8px 0' }}>Don't have an account?</p>
              <button onClick={switchToSignup} style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#153060', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>Sign Up</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          width: 380,
          borderRadius: '12px',
          background: signupStatus === 'error' ? '#e74c3c' : signupStatus === 'success' ? '#a2e3b6ff' : '#a2e3b6ff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          boxShadow: '0 4px 24px rgba(158, 175, 205, 0.12)'
        }}>
          <h2 style={{ color: signupStatus === 'error' ? 'white' : 'black', marginBottom: 20 }}>Create Account</h2>
          <form onSubmit={handleSignup} style={{ width: '100%', display: signupStatus === 'loading' ? 'none' : 'block' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: signupStatus === 'error' ? 'white' : 'black', fontSize: 14 }}>Email:</label><br />
              <input type="email" value={signupEmail} onChange={e => { setSignupEmail(e.target.value); setDuplicateEmailError(false); }} required style={{ width: '100%', padding: '6px 8px', height: 32, borderRadius: 4, border: duplicateEmailError ? '2px solid red' : 'none', marginTop: 4, fontSize: 14, boxSizing: 'border-box' }} />
              {duplicateEmailError && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>Email already registered</div>}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: signupStatus === 'error' ? 'white' : 'black', fontSize: 14 }}>First Name:</label><br />
              <input type="text" value={signupFirstName} onChange={e => setSignupFirstName(e.target.value)} required style={{ width: '100%', padding: '6px 8px', height: 32, borderRadius: 4, border: 'none', marginTop: 4, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: signupStatus === 'error' ? 'white' : 'black', fontSize: 14 }}>Last Name:</label><br />
              <input type="text" value={signupLastName} onChange={e => setSignupLastName(e.target.value)} required style={{ width: '100%', padding: '6px 8px', height: 32, borderRadius: 4, border: 'none', marginTop: 4, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: signupStatus === 'error' ? 'white' : 'black', fontSize: 14 }}>Password:</label><br />
              <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required style={{ width: '100%', padding: '6px 8px', height: 32, borderRadius: 4, border: 'none', marginTop: 4, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ padding: '8px 28px', borderRadius: 4, border: 'none', background: '#fff', color: '#153060', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Register</button>
          </form>
          {signupStatus === 'loading' && (
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
          {signupStatus === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'green', fontWeight: 'bold' }}>
              Account Created! Redirecting to login...
            </div>
          )}
          {signupStatus !== 'loading' && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 14, margin: '8px 0', color: signupStatus === 'error' ? 'white' : 'black' }}>Already have an account?</p>
              <button onClick={switchToLogin} style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#153060', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>Log In</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
