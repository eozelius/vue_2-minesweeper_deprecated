import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";
import Cell from "@/components/Cell.vue";
import { winGame } from "../specHelpers";

describe.skip("Timer", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Board);
  });

  it("starts when the first cell is clicked", () => {
    const startTimerSpy = jest.spyOn(Board.methods, "startTimer");
    wrapper = shallowMount(Board);
    const cell = wrapper.find(Cell);
    wrapper.vm.board[0][0].mine = false;
    cell.vm.$emit("cell-clicked", 0, 0, false);
    expect(startTimerSpy).toHaveBeenCalled();
  });

  it("initializes to zero", () => {
    expect(wrapper.vm.elapsedTime).toEqual(0);
  });

  it("Pauses when the game is lost", () => {
    const pauseTimerSpy = jest.spyOn(Board.methods, "pauseTimer");
    wrapper = shallowMount(Board);
    const cell = wrapper.find(Cell);
    wrapper.vm.board[0][0].mine = true;
    cell.vm.$emit("cell-clicked", 0, 0, false);
    expect(pauseTimerSpy).toHaveBeenCalled();
  });

  it("Pauses when the game is won", () => {
    const pauseTimerSpy = jest.spyOn(Board.methods, "pauseTimer");
    wrapper = shallowMount(Board);
    winGame(wrapper);
    wrapper.vm.gameWon();
    expect(pauseTimerSpy).toHaveBeenCalled();
  });

  it.skip("Restarts from zero, when the game is reset", () => {
    const startTimerSpy = jest.spyOn(Board.methods, "resetTimer");
    wrapper = shallowMount(Board);
    expect(startTimerSpy).not.toHaveBeenCalled();
    const resetBtn = wrapper.find(".reset-container button");
    resetBtn.trigger("click");
    expect(startTimerSpy).toHaveBeenCalled();
  });
});
