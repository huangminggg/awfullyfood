<template>
  <div>
    <h2>Available Transactions</h2>
    <br>
    <b-list-group deck>
      <b-list-group-item
        v-for="transaction in unreviewedTransactions"
        :key="transaction.id"
        class="d-flex justify-content-between list-group-item-action align-items-center"
      >
        <div>
          <h1 class="mb-3">
            Status: {{ getStatus(transaction.isApproved) }}
          </h1>
          <h1> Item: {{ transaction.listName }} </h1>
          <h1> Quantity: {{ transaction.quantity }} </h1>
          <small>Created at: {{ convertTimestamp(transaction.createdAt) }}</small>
        </div>
        <b-button-group>
          <b-button
            variant="outline-info"
            class="ml-auto"
            @click="navigate(transaction.listingId)"
          >
            View Listing
          </b-button>
          <b-button
            variant="outline-info"
            class="ml-auto"
            :disabled="isDisabled(transaction.isApproved)"
            @click="reviewTransaction(transaction.id)"
          >
            Review
          </b-button>
        </b-button-group>
      </b-list-group-item>
    </b-list-group>
    <br>
    <div>
      <div style="text-align:center">
        <b-button
          v-b-toggle.collapse-1
          variant="info"
          class="ml-auto"
        >
          Show Past Transactions
        </b-button>
      </div>
      <b-collapse
        id="collapse-1"
        class="mt-2"
      >
        <b-list-group deck>
          <b-list-group-item
            v-for="transaction in reviewedTransactions"
            :key="transaction.id"
            class="d-flex list-group-item-action justify-content-between align-items-center"
          >
            <div>
              <h1> Item: {{ transaction.listName }} </h1>
              <h1> Quantity: {{ transaction.quantity }} </h1>
              <small> Reviewed at: {{ convertTimestamp(transaction.sellerReview.updatedAt) }}</small>
            </div>
            <b-button
              variant="outline-info"
              class="ml-auto"
              @click="navigate(transaction.listingId)"
            >
              View Listing
            </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </div>
    <ReviewModal
      id="review-modal"
      style="display:none;"
      :transaction-id="selectedTransactionId"
      @submitReview="submitReview"
    />
  </div>
</template>

<script>

import ReviewModal from '@/components/ReviewModal';
import { store } from '@/stores';
import { router } from '@/routes';
import { authService } from '@/firebase';
import { getTransactionsByBuyer } from '@/services/transaction.service';
import { updateSellerReview } from '@/services/review.service';
import { convertTimestamp } from '@/services/utils.service';
import { getUserProfile } from '@/services/user.service';

export default {
  name: 'BTransactionDetailPage',
  components: {
    ReviewModal,
  },
  data() {
    return {
      show: false,
      selectedTransactionId: '',
      description: '',
      rating: 0,
    };
  },

  computed: {
    unreviewedTransactions() {
      return store.getters.getBuyerUnreviewedTransaction;
    },
    reviewedTransactions() {
      return store.getters.getBuyerReviewedTransaction;
    },
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getTransactionsByBuyer(store.getters.getProfileState?.id);
    loader.hide();
  },

  methods: {
    reviewTransaction(transactionId) {
      this.selectedTransactionId = transactionId;
      document.getElementById('review-modal').getElementsByTagName('button')[0].click();
    },
    back() {
      router.back();
    },
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },
    convertTimestamp(timestamp) {
      return timestamp ? convertTimestamp(timestamp) : null;
    },
    getStatus: function(item) {
      if (item) {
        return 'Transaction is approved and you can leave a review for the seller.';
      }
      return 'Transaction is not approved.';
    },
    isDisabled(item) {
      return item ? false : true;
    },
    async submitReview(review) {
      const res = await updateSellerReview(review.transactionId, review.rating, review.description);
      if (!res) {
        alert('Something went wrong, please check the fields and try again');
      } else {
        const loader = this.$loading.show({ color: 'teal' });
        await getTransactionsByBuyer(store.getters.getProfileState?.id);
        loader.hide();
      }
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 16px;
}

h2 {
  color:  #cc0044;
  font-size: 26px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
}

</style>
