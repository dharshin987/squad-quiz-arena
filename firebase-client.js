/* Firebase compat adapter: keeps the current app as classic scripts, so no bundler is needed. */
(() => {
  if (!window.firebase) {
    window.ArenaFirebase = { ready: false, error: 'Firebase SDK did not load. Open this app while connected to the internet.' };
    return;
  }
  try {
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();
    window.ArenaFirebase = {
      ready: true,
      auth,
      database: db,
      createAccount: (email, password) => auth.createUserWithEmailAndPassword(email, password),
      signInAnonymously: () => auth.signInAnonymously(),
      signIn: (email, password) => auth.signInWithEmailAndPassword(email, password),
      signOut: () => auth.signOut(),
      sendPasswordReset: email => auth.sendPasswordResetEmail(email),
      onAuth: callback => auth.onAuthStateChanged(callback),
      read: async path => (await db.ref(path).once('value')).val(),
      write: (path, value) => db.ref(path).set(value),
      patch: (path, value) => db.ref(path).update(value),
      add: (path, value) => db.ref(path).push(value),
      listen: (path, callback, onError) => {
        const target = db.ref(path);
        target.on('value', callback, onError);
        return () => target.off('value', callback);
      }
    };
  } catch (error) {
    window.ArenaFirebase = { ready: false, error: error.message || String(error) };
  }
})();
