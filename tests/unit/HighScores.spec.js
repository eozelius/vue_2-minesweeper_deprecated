import { shallowMount } from "@vue/test-utils";
import HighScores from "@/components/HighScores.vue";

describe("High Scores", () => {
  let wrapper;
  let dismissModalSpy;

  beforeEach(() => {
    dismissModalSpy = jest.fn();

    wrapper = shallowMount(HighScores, {
      propsData: {
        showHighScoresModal: false,
        dismissHighScoresModal: dismissModalSpy,
        elapsedTime: 0
      }
    });
  });

  describe("submitHighScore", () => {
    it("adds a new highscore", () => {
      wrapper.vm.submitHighScore("mock Name", "mock Time");
      expect(wrapper.vm.highScores.length).toEqual(1);
    });

    it("rejects scores without a name", () => {
      wrapper.vm.submitHighScore(false, "mock Time");
      expect(wrapper.vm.highScores.length).toEqual(0);
    });

    it("rejects scores without a time", () => {
      wrapper.vm.submitHighScore("mock Name", undefined);
      expect(wrapper.vm.highScores.length).toEqual(0);
    });

    it("Sorts the Scores by time", () => {
      wrapper.vm.submitHighScore("Super SlowSki Sr.", 215);
      wrapper.vm.submitHighScore("SlowSki Jr.", 105);
      wrapper.vm.submitHighScore("Speedy", 5);
      expect(wrapper.vm.highScores[2].name).toEqual("Super SlowSki Sr.");
      expect(wrapper.vm.highScores[0].name).toEqual("Speedy");
    });
  });

  describe("handleSave", () => {
    it("submits a highscore", () => {
      const spy = jest.spyOn(HighScores.methods, "submitHighScore");
      wrapper = shallowMount(HighScores);
      wrapper.vm.handleSave();
      expect(spy).toBeCalled();
    });

    it("dismisses Modal", () => {
      wrapper.vm.handleSave();
      expect(dismissModalSpy).toBeCalled();
    });
  });
});
