<template>
  <div>
    <b-button
      v-b-modal.filter
      variant="info"
      class="mr-2"
    >
      Filter
    </b-button>
    <b-modal
      id="filter"
      v-model="show"
      centered
      title="Filters"
    >
      <div class="modal-content">
        <b-form class="modal-body">
          <b-form-group label="Item Category:">
            <b-form-checkbox-group
              v-model="form.category"
              :options="categories"
              :values="categories"
            />
          </b-form-group>
          <b-form-group label="Date Posted">
            <b-form-radio-group
              v-model="form.datePosted"
              :options="dateOptions"
            />
          </b-form-group>
        </b-form>
      </div>
      <template v-slot:modal-footer>
        <b-button
          variant="info"
          @click="onReset"
        >
          Reset
        </b-button>
        <b-button
          variant="info"
          @click="onSubmit"
        >
          Show Results
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'BrowseModalVue',
  data() {
    return {
      show: false,
      form: {
        category: ['Ugly', 'Expiring'],
        datePosted: 0,
      },
      categories: ['Ugly', 'Expiring'],
      dateOptions: [
        { text: 'Anytime', value: 0 },
        { text: 'Past 24 Hours', value: 86400 },
        { text: 'Past Week', value: 7 * 86400 },
        { text: 'Past 2 Weeks', value: 14 * 86400 },
        { text: 'Past Month', value: 30 * 86400 },
      ],
    };
  },
  methods: {
    onSubmit() {
      this.show = false;
      this.filterListing();
    },

    onReset() {
      this.form = { category: ['Ugly', 'Expiring'], datePosted: 0 };
    },

    filterListing() {
      const res = this.sanitizeForm();
      this.$emit('filterListing', res);
    },

    sanitizeForm() {
      const output = {};
      if (this.form.datePosted) {
        output.datePosted = this.form.datePosted;
      }
      output.itemCategory = this.form.category;
      return output;
    },
  },
};
</script>

<style scoped>

</style>
