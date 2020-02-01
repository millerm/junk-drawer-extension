
/**
 * retrieves all records in all collections for a specific user
 *
 * TODO: Rename this to something more specific
 *
 * @param {String} uid - The users id
 */
const fetchData = async (uid) => {
  const db = firebase.firestore();

  try {
    const textSelections = await db.collection(COLLECTIONS.TEXT_SELECTIONS).where("user", "==", uid).get();
    const pageSelections = await db.collection(COLLECTIONS.PAGE_SELECTIONS).where("user", "==", uid).get();
    const mediaReferences = await db.collection(COLLECTIONS.MEDIA_REFERENCES).where("user", "==", uid).get();
    const linkReferences = await db.collection(COLLECTIONS.LINK_REFERENCES).where("user", "==", uid).get();

    return {
      textSelections,
      pageSelections,
      mediaReferences,
      linkReferences
    };
  } catch(error) {
    return {
      error: true,
      message: error
    };
  }
}

/**
 * Deletes an individual record from firestore
 * @param {String} collection - The collection the record should be deleted from
 * @param {String} id - The id of the record that should be deleted
 */
const deleteRecord = async (collection, id) => {
  const db = firebase.firestore();

  try {
    await db.collection(collection).doc(id).delete();
  } catch(error) {
    console.error(error);
  }
}