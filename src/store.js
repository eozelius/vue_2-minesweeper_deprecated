import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timer: {
      startTime: 0,
      elapsedTime: 0
    }
  },
  mutations: {
    setStartTime(state) {
      state.timer.startTime = Date.now();
    },
    incrementTime(state) {
      const elapsed = new Date(Date.now() - state.timer.startTime).getSeconds();
      state.timer.elapsedTime = elapsed;
    },
    resetTimer(state) {
      state.timer.startTime = 0;
      state.timer.elapsedTime = 0;
    }
  },
  actions: {}
});
