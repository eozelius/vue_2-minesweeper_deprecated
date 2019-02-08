<template>
  <div
    :class="{ 'cell-container': true, active: active }"
    @click="emitCellClicked"
  >
    <span v-if="value === 'x'">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: "minesweeper-cell",

  props: {
    value: {
      type: String,
      default: "_"
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
    }
  },

  methods: {
    emitCellClicked() {
      this.$emit("cell-clicked", this.row, this.col);
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-container {
  width: 95%;
  margin: 5px auto;
  height: 50px;
  border: 1px solid red;
  cursor: pointer;
}

span {
  font-size: 17px;
  font-weight: 400;
}

.cell-container.active {
  border: 1px solid #ccc;
}

.mine {
  color: red;
  font-weight: bold;
}
</style>
