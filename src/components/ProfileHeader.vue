<template>
  <b-navbar-nav class="ml-auto">
    <b-nav-item-dropdown right>
      <template #button-content>
        <em>Welcome, {{ name }}!</em>
      </template>
      <b-dropdown-item to="/profile">
        My Profile
      </b-dropdown-item>
      <b-dropdown-item @click="signOut()">
        Sign Out
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
import { signOut } from '@/services/auth.service';
import { store } from '@/stores';

export default {
  name: 'ProfileHeaderVue',
  computed: {
    name() {
      return store.getters.getProfileState?.name;
    },
  },
  methods: {
    signOut() {
      signOut();
    },
  },
};
</script>

<style scoped>

</style>
