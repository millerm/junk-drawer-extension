import { COLLECTIONS } from '../constants/collections';
/**
 * retrieves all records in all collections for a specific user
 *
 * @param {String} uid - The users id
 */
export function fetchRecords(uid) {
  console.log('inside fetchData')
  const db = firebase.firestore();

  const textSelections = db.collection(COLLECTIONS.TEXT_SELECTIONS).where("user", "==", uid).get();
  const pageSelections = db.collection(COLLECTIONS.PAGE_SELECTIONS).where("user", "==", uid).get();
  const mediaReferences = db.collection(COLLECTIONS.MEDIA_REFERENCES).where("user", "==", uid).get();
  const linkReferences = db.collection(COLLECTIONS.LINK_REFERENCES).where("user", "==", uid).get();

  return {}
}

export function fetchPageSelections(uid) {

}

export function fetchTextSelections(uid) {
  const db = firebase.firestore();

  return db.collection(COLLECTIONS.TEXT_SELECTIONS)
    .where("user", "==", uid)
    .get()
}

/**
 * Deletes an individual record from firestore
 * @param {String} collection - The collection the record should be deleted from
 * @param {String} id - The id of the record that should be deleted
 */
async function deleteRecord(collection, id) {
  const db = firebase.firestore();

  try {
    await db.collection(collection).doc(id).delete();
  } catch(error) {
    console.error(error);
  }
}