<template>
  <div class="game-component">
    <Board
      :start-game="startGame"
      :reset-game="resetGame"
      :lose-game="loseGame"
      :win-game="winGame"
      :game-active="gameActive"
      :game-over="isGameOver"
    />

    <HighScores
      :show-high-scores-modal="showHighScoresModal"
      :dismiss-high-scores-modal="dismissHighScoresModal"
      :mine-density="mineDensity"
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
      youWon: false,
      mineDensity: 0,

      // HighScores
      showHighScoresModal: false
    };
  },

  computed: {
    isGameOver: function() {
      return this.youLost || this.youWon;
    }
  },

  methods: {
    startGame() {
      this.gameActive = true;
    },

    resetGame() {
      this.gameActive = false;
      this.youLost = false;
      this.youlost = false;
      this.youWon = false;
    },

    loseGame() {
      this.gameActive = false;
      this.youLost = true;
    },

    winGame(mineDensity) {
      this.mineDensity = mineDensity;
      this.gameActive = false;
      this.youWon = true;
      this.revealHighScoresModal();
    },

    revealHighScoresModal() {
      this.showHighScoresModal = true;
    },

    dismissHighScoresModal() {
      this.showHighScoresModal = false;
    }
  },

  components: {
    Board,
    HighScores
  }
};
</script>
