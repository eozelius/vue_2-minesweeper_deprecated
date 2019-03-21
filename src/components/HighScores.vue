<template>
  <div id="high-scores-component">
    <div class="high-scores-container">
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
    </div>

    <div v-if="showHighScoresModal" class="high-score-modal-container">
      <div class="high-score-modal">
        <div>
          <h1>Winner!</h1>
          <h3>Add your name to the High Scores List!</h3>
          <input v-model="newHighScoreName" type="text" name="high-score" />

          <div class="btns-container">
            <button class="canel-high-score canel" @click="dismissModal">
              Canel
            </button>
            <button class="save-high-score" @click="handleSave">
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
import { mapState } from "vuex";

export default {
  name: "Minesweeper-High-Scores",
  data: () => {
    return {
      highScores: [],
      newHighScoreName: "",
    };
  },

  props: {
    showHighScoresModal: {
      type: Boolean,
      default: false
    },
    dismissHighScoresModal: {
      type: Function,
      default: () => {}
    }
  },

  computed: mapState({
    elapsedTime: state => state.timer.elapsedTime
  }),

  methods: {
    submitHighScore(name, time) {      
      if (!name || !time) {
        return;
      }

      this.highScores = this.highScores
        .concat({
          name,
          time
        })
        .sort((a, b) => a.time - b.time);
    },

    handleSave() {
      this.submitHighScore(this.newHighScoreName, this.elapsedTime);
      this.dismissModal();
    },

    dismissModal() {
      this.dismissHighScoresModal();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/reset";

#high-scores-component {
  width: 50%;
  margin: 2% auto;
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

  button {
    margin: 0 5px;
  }
}

table {
  width: 100%;
  padding: 1% 2% 3%;
}
</style>
