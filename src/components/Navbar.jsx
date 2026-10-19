import { Heart, Search, Settings, X, UserRound, ChevronDown, LogOut, CircleUserRound } from 'lucide-react';

export default function Navbar({ userName, userImage, accountMenuOpen, onToggleAccountMenu, onOpenProfile, onLogout, query, setQuery, favoritesOnly, setFavoritesOnly, onSettings, mobileSearch, setMobileSearch }) {
  return <header className="navbar">
    <button className="brand" onClick={() => { setFavoritesOnly(false); setQuery(''); }} aria-label="HALSHY+ home">
      <img className="brand-logo-image" src="/halshy-plus-logo.png" alt="HALSHY+"/>
    </button>
    <div className={`nav-search ${mobileSearch ? 'mobile-open' : ''}`}>
      <Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search channels, countries, categories…" aria-label="Search channels"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16}/></button>}
    </div>
    <nav className="nav-actions">
      <button className={favoritesOnly ? 'active' : ''} onClick={() => setFavoritesOnly(v => !v)}><Heart size={18} fill={favoritesOnly ? 'currentColor' : 'none'}/><span>Favorites</span></button>
      <button onClick={onSettings}><Settings size={18}/><span>Settings</span></button>
      <div className="account-menu-wrap">
        <button className={`nav-user ${accountMenuOpen ? 'menu-active' : ''}`} title={`Account: ${userName}`} onClick={onToggleAccountMenu} aria-expanded={accountMenuOpen} aria-haspopup="menu">
          {userImage ? <img className="nav-avatar" src={userImage} alt="Profile"/> : <span className="nav-avatar nav-avatar-fallback"><UserRound size={17}/></span>}
          <span className="nav-user-copy"><small>WATCHING AS</small><b>{userName}</b></span><ChevronDown className="account-chevron" size={15}/>
        </button>
        {accountMenuOpen && <><button className="account-menu-dismiss" aria-label="Close account menu" onClick={onToggleAccountMenu}/><div className="account-dropdown" role="menu">
          <div className="account-dropdown-heading">Account</div>
          <button role="menuitem" onClick={onOpenProfile}><CircleUserRound size={17}/><span><b>Profile</b><small>View profile and change photo</small></span></button>
          <button role="menuitem" className="logout-menu-item" onClick={onLogout}><LogOut size={17}/><span><b>Log out</b><small>Sign out of HALSHY+</small></span></button>
        </div></>}
      </div>
      <button className="mobile-search-btn" onClick={() => setMobileSearch(v => !v)} aria-label="Search"><Search size={19}/></button>
    </nav>
  </header>;
}
