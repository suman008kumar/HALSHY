import { useEffect, useRef } from 'react';
import { LoaderCircle, Radio } from 'lucide-react';
import ChannelCard from './ChannelCard';

export default function ChannelGrid({ channels, favorites, workingIds, onFavorite, onPlay, hasMore, onLoadMore, total }) {
  const sentinelRef = useRef(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) onLoadMore(); }, { rootMargin: '240px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, channels.length]);
  if (!channels.length) return <div className="empty-state"><Radio size={34}/><h3>No channels found</h3><p>Try another search, country or favorites filter.</p></div>;
  return <div>
    <div className="channel-grid">{channels.map(channel => <ChannelCard key={channel.id} channel={channel} favorite={favorites.includes(channel.id)} working={workingIds.has(channel.id)} onFavorite={onFavorite} onPlay={onPlay}/>)}</div>
    {hasMore && <div className="load-more-wrap" ref={sentinelRef}><button className="load-more-btn" onClick={onLoadMore}><LoaderCircle size={16}/> Load 10 more <span>{channels.length} / {total}</span></button></div>}
  </div>;
}
