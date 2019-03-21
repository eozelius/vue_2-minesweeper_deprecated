<template>
  <div class="board-container">
    <!-- Left aside -->
    <aside class="details-container">
      <div class="mines-remaining">
        <h5>Mines Remaining: {{ mines }}</h5>
        <h5>Safe Cells: {{ safeCells }}</h5>
      </div>

      <reset
        :errors="errors"
        :reset-board="generateBoard"
        :valid-board="validBoard"
      />
    </aside>

    <!-- Board -->
    <main class="gameplay-container">
      <h1>Minesweeper</h1>

      <div v-if="gameOver" class="you-lost-container">
        <img src="../images/lost.png" alt="You Lose!" />

        <p>You Lose!</p>
      </div>

      <div v-else class="timer-container">
        <img
          class="stopwatch"
          src="../images/stopwatch.png"
          alt="stopwatch icon"
        />
        <p class="elapsed-time">{{ elapsedTime }}</p>
      </div>

      <div class="row" v-for="(row, i) in board" :key="i">
        <div class="col" v-for="(col, j) in row" :key="j">
          <Cell
            :mine="col.mine"
            :flag="col.flag"
            :active="col.active"
            :reveal="col.reveal"
            :row="i"
            :col="j"
            :border-mines="col.borderMines"
            v-on:cell-clicked="handleClick"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Cell from "@/components/Cell.vue";
