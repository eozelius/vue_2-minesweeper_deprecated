import { shallowMount } from "@vue/test-utils";
import { winGame } from "../specHelpers";
import Board from "@/components/Board.vue";

describe("High Scores", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Board);
  });

  describe("High Scores List", () => {
    it("renders a list of high scores", () => {
      expect(wrapper.find(".high-scores-container").exists()).toBe(true);
    });

    it("Adds a new high score to the list.", () => {
      wrapper.vm.highScores = [
        {
          name: "Alberta",
          time: 10
        }
      ];
      expect(wrapper.findAll(".high-score").length).toEqual(1);
    });

    it("Sorts the list by time", () => {
      wrapper.vm.submitHighScore("Super SlowSki Sr.", 215);
      wrapper.vm.submitHighScore("SlowSki Jr.", 105);
      wrapper.vm.submitHighScore("Speedy", 5);
      expect(wrapper.vm.highScores[2].name).toEqual("Super SlowSki Sr.");
      expect(wrapper.vm.highScores[0].name).toEqual("Speedy");
    });
  });

  describe("High Scores Modal", () => {
    it("Activates when the game is won", () => {
      winGame(wrapper);
      wrapper.vm.gameWon();
      expect(wrapper.vm.showHighScoresModal).toEqual(true);
    });

    it("Submits a HighScore", () => {
      winGame(wrapper);
      wrapper.vm.gameWon();
      wrapper.find("input[name='high-score']").setValue("Cool Hand Luke");
      wrapper.find("button.save-high-score").trigger("click");
      expect(wrapper.vm.highScores[0].name).toBe("Cool Hand Luke");
      expect(wrapper.vm.highScores[0].time).toBe(0);
    });

    it("Deactivates when play clicks save", () => {
      winGame(wrapper);
      wrapper.vm.gameWon();
      expect(wrapper.vm.showHighScoresModal).toBe(true);
      wrapper.find("button.canel-high-score").trigger("click");
      expect(wrapper.vm.showHighScoresModal).toBe(false);
    });
  });
});
