<template>
  <div class="home">
    <Minesweeper />
  </div>
</template>

<script>
import Minesweeper from "@/components/Minesweeper.vue";

export default {
  name: "home",
  components: {
    Minesweeper
  }
};
</script>
