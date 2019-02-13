<template>
  <div class="board-container">
    <!-- Left aside -->
    <aside class="details-container">
      <div class="mines-remaining">
        <h3>Mines Remaining: {{ mines }}</h3>
        <h3>Safe Cells: {{ safeCells }}</h3>
      </div>

      <div class="reset-container">
        <div class="errors-container">
          <ul class="errors">
            <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
          </ul>
        </div>

        <!-- Rows -->
        <label for="rows">Rows</label>
        <input v-model="resetRows" name="reset-rows" type="text" />

        <!-- Columns -->
        <label for="cols">Columns</label>
        <input v-model="resetCols" name="reset-cols" type="text" />

        <!-- Mines -->
        <label for="mines">Mines</label>
        <input v-model="resetMines" name="reset-mines" type="text" />

        <button @click="resetGame">Reset</button>
      </div>
    </aside>

    <!-- Board -->
    <main class="gameplay-container">
      <h1>Minesweeper</h1>

      <div v-if="youLost" class="you-lost-container">
        <img src="../assets/lost.png" alt="You Lose!" />

        <p>You Lose!</p>
      </div>

      <div v-if="!youLost" class="timer-container">
        <img
          class="stopwatch"
          src="../assets/stopwatch.png"
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

    <!-- High Scores -->
    <aside class="high-scores-container">
      <h1>High Scores</h1>
      <table v-if="highScores.length > 0">
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Time</th>
        </tr>

        <tr
          class="high-score"
          v-for="(score, index) in highScores"
          :key="index"
        >
          <td>{{ index + 1 }}.</td>
          <td>{{ score.name }}</td>
          <td>{{ score.time }}</td>
        </tr>
      </table>
    </aside>

    <!-- High Score Modal -->
    <div v-if="showHighScoresModal" class="high-score-modal-container">
      <div class="high-score-modal">
        <div>
          <h1>Winner!</h1>
          <h3>Add your name to the High Scores List!</h3>
          <input v-model="newHighScoreName" type="text" name="high-score" />

          <div class="btns-container">
            <button class="canel-high-score canel" @click="this.dismissModal">
              Canel
            </button>
            <button class="save-high-score" @click="this.handleHighScoreSave">
              Save
            </button>
          </div>
        </div>
      </div>
      <div class="overlay"></div>
    </div>
  </div>
</template>

<script>
import Cell from "@/components/Cell.vue";
import { clearInterval, setInterval } from "timers";

export default {
  name: "Minesweeper-Board",
  data: () => {
    return {
      board: [],
      rows: 4,
      cols: 4,
      mines: 5,
      resetRows: 4,
      resetCols: 4,
      resetMines: 5,
      safeCells: 2,
      startTime: 0,
      elapsedTime: 0,
      timerInterval: null,
      gameActive: false,
      errors: [],
      highScores: [],
      showHighScoresModal: false,
      newHighScoreName: "",
      youLost: false
    };
  },

  mounted() {
    this.generateBoard(this.rows, this.cols, this.mines);
  },

  watch: {
    resetRows: function(newRows) {
      if (this.validGame(newRows, this.resetCols, this.resetMines)) {
        this.resetRows = parseInt(newRows);
      }
    },

    resetCols: function(newCols) {
      if (this.validGame(this.resetRows, newCols, this.resetMines)) {
        this.resetCols = parseInt(newCols);
      }
    },

    resetMines: function(newMines) {
      if (this.validGame(this.resetRows, this.resetCols, newMines)) {
        this.resetMines = parseInt(newMines);
      }
    }
  },

  methods: {
    randomNum: max => {
      // return a random number between 0 and max inclusively
      return Math.floor(Math.random() * Math.floor(max));
    },

    generateBoard(rows = this.rows, cols = this.cols, mines = this.mines) {
      if (!this.validGame(rows, cols, mines)) {
        return false;
      }

      this.rows = rows;
      this.cols = cols;
      this.mines = mines;

      // calculate number of cells that are not mines.
      this.safeCells = rows * cols - mines;

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
        const randomNum = this.randomNum(availableCells.length);
        const cell = availableCells[randomNum];
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
      this.gameWon();
    },

    handleClick(row, col, flag) {
      // First Click
      if (this.allCellsActive()) {
        this.startGame();
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
        this.youLost = true;
        this.gameActive = false;
        this.revealMines();
        this.pauseTimer();
        return;
      }

      this.gameWon();
    },

    startGame() {
      this.gameActive = true;
      this.youLost = false;
      this.startTimer();
    },

    startTimer() {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => {
        const elapsed = new Date(Date.now() - this.startTime);
        this.elapsedTime = elapsed.getSeconds();
      }, 1000);
    },

    pauseTimer() {
      clearInterval(this.timerInterval);
    },

    resetGame() {
      if (!this.validGame(this.resetRows, this.resetCols, this.resetMines)) {
        return;
      }
      this.youLost = false;
      this.elapsedTime = 0;
      this.startTime = 0;
      clearInterval(this.timerInterval);
      this.board = [];
      this.generateBoard(this.resetRows, this.resetCols, this.resetMines);
    },

    validGame(rows, cols, mines) {
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

    gameWon() {
      if (this.safeCells === 0 && this.allMinesFlagged()) {
        this.gameActive = false;
        this.pauseTimer();
        this.revealModal();
        return true;
      } else {
        return false;
      }
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
    },

    submitHighScore(name, time) {
      this.highScores = this.highScores
        .concat({
          name,
          time
        })
        .sort((a, b) => a.time - b.time);
    },

    revealModal() {
      this.showHighScoresModal = true;
    },

    dismissModal() {
      this.showHighScoresModal = false;
    },

    handleHighScoreSave() {
      this.submitHighScore(this.newHighScoreName, this.elapsedTime);
      this.dismissModal();
    }
  },

  components: {
    Cell
  }
};
</script>

<style lang="scss" scoped>
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

.reset-container {
  padding: 5% 0 10%;
  border: 1px solid #ccc;

  .errors-container {
    ul {
      list-style-type: none;
    }

    li {
      text-align: left;
      color: maroon;
      font-weight: 400;
      margin-bottom: 10px;
    }
  }
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
    font-size: 22px;
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
    font-size: 22px;
    margin: 0;
    font-weight: 400;
    line-height: 55px;
  }
}
.high-scores-container {
  width: 90%;
  min-height: 200px;
  margin: 5% auto 5%;
}

.high-score-modal-container {
  .high-score-modal {
    position: fixed;
    top: 15%;
    left: 25%;
    right: 25%;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ccc;
    z-index: 1;
    opacity: 1;
  }

  .btns-container {
    width: 50%;
    display: flex;
    margin: 15% auto;
  }

  .overlay {
    position: fixed;
    top: -1%;
    left: -1%;
    right: -1%;
    bottom: -1%;
    background-color: #ddd;
    opacity: 0.8;
    z-index: 0;
  }
}

button {
  margin: 10% auto 5%;
  width: 150px;
  height: 30px;
  background-color: aliceblue;
  border-radius: 3px;
  cursor: pointer;
  font-size: 15px;
  line-height: 15px;
}

button.canel {
  background-color: transparent;
  border: 1px solid rgb(87, 0, 0);
}

h1 {
  margin-bottom: 1%;
}

table {
  width: 100%;
  padding: 1% 2% 3%;
}

label {
  display: block;
  font-size: 18px;
}

input[type="text"] {
  width: 50%;
  height: 25px;
  margin: 1% auto 5%;
  display: block;
  padding: 1% 2%;
  font-size: 15px;
}
</style>
