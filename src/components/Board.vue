<template>
  <div class="board-container">
    <div class="details-container">
      <div class="mines-remaining">
        <h3>Mines Remaining: {{ mines }}</h3>
      </div>

      <div class="reset-container">
        <div class="errors-container">
          <ul class="errors">
            <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
          </ul>
        </div>

        <!-- Rows -->
        <label for="rows">Rows</label>
        <input v-model="rows" name="cols" type="text" />

        <!-- Columns -->
        <label for="cols">Columns</label>
        <input v-model="cols" name="rows" type="text" />

        <!-- Mines -->
        <label for="mines">Mines</label>
        <input v-model="mines" name="mines" type="text" />

        <button @click="resetGame">Reset</button>
      </div>
    </div>

    <div class="gameplay-container">
      <h1>{{ title }}</h1>
      <div class="row" v-for="(row, i) in board" :key="i">
        <div class="col" v-for="(col, j) in row" :key="j">
          <Cell
            :value="col.value"
            :active="col.active"
            :row="i"
            :col="j"
            v-on:cell-clicked="handleClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cell from "@/components/Cell.vue";

export default {
  name: "Board",
  data: () => {
    return {
      title: "Minesweeper",
      board: [],
      rows: 3,
      cols: 3,
      mines: 5,
      safeCells: 20,
      errors: []
    };
  },

  mounted() {
    this.generateBoard(this.rows, this.cols, this.mines);
  },

  methods: {
    randomNum: max => {
      // return a random number between 0 and max inclusively
      return Math.floor(Math.random() * Math.floor(max));
    },

    generateBoard(rows = this.rows, cols = this.cols, mines = this.mines) {
      if (!this.validGame()) {
        return;
      }

      this.safeCells = rows * cols - mines;

      const getAvailableCells = () => {
        const availableCells = [];
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (this.board[i][j].value === "_") {
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
            value: "_",
            active: true
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
        this.$set(this.board[row][col], "value", "x");
      }
    },

    handleClick(row, col) {
      // this cell has already been clicked
      if (this.board[row][col].active === false) {
        return false;
      } else {
        this.$set(this.board[row][col], "active", false);
      }

      // Triggered a mine
      if (this.board[row][col].value === "x") {
        alert("you lose!!");
        this.resetGame();
      } else {
        this.safeCells--;
      }

      // Game won?
      if (this.safeCells === 0) {
        alert("you will!!");
        this.resetGame();
      }
    },

    resetGame() {
      if (!this.validGame()) {
        return;
      }
      this.board = [];
      this.generateBoard(this.rows, this.col, this.mines);
    },

    validGame() {
      this.errors = [];

      if (this.mines >= this.rows * this.cols) {
        this.errors.push("Error: Mines cannot outnumber Cells.");
      }

      if (this.rows <= 0) {
        this.errors.push("Error: Rows must be greater than zero.");
      }

      if (this.cols <= 0) {
        this.errors.push("Error: Columns must be greater than zero.");
      }

      return this.errors.length === 0 ? true : false;
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
}

.col {
  flex-grow: 1;
}

.reset-container {
  padding: 0 0 5%;

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
</style>
