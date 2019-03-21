<template>
  <div class="time-container">
    <img
      class="stopwatch"
      src="../images/stopwatch.png"
      alt="stopwatch icon"
    />
    <p class="elapsed-time">{{ elapsedTime }}</p>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import HighScores from "@/components/HighScores.vue";

export default {
  name: "Timer",

  props: {
    
  },

  data: () => {
    return {
    };
  },

  methods: {

    startTimer() {
      console.log("TODO Minesweeper.vue::startTimer: ");
      // this.startTime = Date.now();
      // this.timerInterval = setInterval(() => {
      //   const elapsed = new Date(Date.now() - this.startTime);
      //   this.elapsedTime = elapsed.getSeconds();
      // }, 1000);
    },

    pauseTimer() {
      console.log("TODO Minesweeper.vue::pauseTimer: ");
      // clearInterval(this.timerInterval);
    }
  }
};
</script>

<style lang="scss" scoped></style>
