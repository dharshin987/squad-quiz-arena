# Squad GK & G10 Arena: Firebase and GitHub Pages

This folder is the site root. Keep `index.html`, `styles.css`, `rules.js`, `app.js`, `firebase-config.js`, and `firebase-client.js` together. The current browser client now uses Firebase Email/Password Authentication and has Realtime Database listeners/writes for profiles, scores, chat, DMs, challenges, questions, notices, settings, and moderation. `localStorage` remains the per-device cache/fallback. Cloud access will remain unavailable until you publish the rules below.

## Firebase setup

1. In Firebase Authentication → Sign-in method, enable **Email/Password** and **Anonymous**. Players create accounts with an email, username, display name, and password; the account-help form uses a temporary anonymous session so banned/locked-out players can send the Admin a request. Password recovery uses the email reset link. Do not reuse real passwords.
2. In Realtime Database → **Rules**, paste the contents of `database.rules.json` and publish. The app's paths are separated so that user profiles, messages, and DMs do not require a public whole-database read/write rule.
3. Open the site locally through `http://localhost` or use the GitHub Pages HTTPS URL. If Firebase reports `auth/unauthorized-domain`, add that site's hostname in Firebase Authentication → Settings → Authorized domains.
4. Create your own account in the app. In Firebase Authentication → Users, copy that account's **UID**. In Realtime Database → Data, create `/admins/<your-uid>` with the boolean value `true`. This is the initial owner/admin bootstrap; the app itself must never grant its own first admin role.
5. Sign out and back in. The app should now show the Admin tab for that account. Use its Admin panel to promote moderators/admins and manage accounts.

The Firebase web configuration in `firebase-config.js` is public app metadata, not a password. Never commit a service-account key, database secret, or private credentials. Firebase Security Rules are the access control. The rule file grants score writes to each authenticated player so the classroom leaderboard can update without a server; because quiz scoring runs in browser code, a determined player can tamper with their own score. Treat points as casual/testing scores. Tamper-proof scoring requires trusted server code that validates answers.

## Data model and limitations

- `/profiles/<uid>`: display name and username; no email or password data.
- `/scores/<uid>` and `/playerData/<uid>`: leaderboard fields and private answer/progress data.
- `/chat/<messageId>`: authenticated public messages.
- `/dms/<uid>/<messageId>`: each account's inbox/sent copies; rules scope reads to that account and messages' participants.
- `/challenges/<id>`, `/questions/<id>`, `/notices/<id>`, `/settings`, `/moderation`, `/supportRequests`, `/antiCheatAlerts`, `/noticeReads`: shared arena and staff data with rules by role/owner.

This version keeps app data in localStorage as a fallback and uses per-path Firebase listeners for shared updates. Do not use the old manual whole-state HTTP sync; it has been removed from the Admin controls. Realtime Database rules limit access, but a browser-only game cannot make client-side scores or anti-cheat evidence tamper-proof. Avoid storing sensitive information in the app.

Firebase Spark currently lists 100 simultaneous Realtime Database connections, 1 GB stored, and 360 MB/day downloaded (about 10 GB/month). Check the Firebase Usage dashboard; Spark quota limits can interrupt database service.

## Local launch

Run `Start Squad Arena.bat` from this folder. It starts a small local HTTP server at `http://127.0.0.1:8000/`; leave its terminal window open while playing. Firebase Auth may require adding `localhost` as an authorized domain.

## GitHub Pages deployment

1. The repository is [dharshin987/squad-quiz-arena](https://github.com/dharshin987/squad-quiz-arena). Put the *contents of this folder* at its root so `index.html` and `.github/workflows/pages.yml` are at the top level.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
3. Push the `main` branch. The workflow publishes the app; GitHub shows the Pages URL under **Settings → Pages** and in the deployment run.
4. Add the published hostname to Firebase Authentication → Settings → Authorized domains if needed.
5. Invite players only after trying account creation, sign-in/reset, chat, DMs, challenges, leaderboard updates, admin roles/moderation, and offline/reconnect in two browsers.

GitHub Pages provides static hosting only. Firebase provides authentication and shared database state.
