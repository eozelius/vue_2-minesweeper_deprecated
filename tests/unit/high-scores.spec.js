import { shallowMount } from "@vue/test-utils";
import HighScores from "@/components/HighScores.vue";

describe("High Scores", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HighScores, {
      propsData: {
        showHighScoresModal: false
      }
    });
    wrapper.vm.highScores = [];
  });

  afterEach(() => {
    wrapper.vm.highScores = [];
  });

  describe("High Scores List", () => {
    it("renders a list of high scores", () => {
      expect(wrapper.find(".high-scores-container").exists()).toBe(true);
    });

    it("Adds a new high score to the list.", () => {
      wrapper.vm.submitHighScore("Alberta", 10);
      expect(wrapper.html()).toContain("Alberta");
    });

    it("Sorts the Scores by time", () => {
      wrapper.vm.highScores = [];
      wrapper.vm.submitHighScore("Super SlowSki Sr.", 215);
      wrapper.vm.submitHighScore("SlowSki Jr.", 105);
      wrapper.vm.submitHighScore("Speedy", 5);
      expect(wrapper.vm.highScores[2].name).toEqual("Super SlowSki Sr.");
      expect(wrapper.vm.highScores[0].name).toEqual("Speedy");
    });
  });

  describe("High Scores Modal", () => {
    it("Activates when passed the 'showHighScoresModal' prop", () => {
      expect(wrapper.find(".high-score-modal-container").exists()).toEqual(false); // eslint-disable-line prettier/prettier
      wrapper.setProps({ showHighScoresModal: true });
      expect(wrapper.find(".high-score-modal-container").exists()).toEqual(true); // eslint-disable-line prettier/prettier
    });

    it("Submits a HighScore", () => {
      wrapper.setProps({ showHighScoresModal: true });
      wrapper.find("input[name='high-score']").setValue("Cool Hand Luke");
      wrapper.find("button.save-high-score").trigger("click");
      expect(wrapper.vm.highScores[0].name).toBe("Cool Hand Luke");
      expect(wrapper.vm.highScores[0].time).toBe(0);
    });
  });
});
