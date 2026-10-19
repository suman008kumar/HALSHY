import { Tv2 } from 'lucide-react';
import { useState } from 'react';
export default function ChannelLogo({ channel, large = false }) {
  const [failed, setFailed] = useState(false);
  const initials = channel?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase() || 'TV';
  return <div className={`channel-logo ${large ? 'large' : ''}`}>{channel?.logo && !failed ? <img src={channel.logo} alt="" loading="lazy" onError={() => setFailed(true)}/> : <div className="logo-fallback"><Tv2 size={large ? 34 : 22}/><b>{initials}</b></div>}</div>;
}
