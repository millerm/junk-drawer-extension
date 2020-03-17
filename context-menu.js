// import { firebaseConfig } from './src/config.js';

// firebase.initializeApp(firebaseConfig);

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
function contentClickHandler(clickData) {
  const { menuItemId } = clickData;

  if (!menuItemId || menuItemId !== junkDrawerContextMenu.id) {
    return;
  }

  const event = eventFactory(clickData, ACTIONS.INSERT);

  dispatchFireStoreAction(event);
}

/**
 * Formats a click event so it can be added to firestore
 *
 * @param {String} [clickData.mediaType] - One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements
 * @param {String} [clickData.linkUrl] - If the element is a link, the URL it points to.
 * @param {String} [clickData.pageUrl] - The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
 * @param {String} [clickData.selectionText] - The text for the context selection, if any.
 * @param {String} [clickData.srcUrl] - The source URL of the media
 * @param {String} [action] - An enum indicating which action should be dispatched (example "INSERT")
 * @return {Object}
 */
function eventFactory({ mediaType, linkUrl, pageUrl, selectionText, srcUrl }, action = ACTIONS.INSERT) {
  const { uid } = firebase.auth().currentUser;

  // If only pageUrl, then treat it like a bookmark
  if (pageUrl && !mediaType && !linkUrl && !selectionText) {
    return Object.freeze({
      action,
      collection: COLLECTIONS.PAGE_SELECTIONS,
      data: {
        pageUrl,
        createdAt: new Date().toISOString(),
        uid
      }
    });
  }

  // If there is a present link but no media type, a link was selected.
  if (linkUrl && !mediaType) {
    // The selectionText is the link title
    return Object.freeze({
      action,
      collection: COLLECTIONS.LINK_REFERENCES,
      data: {
        linkUrl,
        pageUrl,
        selectionText,
        createdAt: new Date().toISOString(),
        uid
      }
    });
  }

  if (mediaType && srcUrl) {
    return Object.freeze({
      action,
      collection: COLLECTIONS.MEDIA_REFERENCES,
      data: {
        srcUrl,
        mediaType,
        pageUrl,
        createdAt: new Date().toISOString(),
        uid
      }
    });
  }

  if (selectionText && !linkUrl) {
    // just text was selected
    return Object.freeze({
      action,
      collection: COLLECTIONS.TEXT_SELECTIONS,
      data: {
        text: selectionText,
        pageUrl,
        createdAt: new Date().toISOString(),
        uid
      }
    });
  }

  return {};
}

/**
 * Handles the dispatching of an action to firestore
 *
 * @param {String} config.action - an enum indicating which action should be dispatched (example "INSERT")
 * @param {String} config.collection - an enum value that represents the collection that the record should be added to
 * @param {Object} config.data - the data that should be inserted into the collection
 * @return {void}
 */
async function dispatchFireStoreAction({ action = '', collection, data }) {
  const db = firebase.firestore();

  try {
    const doc = await db.collection(collection).add(data);

    chrome.notifications.create(doc.id, {
      type: "basic",
      title: "Success!",
      message: "Your item was saved successfully!",
      iconUrl: 'images/get_started16.png'
    });

  } catch(error) {
    console.error(error);

    chrome.notifications.create(doc.id, {
      type: "basic",
      title: "Error!",
      message: error.message,
      iconUrl: 'images/get_started16.png'
    });
  }
}

chrome.contextMenus.onClicked.addListener(contentClickHandler);
