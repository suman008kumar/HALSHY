import { useRef, useState } from 'react';
import { Camera, Check, ImagePlus, Trash2, UserRound, X } from 'lucide-react';

export default function ProfileModal({ userName, image, onImageChange, onClose }) {
  const inputRef = useRef(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(''); setNotice('');
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 3 * 1024 * 1024) { setError('Image must be 3 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageChange(reader.result);
        setNotice('Profile photo updated.');
      } else setError('Could not read this image. Please try another file.');
    };
    reader.onerror = () => setError('Could not read this image. Please try another file.');
    reader.readAsDataURL(file);
  };

  return <div className="modal-layer profile-modal-layer" role="dialog" aria-modal="true" aria-label="Your profile">
    <button className="modal-backdrop" aria-label="Close profile" onClick={onClose}/>
    <section className="profile-modal">
      <div className="profile-modal-header"><div><span className="profile-modal-kicker">HALSHY+ ACCOUNT</span><h2>Your Profile</h2></div><button className="profile-close" onClick={onClose} aria-label="Close"><X size={19}/></button></div>
      <div className="profile-photo-area">
        <div className="profile-photo-large">{image ? <img src={image} alt={`${userName}'s profile`}/> : <UserRound size={42}/>}<span className="profile-photo-camera"><Camera size={17}/></span></div>
        <h3>{userName}</h3><p>Your profile on HALSHY+</p>
        <input ref={inputRef} className="profile-file-input" type="file" accept="image/*" onChange={chooseImage}/>
        <div className="profile-photo-actions"><button className="profile-upload-btn" onClick={() => inputRef.current?.click()}><ImagePlus size={16}/> Upload photo</button>{image && <button className="profile-remove-btn" onClick={() => {onImageChange('');setNotice('Profile photo removed.');setError('')}}><Trash2 size={15}/> Remove</button>}</div>
        <small className="profile-image-help">JPG, PNG, WEBP or another image · up to 3 MB</small>
        {notice && <div className="profile-success"><Check size={15}/>{notice}</div>}{error && <div className="profile-error">{error}</div>}
      </div>
      <div className="profile-info-row"><span>Display name</span><b>{userName}</b></div>
      <div className="profile-modal-footer"><span>Photo is saved in this browser for this account.</span><button onClick={onClose}>Done</button></div>
    </section>
  </div>;
}
