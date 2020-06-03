<template>
  <div
    :class="{ 'cell-container': true, active: active, flag: flag }"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <div v-if="reavealMine" class="mine">
      <img src="../images/mine.png" alt="mine" />
    </div>
    <p v-if="!active && !flag">{{ borderMines }}</p>
  </div>
</template>

<script>
import isMobile from "@/utils/isMobile";

export default {
  name: "minesweeper-Cell",

  data: function() {
    return {
      longPressCounter: 0,
      longPressInterval: null
    };
  },

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
    emitCellClicked(row, col, flag) {
      this.$emit("cell-clicked", row, col, flag);
    },

    handleClick(e) {
      if (isMobile() || this.longPressCounter) {
        return;
      }
      const flag = this.isMarkingFlag(e);
      this.emitCellClicked(this.row, this.col, flag);
    },

    handleTouchStart() {
      if (!isMobile()) {
        return false;
      }
      this.longPressInterval = setInterval(() => {
        this.longPressCounter += 10;
      }, 10);
    },

    handleTouchEnd() {
      if (!isMobile()) {
        return false;
      }
      clearInterval(this.longPressInterval);
      const flag = this.longPressCounter > 130;
      this.emitCellClicked(this.row, this.col, flag);
      this.longPressCounter = 0;
    },

    isMarkingFlag(e) {
      return (
        e.altKey ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey || // Cmd or Windows key
        e.shiftKey
      );
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
  background-image: url("../images/flag.png");
  background-repeat: no-repeat;
  background-size: 35px 35px;
  background-position: center;
}
</style>
