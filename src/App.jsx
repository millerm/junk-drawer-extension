import React from 'react';
import Content from './components/Content';
import Header from './components/Header';
import firebaseConfig from './config';
import { fetchTextSelections } from './utils/fetchData';
import './css/main.css';
import { COLLECTIONS } from './constants/collections';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      user: undefined,
      textSelections: [],
    };

    this.initApp = this.initApp.bind(this);
    this.startAuth = this.startAuth.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);

    this.setState({
      ...this.state,
      isLoading: true
    });

    this.initApp();
  }

  initApp() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const { displayName, uid } = user;

          fetchTextSelections(uid).then((results) => {
            const textSelections = results.docs.map((doc) => ({
              id: doc.id,
              href: doc.data().pageUrl,
              displayText: doc.data().text,
              collection: COLLECTIONS.TEXT_SELECTIONS
            }));

            this.setState({
              ...this.state,
              isLoading: false,
              user: {
                displayName,
                uid
              },
              textSelections
            });
          });
        } else {
        this.setState({
          ...this.state,
          isLoading: false,
          user: undefined
        });
      }
    });
  }

  startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, (token) => {
      if (chrome.runtime.lastError && !interactive) {
        console.log('It was not possible to get a token programmatically.');
      } else if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else if (token) {
        // Authorize Firebase with the OAuth Access Token.
        var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // The OAuth token might have been invalidated. Lets' remove it from cache.
          if (error.code === 'auth/invalid-credential') {
            chrome.identity.removeCachedAuthToken({token: token}, () => {
              this.startAuth(interactive);
            });
          }
        });
      } else {
        console.error('The OAuth Token was null');
      }
    });
  }

  signIn() {
    this.startAuth(true);
  }

  signOut() {
    console.log('sign out')
    firebase.auth().signOut();
  }

  render() {
    const { user, isLoading, textSelections } = this.state;

    const headerButtonAction = user
      ? this.signOut
      : this.signIn;

    return isLoading 
      ? (<div>LOADING</div>)
      : (
      <div class="container">
        <Header
          headerButtonAction={headerButtonAction}
          user={this.state.user}
        />
        <ul>
          {textSelections.map((selection) => <li>{selection.displayText}</li>)}
        </ul>
      </div>
    )
  }
}

export default App;