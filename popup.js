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
      } = await fetchRecords(uid);

      if (error) {
        // TODO: Handle this better
        console.error(error);
        return;
      }

      textSelections.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().pageUrl,
          displayText: doc.data().text,
          collection: COLLECTIONS.TEXT_SELECTIONS
        })

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.TEXT_SELECTIONS_LIST).appendChild(listItem));

      pageSelections.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().pageUrl,
          displayText: doc.data().pageUrl,
          collection: COLLECTIONS.PAGE_SELECTIONS
        })

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.PAGES_LIST).appendChild(listItem));

      mediaReferences.docs.map((doc) => {
        // The text and the link should be the same for media
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().srcUrl,
          displayText: doc.data().linkUrl,
          collection: COLLECTIONS.MEDIA_REFERENCES
        });

        return linkFactory(linkData);
      }).forEach((listItem) => document.getElementById(SELECTORS.MEDIA_LIST).appendChild(listItem));

      linkReferences.docs.map((doc) => {
        const linkData = Object.freeze({
          id: doc.id,
          href: doc.data().linkUrl,
          displayText: doc.data().selectionText,
          collection: COLLECTIONS.LINK_REFERENCES
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
  document.addEventListener('click', handleClick, false);
  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Event delegation - one click handler to rule them all
 * @param {ClickEvent} event - The click event
 */
function handleClick(event) {
  if (event.target.matches('.delete-button')) {
    handleClickDelete(event.target);
  }
}

 /**
 * Handles the validation of record information before deleting
 *
 * @param {String} collection - The name of the collection that the record should be deleted from
 * @param {String} id - The id of the record that should be deleted
 * @return {void}
 */
function handleClickDelete(target) {
  // The listItem is the parent node of the target
  const listItem = target.parentNode;
  const id = listItem.getAttribute('value');
  const collection = listItem.getAttribute('data-collection');

  if (!collection) {
    console.error('Missing or invalid argument `collection` was passed to method: `handleClickDelete`')

    return;
  }

  if (!id) {
    console.error('Missing or invalid argument `id` was passed to method: `handleClickDelete`');

    return;
  }

  // Delete the list item from the DOM:
  // 1.) Determine which <ul> it's in
  const listClassName = COLLECTIONS_ID_NAME_MAP[collection];
  const list = document.getElementById(listClassName);
  // 2.) Remove the list item
  list.removeChild(listItem);

  // Delete the actual record
  deleteRecord(collection, id);
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