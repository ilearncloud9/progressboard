import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js'

const histogramslider = window['histogram-slider']

Vue.component(histogramslider.name, histogramslider)
Vue.component("vue-slider", histogramslider)


const formatDate = (d) => {
  return new Date(d).toISOString().split('T')[0]
}

console.log("Slider", histogramslider)

const app = new Vue({
  el: "#vue-main",
  delimiters: ['[[', ']]'],
  compilerOptions: {
    delimiters: ["[[", "]]"]
  },
  components: {
    [histogramslider.name]: histogramslider,
    "vue-slider": histogramslider,
    // test: Counter,
  },
  data() {

    return {
      loading: true,
      repos: [],
      commits_per_day: [],
      min_day: new Date(),
      max_day: new Date(),
      prettify: function(ts) {
        return new Date(ts).toLocaleDateString("en", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    goToPage(url) {
      window.open(url, '_blank');
    },
    updateRange(e) {
      const start = new Date(e.from)
      const end = new Date(e.to)
      this.loadData(formatDate(start), formatDate(end))

    },
    loadData(start, end) {
      axios.get('/api/v1/repos', {params: {
        start_date: start,
        end_date: end,
      }}).then(resp => {
        this.repos = resp.data;
  
        this.commits_per_day = resp.data.reduce((arr, repo) => [...arr, ...repo.commits], [])
                .map(commit => commit.commit.author.date)
                .map(date => new Date(date))
        const sorted_days = this.commits_per_day.sort((a, b) => a < b ? -1 : 1)
        this.min_day = sorted_days[0]
        this.max_day = sorted_days[sorted_days.length - 1]
        this.loading = false

      })
    },
  },
  components: {
  },
});