import Reset from "@/components/Reset.vue";
import { clearInterval, setInterval } from "timers";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Board",
  data: () => {
    return {
      board: [],
      rows: 4,
      cols: 4,
      mines: 5,
      safeCells: 11,
      timerInterval: null,
      errors: []
    };
  },

  props: {
    gameActive: {
      type: Boolean,
      default: false
    },
    gameOver: {
      type: Boolean,
      default: false
    },

    // Callbacks
    startGame: {
      type: Function,
      default: () => {}
    },
    resetGame: {
      type: Function,
      default: () => {}
    },
    winGame: {
      type: Function,
      default: () => {}
    },
    loseGame: {
      type: Function,
      default: () => {}
    }
  },

  mounted() {
    this.generateBoard(this.rows, this.cols, this.mines);
  },

  computed: mapState({
    elapsedTime: state => state.timer.elapsedTime
  }),

  methods: {
    ...mapMutations([
      "setStartTime",
      "incrementTime",
      "resetTimer"
    ]),

    generateBoard(rows = this.rows, cols = this.cols, mines = this.mines) {
      if (!this.validBoard(rows, cols, mines)) {
        return false;
      }

      this.rows = rows;
      this.cols = cols;
      this.mines = mines;
      this.safeCells = rows * cols - mines;
      this.board.splice(0, this.board.length);

      // Helper function to return a list of cells that do not have a mine place in them.
      const getAvailableCells = () => {
        const availableCells = [];
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (!this.board[i][j].mine) {
              availableCells.push([i, j]);
            }
          }
        }
        return availableCells;
      };

      const randomNum = max => Math.floor(Math.random() * Math.floor(max));

      // Initialize board to entirely empty but active cells
      for (let r = 0; r < rows; r++) {
        this.$set(this.board, r, []);
        for (let c = 0; c < cols; c++) {
          this.$set(this.board[r], c, {
            mine: false,
            active: true,
            borderMines: 0,
            flag: false,
            reveal: false
          });
        }
      }

      // Place mines
      for (let m = 0; m < mines; m++) {
        const availableCells = getAvailableCells();
        const num = randomNum(availableCells.length);
        const cell = availableCells[num];
        const row = cell[0];
        const col = cell[1];
        this.$set(this.board[row][col], "mine", true);
      }

      // Determine Border Mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (!this.board[i][j].mine) {
            continue;
          }

          // North
          if (i - 1 >= 0) {
            const neighbor = this.board[i - 1][j];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // NorthEast
          if (i - 1 >= 0 && j + 1 < cols) {
            const neighbor = this.board[i - 1][j + 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // East
          if (j + 1 < cols) {
            const neighbor = this.board[i][j + 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // SouthEast
          if (i + 1 < rows && j + 1 < cols) {
            const neighbor = this.board[i + 1][j + 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // South
          if (i + 1 < rows) {
            const neighbor = this.board[i + 1][j];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // SouthWest
          if (i + 1 < rows && j - 1 >= 0) {
            const neighbor = this.board[i + 1][j - 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // West
          if (j - 1 >= 0) {
            const neighbor = this.board[i][j - 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }

          // NorthWest
          if (i - 1 >= 0 && j - 1 >= 0) {
            const neighbor = this.board[i - 1][j - 1];
            const mines = neighbor.borderMines + 1;
            this.$set(neighbor, "borderMines", mines);
          }
        }
      }
      this.resetGame();
      this.pauseTimer();
      this.resetTimer();
    },

    isGameWon() {
      if (this.safeCells === 0 && this.allMinesFlagged()) {
        this.pauseTimer();
        this.winGame();
        return true;
      } else {
        return false;
      }
    },

    handleFlagClick(row, col) {
      // Removing Flag
      if (this.board[row][col].flag) {
        this.$set(this.board[row][col], "flag", false);
        this.$set(this.board[row][col], "active", true);
        this.mines++;
        return;
      }

      // Replace a number with a flag
      if (!this.board[row][col].active) {
        this.$set(this.board[row][col], "flag", true);
        this.mines--;
        this.safeCells++;
        return;
      }

      this.$set(this.board[row][col], "flag", true);
      this.$set(this.board[row][col], "active", false);
      this.mines--;
      this.isGameWon();
    },

    handleClick(row, col, flag) {
      // First Click
      if (this.allCellsActive()) {
        this.startGame();
        this.startTimer();
      }

      if (this.gameOver) {
        return;
      }

      if (flag) {
        this.handleFlagClick(row, col);
        return;
      }

      // this cell has already been clicked
      if (!this.board[row][col].active) {
        return false;
      }

      // Set Cell to Inactive
      this.$set(this.board[row][col], "active", false);
      this.safeCells--;

      // Triggered a mine
      if (this.board[row][col].mine) {
        this.loseGame();
        this.revealMines();
        this.pauseTimer();
        return;
      }

      this.isGameWon();
    },

    startTimer() {
      this.setStartTime()
      this.timerInterval = setInterval(() => this.incrementTime(), 1000);
    },

    pauseTimer() {
      clearInterval(this.timerInterval);
    },

    validBoard(rows = this.rows, cols = this.cols, mines = this.mines) {
      this.errors = [];

      if (isNaN(rows)) {
        this.errors.push("Rows is not a number.");
      }

      if (isNaN(cols)) {
        this.errors.push("Columns is not a number.");
      }

      if (isNaN(mines)) {
        this.errors.push("Mines is not a number.");
      }

      if (mines >= rows * cols) {
        this.errors.push("Mines cannot outnumber Cells.");
      }

      if (mines <= 0) {
        this.errors.push("Mines must be greater than zero.");
      }

      if (rows <= 0) {
        this.errors.push("Rows must be greater than zero.");
      }

      if (cols <= 0) {
        this.errors.push("Columns must be greater than zero.");
      }

      return this.errors.length === 0 ? true : false;
    },

    allMinesFlagged() {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.board[r][c].mine && !this.board[r][c].flag) {
            return false;
          }
        }
      }
      return true;
    },

    allCellsActive() {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!this.board[r][c].active) {
            return false;
          }
        }
      }
      return true;
    },

    revealMines() {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          this.$set(this.board[r][c], "reveal", true);
        }
      }
    }
  },

  components: {
    Cell,
    Reset
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/reset";

.board-container {
  width: 75%;
  border: 1px solid #ccc;
  margin: 3% auto 5%;
  padding: 1% 2% 5%;
}

.details-container {
  width: 24%;
  display: inline-block;
  vertical-align: top;
}

.gameplay-container {
  width: 74%;
  display: inline-block;
  vertical-align: top;
}

.row {
  display: flex;
  justify-content: center;
}

.you-lost-container {
  height: 56px;

  img {
    width: 50px;
    height: 50px;
  }

  p {
    display: inline-block;
    vertical-align: bottom;
    margin: 0;
    font-weight: 400;
    line-height: 55px;
  }
}

.timer-container {
  height: 56px;

  .stopwatch {
    width: 50px;
    height: 50px;
  }

  .elapsed-time {
    display: inline-block;
    vertical-align: bottom;
    margin: 0;
    line-height: 55px;
  }
}
</style>
