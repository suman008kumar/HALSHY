# HALSHY+ Live TV — Final UI Update

## Updates
- Replaced Popstream branding with the supplied HALSHY+ logo throughout the app, including loading, login, navigation, welcome, and admin screens.
- Added a cinematic animated loading screen before the login page while the channel playlist loads.
- Set **All Countries** as the default country filter.
- The channel list starts with available playlist entries so users can select a stream. After playback checks begin, the list shows only channels that have successfully reached playback in this browser session. A stream is marked working only after the browser reports actual playback; stream availability depends on the third-party playlist.
- Updated browser title and metadata.
- Added an account dropdown when clicking the signed-in name/avatar, with **Profile** and **Log out** options.
- Added a profile dialog with image upload/removal, image preview, file-type/size validation, and a circular avatar beside the viewer name in the top navigation.
- Profile photos are stored in this browser per account using localStorage; they do not sync across devices or browsers.

## Run locally
1. Install Node.js LTS.
2. Run `npm install`.
3. Run `npm run dev`.
4. Run `npm run build` to create a production build.

## Note
This is a frontend IPTV player. Some streams can be geo-blocked, offline, or unsupported by the browser. No UI can guarantee that every listed stream is currently available without attempting playback.
