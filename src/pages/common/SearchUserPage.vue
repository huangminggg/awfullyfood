<template>
    <b-container fluid class="p-4 bg-light">
        <b-row class="mx-2">
          <b-input-group>
            <b-form-input
                v-model="userId"
                placeholder="Enter User ID">
            </b-form-input>
            <b-button class="ml-2" variant="outline-info" @click="submitParam()">Search</b-button>
          </b-input-group>
        </b-row>
      <hr/>
      <b-collapse id="collapse-1" class="mt-2">
        <b-row class="my-5" v-show="found == false">
          <b-card-text class="ml-4">
            User Not Found, please try again!
          </b-card-text>
        </b-row>

        <div v-show="found">
          <b-row class="my-5">
              <b-img class="border-info profile-photo" thumbnail width=400 height=400 fluid :src="photo" alt="Display Photo">
              </b-img>
            <b-col>
              <b-card-text>
                <b-form-rating v-model="averageRating" readonly show-value precision="2" inline></b-form-rating>
              </b-card-text>
              <b-card-text>
                Email: {{ this.profile.email }}
              </b-card-text>
              <b-card-text>
                Name: {{ this.profile.name }}
              </b-card-text>
              <b-card-text>
                Role: {{ this.profile.role }}
              </b-card-text>
              <b-card-text>
                Number: {{ this.profile.phoneNumber }}
              </b-card-text>
              <b-card-text>
                Address: {{ this.profile.address }}
              </b-card-text>
            </b-col>
          </b-row>
          <hr/>
          <Review v-bind:reviews="reviews"/>
        </div>
      </b-collapse>
    </b-container>
</template>

<script>

import { getUserProfile } from "@/services/user.service";
import { getReviews, getAggregatedRating } from "@/services/review.service";
import { getDisplayPhoto } from "@/services/user.service";
import { isEmptyObject } from "@/services/utils.service";
import { router } from "@/routes";
import Review from "@/components/Review";
export default {
  name: "ProfilePage",
  components: { Review },
  data() {
    return {
      userId: '',
      averageRating: 0,
      profile: {},
      reviews: [],
      photo: '',
      found: false,
      click: false,
    }
  },
  async mounted() {
    this.userId = this.$route.query.userId;
    this.userId ? await this.searchUser() : null;
  },

  watch: {
    '$route.params': async function() {
      await this.searchUser();
    }
  },

  methods: {
    searchUser: async function() {
      if (!this.userId) {
        alert("Please key in user ID you wish to search...");
        return;
      }

      if (!this.click) {
        this.click = true;
        this.$root.$emit('bv::toggle::collapse', 'collapse-1');
      }

      this.profile = await getUserProfile(this.userId, false);
      this.found = !isEmptyObject(this.profile);
      if (this.found) {
        this.photo = await getDisplayPhoto(this.userId);
        this.reviews = await getReviews(this.userId, this.profile?.role);
        this.averageRating = getAggregatedRating(this.reviews);
      }
    },

    submitParam: function() {
      this.userId = this.sanitizeQuery(this.userId);
      const currentRoute = router.currentRoute.query.userId;
      if (currentRoute != this.userId) {
        router.replace({
          query: { userId: this.userId },
        });
      }
    },

    sanitizeQuery: function(userId) {
      return userId.trim();
    }
  }
}
</script>

<style scoped>

profile-photo {
  max-width: 400px;
  max-height: 400px;
}

</style>