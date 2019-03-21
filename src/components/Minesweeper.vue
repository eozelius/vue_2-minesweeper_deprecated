<template>
  <div class="game-component">
    <Board
      :start-game="startGame"
      :reset-game="resetGame"
      :lose-game="loseGame"
      :win-game="winGame"
      :game-active="gameActive"
      :game-over="youLost"
    />

    <HighScores
      :show-high-scores-modal="showHighScoresModal"
      :dismiss-high-scores-modal="dismissHighScoresModal"
    />
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import HighScores from "@/components/HighScores.vue";

export default {
  name: "Minesweeper",

  props: {},

  data: () => {
    return {
      gameActive: false,
      youLost: false,

      // HighScores
      showHighScoresModal: false,
    };
  },

  methods: {
    startGame() {
      this.gameActive = true;
    },

    resetGame() {
      this.gameActive = false;
      this.youLost = false;
    },

    loseGame() {
      this.gameActive = false;
      this.youLost = true;
    },

    winGame() {
      this.gameActive = false;
      this.revealHighScoresModal();
    },

    revealHighScoresModal() {
      this.showHighScoresModal = true;
    },

    dismissHighScoresModal() {
      this.showHighScoresModal = false;
    },
  },

  components: {
    Board,
    HighScores
  }
};
</script>
