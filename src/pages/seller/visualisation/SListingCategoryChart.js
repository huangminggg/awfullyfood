
import { Doughnut } from 'vue-chartjs';
import database from '../../../firebase.js';

export default {
  extends: Doughnut,
  data() {
    return {
      datacollection: {
        labels: ['Ugly', 'Expiring'],
        datasets: [{
          label: 'Number of Listings per Category',
          backgroundColor: ['', ''],
          data: [0, 0],
        }],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Number of Listings per Category',
        },
        responsive: true,
        maintainAspectRatio: false,

      },
    };
  },
  methods: {
    fetchItems() {

      database.collection('listings').get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          // console.log(doc.data())
          for (const key of Object.entries(doc.data()).sort()) {
            // console.log(key)
            if (key[1] == 'Ugly') {
              this.datacollection.datasets[0].data[0] += 1;
              this.datacollection.datasets[0].backgroundColor[0] = this.getRandomColour();
            } else if (key[1] == 'Expired') {
              this.datacollection.datasets[0].data[1] += 1;
              this.datacollection.datasets[0].backgroundColor[1] = this.getRandomColour();
            }
          }

        });
        this.renderChart(this.datacollection, this.options);
      });
    },

    getRandomColour() {
      const letters = '0123456789ABCDEF'.split('');
      let colour = '#';
      for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
      }
      return colour;

    },

    logmsg(msg) {
      console.log(msg);
    },

  },
  created() {
    this.fetchItems();
  },
};
