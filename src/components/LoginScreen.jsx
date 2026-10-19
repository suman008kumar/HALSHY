import { useMemo, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { auth } from '../utils/auth';

export default function LoginScreen({ channels = [], onLogin, onAdmin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const names = useMemo(() => channels.filter(channel => channel.name).slice(0, 7).map(channel => channel.name), [channels]);
  const animatedNames = names.length ? names : ['LIVE TV', 'NEWS', 'SPORTS', 'WORLD TV', 'HALSHY+'];
  const submit = async event => {
    event.preventDefault(); setError('');
    if (!name.trim() || !password) return setError('Enter your name and password to continue.');
    setBusy(true);
    try {
      const account = await auth.verifyLogin(name, password);
      if (!account) setError(auth.hasLoginPassword() ? 'Name or password is incorrect.' : 'No user access has been created. Open Admin and add a user first.');
      else onLogin(account);
    } catch { setError('Unable to verify access. Please try again.'); }
    finally { setBusy(false); }
  };
  return <main className="login-screen">
    <div className="login-grid" aria-hidden="true"/><div className="login-glow login-glow-one" aria-hidden="true"/><div className="login-glow login-glow-two" aria-hidden="true"/><div className="login-orbit login-orbit-one" aria-hidden="true"><span/></div><div className="login-orbit login-orbit-two" aria-hidden="true"><span/></div>
    <div className="login-topline"><div className="login-mini-brand"><img src="/halshy-plus-logo.png" alt="HALSHY+"/></div><button className="admin-entry" onClick={onAdmin}><ShieldCheck size={16}/> Admin</button></div>
    <div className="login-center"><div className="login-signal"><span/><b>SECURE LIVE ACCESS</b><span/></div><div className="login-logo"><img src="/halshy-plus-logo.png" alt="HALSHY+"/></div><p className="login-tagline">Your world. One screen.</p>
      <div className="channel-marquee" aria-hidden="true">{[...animatedNames,...animatedNames].map((item,index)=><span key={`${item}-${index}`}>{item}<i>•</i></span>)}</div>
      <form id="streamorbit-login-form" className="login-card" onSubmit={submit}><div className="login-card-head"><div className="lock-icon"><LockKeyhole size={19}/></div><div><b>Welcome to HALSHY+</b><small>Sign in with your assigned name and password</small></div></div>
        <label className="password-field"><UserRound size={17}/><input autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="Your name" autoComplete="username" aria-label="Your name"/></label>
        <label className="password-field"><LockKeyhole size={17}/><input type={showPassword?'text':'password'} value={password} onChange={event=>setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" aria-label="Password"/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></label>
        {error&&<p className="login-error">{error}</p>}<button className="login-submit" disabled={busy}>{busy?<span className="button-spinner"/>:<ArrowRight size={18}/>} {busy?'Verifying…':'Enter HALSHY+'}</button><small className="login-security"><LockKeyhole size={12}/> Your access is checked against this browser's saved user list.</small>
      </form>
    </div><div className="login-footer"><span>LIVE TELEVISION</span><span>•</span><span>FAST CHANNEL SWITCHING</span><span>•</span><span>FUTURISTIC TV EXPERIENCE</span></div>
  </main>;
}
