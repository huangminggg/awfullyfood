import { store } from '@/stores';
import { database, firestore } from '@/firebase';
import { getListing, getListings } from '@/services/list.service';

const getBookmarks = async (userId, saveState = true) => {
  const listings = (await getListings(false)).filter((listing) => {
    return listing.bookmarks.map((bm) => { return bm.userId; }).includes(userId);
  });
  const bookmarkedLists = listings.map((listing) => { return listing.id; });
  saveState ? await store.dispatch('updateBookmarks', bookmarkedLists) : null;
  return bookmarkedLists;
};

const getBookmarkLists = async (userId, saveState = true) => {
  const listings = (await getListings(false)).filter((listing) => {
    return listing.bookmarks.map((bm) => { return bm.userId; }).includes(userId);
  });
  saveState ? await store.dispatch('updateBookmarkLists', listings) : null;
  return listings;
};


const toggleBookmark = async (listingId, userId) => {
  const list = await getListing(listingId);
  const condition = list.bookmarks.map((bm) => { return bm.userId; }).includes(userId);
  const payload = condition ? list.bookmarks.find((ele) => { return ele.userId === userId; }) : { userId, updatedAt: Date.now() };
  const bookmarks = condition ? firestore.FieldValue.arrayRemove(payload) : firestore.FieldValue.arrayUnion(payload);
  return database.collection('listings').doc(listingId).update(
    {
      bookmarks,
    }
  )
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const isBookmarked = async (listingId, userId) => {
  const list = await getListing(listingId);
  return list.bookmarks.map((bm) => { return bm.userId; }).includes(userId);
};

export {
  getBookmarks,
  getBookmarkLists,
  toggleBookmark,
  isBookmarked,
};
