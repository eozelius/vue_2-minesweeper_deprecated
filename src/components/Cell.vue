<template>
  <div
    :class="{ 'cell-container': true, active: active, flag: flag }"
    @click="emitCellClicked"
  >
    <!-- <p v-if="mine" class="mine">X</p> -->
    <p v-if="!active && !flag">{{ borderMines }}</p>
  </div>
</template>

<script>
export default {
  name: "minesweeper-Cell",

  props: {
    mine: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    },
    row: {
      type: Number,
      default: 0
    },
    col: {
      type: Number,
      default: 0
    },
    borderMines: {
      type: Number,
      default: 0
    },
    flag: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    emitCellClicked(e) {
      const flag = e.altKey ? true : false;
      this.$emit("cell-clicked", this.row, this.col, flag);
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-container {
  width: 55px;
  height: 50px;
  border: 1px solid #ccc;
  background: #8f8f8f;
  font-weight: bold;
  cursor: pointer;
}

p {
  font-size: 20px;
  color: #fff;
  line-height: 50px;
  margin: 0;
}

.cell-container.active {
  border: 1px solid #ccc;
}

.mine {
  color: red;
  font-weight: bold;
  margin: 0 5px;
}

.flag {
  background-image: url("../assets/flag-icon.png");
  background-repeat: no-repeat;
  background-size: 35px 35px;
  background-position: center;
}
</style>
