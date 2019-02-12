import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";
import Cell from "@/components/Cell.vue";

describe("Board", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Board);
  });

  it("starts at 0", () => {
    expect(wrapper.find(".elapsed-time").text()).toEqual("0");
  });

  it.skip("starts when a cell is clicked", () => {
    const cell = wrapper.find(Cell);
    cell.trigger("click");
    const elapsedTime = wrapper.find(".elapsed-time").text();
    console.log("elapsedTime after click: ", elapsedTime);
    console.log("vm.elapsedTime =>", wrapper.vm.gameActive);
    expect(parseInt(elapsedTime) > 0).toEqual(true);
  });
});
