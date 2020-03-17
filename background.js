import { firebaseConfig } from './src/config.js';

firebase.initializeApp(firebaseConfig);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // ...
    } else {
      // ...
    }
  });
}

window.onload = function() {
  initApp();
};