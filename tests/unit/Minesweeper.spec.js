import { shallowMount } from "@vue/test-utils";
import { winGame } from "../specHelpers";
import Minesweeper from "@/components/Minesweeper.vue";

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(Minesweeper);
});

describe("Minesweeper", () => {
  describe("startGame", () => {
    it("sets gameActive to true", () => {
      wrapper.vm.startGame();
      expect(wrapper.vm.gameActive).toEqual(true);
    });
  });

  describe("resetGame", () => {
    it("sets `youLost` to false", () => {
      wrapper.vm.resetGame();
      expect(wrapper.vm.youLost).toEqual(false);
    });

    it("sets `gameActive` to false", () => {
      wrapper.vm.resetGame();
      expect(wrapper.vm.gameActive).toEqual(false);
    });

    it.skip("sets resets clock", () => {
      wrapper.vm.resetGame();
      expect(wrapper.vm.elapsedTime).toEqual(0);
      expect(wrapper.vm.startTime).toEqual(0);
    });

    it.skip("clears the timerInterval", () => {
      wrapper.vm.resetGame();
      expect(wrapper.vm.timerInterval).toEqual(null);
    });
  });

  describe("loseGame", () => {
    it("sets `gameActive` to false", () => {
      wrapper.vm.loseGame();
      expect(wrapper.vm.gameActive).toEqual(false);
    });

    it("sets `youLost` to true", () => {
      wrapper.vm.loseGame();
      expect(wrapper.vm.youLost).toEqual(true);
    });
  });

  describe("winGame", () => {
    it("sets `gameActive` to false", () => {
      wrapper.vm.winGame();
      expect(wrapper.vm.gameActive).toEqual(false);
    });
  });

  describe("dismissModal", () => {
    it("dismisses the modal", () => {
      wrapper.vm.dismissHighScoresModal();
      expect(wrapper.vm.showHighScoresModal).toEqual(false);
    });
  });

  describe("revealModal", () => {
    it("activates highscores if the game was won", () => {
      const spy = jest.spyOn(Minesweeper.methods, "revealHighScoresModal");
      wrapper = shallowMount(Minesweeper);
      wrapper.vm.winGame();
      expect(spy).toBeCalled();
    });
  });
});
