<template>
  <div>
    <span class="float-right">
      <div class="input-group">
        <b-input
          v-model.lazy="content"
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
        />
      </div>
    </span>

    <b-button-group>
      <span>
        <SortModal @sortListing="sortListing" />
      </span>

      <span>
        <b-button
          variant="info"
          class="ml-auto"
          @click="addListing()"
        >Create Listing</b-button>
      </span>
    </b-button-group>

    <hr class="dropdown-divider">
    <b-row>
      <b-card
        v-for="list in listing"
        :key="list.id"
        :title="list.name"
        :img-src="list.photo"
        img-alt="Image"
        img-top
        img-height="250px"
        img-width="150px"
        class="m-3 list-item"
        border-variant="info"
        @click="edit(list.id)"
      >
        <b>
          <div
            v-if="checkExpire(list.expiredAt)"
            style="color: red; font-size: 16px"
          >
            This listing has expired!
          </div>
          <div
            v-else-if="isSoldOut(list.quantity)"
            style="color: red; font-size: 16px"
          >
            This listing is sold out!
          </div>
        </b>
        <b-card-text>
          ${{ list.price }} per {{ list.unit }}
          <br>
          {{ wrapText(list.description) }}
          <br>
          <small>Created Date:
            {{ convertTimestamp(list.createdAt) }}</small>
          <br>
          <small>Expiry Date:
            {{ convertTimestamp(list.expiredAt) }}</small>
        </b-card-text>
        <b-icon-heart-fill style="color: red" />
        <span>
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-row>
  </div>
</template>

<script>
import { store } from '@/stores';
import { getListingBySeller } from '@/services/list.service';
import { router } from '@/routes';
import SortModal from '@/components/SortModal';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { convertTimestamp, getCurrentTimestamp } from '@/services/utils.service';

export default {
  name: 'SListDetailPage',
  components: { SortModal },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    listing() {
      return store.getters.getFilteredList;
    },
  },

  watch: {
    content(newQuery) {
      this.content = newQuery;
      this.sanitizeQuery();
      store.dispatch('setFilter', { ...store.getters.getFilter, nameSubstring: this.content });
      store.dispatch('filterList');
    },
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getListingBySeller(store.getters.getProfileId);
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');
    loader.hide();
  },

  methods: {
    edit(listId) {
      router.push(`list/detail/${listId}`);
    },

    isSoldOut(quantity) {
      return +quantity === 0 ? true : false;
    },

    sanitizeQuery() {
      this.content = this.content.trim();
    },

    convertTimestamp(timestamp) {
      return timestamp ? convertTimestamp(timestamp) : 'No expiry stated!';
    },

    addListing() {
      router.push('list/add');
    },

    sortListing(order) {
      store.dispatch('setOrder', order);
      store.dispatch('orderList');
    },

    checkExpire(expiredAt) {
      const expired_s = expiredAt.seconds;
      const expired_ns = expiredAt.nanoseconds;
      const curr_s = getCurrentTimestamp().seconds;
      const curr_ns = getCurrentTimestamp().nanoseconds;
      if (expired_s < curr_s || (expired_s == curr_s && expired_ns < curr_ns)) {
        return true;
      } else {
        return false;
      }
    },

    wrapText(text) {
      return text ? `${text.substring(0, 40)}...` : '';
    },
  },
};
</script>

<style scoped>

.list-item {
  width: 20%;
}

.list-item:hover {
  background-color: rgb(243, 250, 251);
  cursor: pointer;
}

</style>
