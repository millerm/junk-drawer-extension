const junkDrawerContextMenu = {
  title: 'Junk Drawer',
  id: 'junkDrawer',
  contexts: ["all"]
};

// Create the context menu
chrome.contextMenus.create(junkDrawerContextMenu);

/**
 * Handles the selection of content. Does any validation or sanitization.
 * Routes the context to the appropriate handler.
 *
 * @param {String} [clickData.menuItemId] - The unique identifier for the context menu item that was selected
 * @param {String} [clickData.mediaType] - One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements
 * @param {String} [clickData.linkUrl] - If the element is a link, the URL it points to.
 * @param {String} [clickData.pageUrl] - The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
 * @param {String} [clickData.selectionText] - The text for the context selection, if any.
 * @return {void}
 */
const contentClickHandler = (clickData) => {
  console.log(clickData)
  const { menuItemId } = clickData;

  if (!menuItemId || menuItemId !== junkDrawerContextMenu.id) {
    return;
  }

  const formattedEvent = eventFormatter(clickData);

  dispatchFireStoreCreateEvent(formattedEvent);
}

/**
 * Formats a click event so it can be added to firestore
 *
 * @param {String} [clickData.mediaType] - One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements
 * @param {String} [clickData.linkUrl] - If the element is a link, the URL it points to.
 * @param {String} [clickData.pageUrl] - The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
 * @param {String} [clickData.selectionText] - The text for the context selection, if any.
 */
const eventFormatter = ({ mediaType, linkUrl, pageUrl, selectionText }) => {
  // If only pageUrl, then treat it like a bookmark
  if (pageUrl && !mediaType && !linkUrl && !selectionText) {
    return {
      collection: COLLECTIONS.PAGE_SELECTIONS,
      data: {
        pageUrl
      }
    };
  }

  // If there is a present link but no media type, a link was selected.
  if (linkUrl && !mediaType) {
    // The selectionText is the link title
    return {
      collection: COLLECTIONS.LINK_REFERENCES,
      data: {
        linkUrl,
        pageUrl,
        selectionText,
      }
    }
  }

  if (mediaType) {
    return {
      collection: COLLECTIONS.MEDIA_REFERENCES,
      data: {
        linkUrl,
        mediaType,
        pageUrl
      }
    }
  }

  if (selectionText && !linkUrl) {
    // just text was selected
    return {
      collection: COLLECTIONS.TEXT_SELECTIONS,
      data: {
        text: selectionText,
        pageUrl,
      }
    }
  }
}

/**
 * Handles the dispatching of a firestore insert
 *
 * @param {String} config.collection - an enum value that represents the collection that the record should be added to
 * @param {Object} config.data - the data that should be inserted into the collection
 * @return {void}
 */
const dispatchFireStoreCreateEvent = async ({ collection, data }) => {
  const { uid, displayName, email } = firebase.auth().currentUser;

  const db = firebase.firestore();
  const userRef = await db.collection("users").doc(uid).get();

  // TODO: Probably move this user check/creation to the background auth
  if (!userRef.exists) {
    try {
      await db.collection('users').doc(uid).set({
        displayName,
        email
      });
    } catch(error) {
      console.error(error);
    }
  }

  try {
    const item = await db.collection(collection).add({
      ...data,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: uid
    });

    console.log(item.get())
  } catch(error) {
    console.error(error);
  }
}

chrome.contextMenus.onClicked.addListener(contentClickHandler);
