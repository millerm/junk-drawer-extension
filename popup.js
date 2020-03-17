import { firebaseConfig } from './src/config.js';

firebase.initializeApp(firebaseConfig);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      // User is signed in.

      const { email } = user;
      // Hide input form
      hideSignInForm();

      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById(SELECTORS.HEADER_TITLE).textContent = `Logged in as ${email}`;
    } else {
      displaySignInForm();
      // Google Auth
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById(SELECTORS.HEADER_TITLE).textContent = `Login to start saving content`;
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
function startAuth(interactive, { email, password }) {
  firebase.auth().signInWithEmailAndPassword(email, password).then((fireBaseUser) => {
    if (fireBaseUser) {
      document.getElementById('input-errors').style.visibility = "hidden";
      document.getElementById('quickstart-button').disabled = true;
    }

  }).catch(function(error) {
    displayError(error);
    // The OAuth token might have been invalidated. Lets' remove it from cache.
    if (error.code === 'auth/invalid-credential') {
      chrome.identity.removeCachedAuthToken({token: token}, function() {
        startAuth(interactive);
      });
    }
  });
}

function displayError({ code, message }) {
  const errorText = document.getElementById('input-errors');
  
  let errorMessage = message || 'Invalid credentials!';

  errorText.style.visibility = 'visible';

  document.getElementById('input-errors').textContent = errorMessage;
}

function hideSignInForm() {
  document.getElementById('input-container').style.visibility = "hidden";
}

function displaySignInForm() {
  document.getElementById('input-container').style.visibility = "visible";
  document.getElementById('email-input').value = '';
  document.getElementById('password-input').value = '';
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();

    displaySignInForm();
  } else {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    startAuth(true, { email, password });
  }
}

window.onload = function() {
  initApp();
};