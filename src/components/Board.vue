<template>
  <div class="board-container">
    <h1>{{ title }}</h1>
    <div class="row" v-for="(row, i) in board" :key="i">
      <div class="col" v-for="(col, j) in row" :key="j">
        {{ col }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Board",
  data: () => {
    return {
      title: "Minesweeper",
      board: []
    };
  },

  mounted() {
    this.generateBoard(9, 9, 15);
  },

  methods: {
    randomNum: max => {
      return Math.floor(Math.random() * Math.floor(max));
    },

    generateBoard(rows, cols, mines) {
      // Initialize board to empty
      for (let r = 0; r < rows; r++) {
        this.board.push(new Array(cols).fill("_"));
      }

      // Place mines
      do {
        const row = this.randomNum(rows);
        const col = this.randomNum(cols);

        if (this.board[row][col] === "x") {
          continue;
        } else {
          this.board[row][col] = "x";
          mines = mines - 1;
        }
      } while (mines > 0);
    }
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
