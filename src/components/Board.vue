<template>
  <div class="board-container">
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
</template>

<script>
import Cell from "@/components/Cell.vue";

export default {
  name: "Board",
  data: () => {
    return {
      title: "Minesweeper",
      board: []
    };
  },

  mounted() {
    this.generateBoard(6, 6, 5);
  },

  methods: {
    randomNum: max => {
      // return a random number between 0 and max inclusively
      return Math.floor(Math.random() * Math.floor(max));
    },

    generateBoard(rows, cols, mines) {
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
      this.$set(this.board[row][col], "active", false);
    }
  },

  components: {
    Cell
  }
};
</script>

<style lang="scss" scoped>
.board-container {
  width: 50%;
  border: 1px solid #ccc;
  margin: 3% auto 5%;
  padding: 1% 2% 5%;
}

.row {
  display: flex;
}

.col {
  flex-grow: 1;
}
</style>
