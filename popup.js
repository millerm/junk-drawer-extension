firebase.initializeApp(firebaseConfig);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      // User is signed in.
      const { displayName, uid } = user;

      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById(SELECTORS.HEADER_TITLE).textContent = `${displayName}'s Saved Items`;

      // Fetch lists
      // TODO: Cache these
      const {
        error,
        textSelections,
        pageSelections,
        mediaReferences,
        linkReferences
      } = await fetchData(uid);

      if (error) {
        // TODO: Handle this better
        console.error(error);
        return;
      }

      textSelections.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().pageUrl,
          displayText: doc.data().text
        })

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.TEXT_SELECTIONS_LIST).appendChild(listItem));

      pageSelections.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().pageUrl,
          displayText: doc.data().pageUrl
        })

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.PAGES_LIST).appendChild(listItem));

      mediaReferences.docs.map((doc) => {
        // The text and the link should be the same for media
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().linkUrl,
          displayText: doc.data().linkUrl
        });

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.MEDIA_LIST).appendChild(listItem));

      linkReferences.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().linkUrl,
          displayText: doc.data().selectionText
        });

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.LINKS_LIST).appendChild(listItem));
    } else {
      // Google Auth
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
    }
    document.getElementById('quickstart-button').disabled = false;
  });

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        debugger;
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  debugger;
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};