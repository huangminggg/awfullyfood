import { database } from "@/firebase";
import { store } from "@/stores";

const getTransactions = async (saveState = true) => {
    return database.collection("transactions").get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getTransactionsBySeller = async (sellerId, saveState = true) => {
    return database.collection("transactions")
        .where("sellerId", "==", sellerId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getApprovedTransactionsBySeller = async (sellerId, saveState = true) => {
    return database.collection("transactions")
        .where("sellerId", "==", sellerId)
        .where("isApproved", "==", true)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getPendingTransactionsBySeller = async (sellerId, saveState = true) => {
    return database.collection("transactions")
        .where("sellerId", "==", sellerId)
        .where("isApproved", "==", false)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}


const getTransactionsByBuyer = async (buyerId, saveState = true) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getApprovedTransactionsByBuyer = async (buyerId) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .where("isApproved", "==", true)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getPendingTransactionsByBuyer = async (buyerId) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .where("isApproved", "==", false)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getTransactionsByListing = async (listingId) => {
    return database.collection("transactions")
        .where("listingId", "==", listingId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const approveTransaction = async (transactionId) => {
    return database.collection("transactions").doc(transactionId).update({isApproved:true})
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}


const updateBuyerReview = async (transactionId,num,review) => {
    return database.collection("transactions").doc(transactionId).update({
          buyerReview: {'rating':num, 'description': review, 'updatedAt': new Date(Date.now())}//how to update server timestamp   
        })
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const updateSellerReview = async (transactionId,num,review) => {
    return database.collection("transactions").doc(transactionId).update({
          sellerReview: {'rating':num, 'description': review, 'updatedAt': Date.now()} //how to update server timestamp   
        })
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

export {
    getTransactions,
    getTransactionsByBuyer,
    getTransactionsByListing,
    getTransactionsBySeller,
    getApprovedTransactionsByBuyer,
    getPendingTransactionsByBuyer,
    getApprovedTransactionsBySeller,
    getPendingTransactionsBySeller,
    approveTransaction,
    updateBuyerReview,
    updateSellerReview,

}
