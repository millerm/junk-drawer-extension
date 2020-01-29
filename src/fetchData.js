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