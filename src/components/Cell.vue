<template>
  <div
    :class="{ 'cell-container': true, active: active, flag: flag }"
    @click="emitCellClicked"
  >
    <div v-if="reavealMine" class="mine">
      <img src="../images/mine.png" alt="mine" />
    </div>
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
    },
    reveal: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    reavealMine() {
      return this.mine && this.reveal && !this.flag;
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
  height: 50px;

  img {
    width: 54px;
    height: 54px;
  }
}

.flag {
  background-image: url("../images/flag-icon.png");
  background-repeat: no-repeat;
  background-size: 35px 35px;
  background-position: center;
}
</style>
