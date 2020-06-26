import axios from "axios";

const url = "https://minesweeper-highscores.ethanoz.com";

export default {
  async getHighScores() {
    try {
      const { data: response } = await axios.get(`${url}/high-scores`);

      return response.map(score => JSON.parse(score));
    } catch (error) {
      console.error("[ Api.js ] Error fetching HighScores => ", error);
      return [];
    }
  },

  async saveHighScore({ name, time, score }) {
    console.log("saveHighScore()");
    try {
      await axios.post(`${url}/save-high-score`, {
        name,
        time,
        score
      });
    } catch (e) {
      console.error("failed e => ", e);
    }
  }
};
