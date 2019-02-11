import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";

describe("Board", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Board);
  });

  it("defaults to 4x4 and 5 mines", () => {
    // Testing rendered output.  Treat Board like a blackbox.
    expect(wrapper.findAll(".row").length).toEqual(4);
    expect(wrapper.findAll(".col").length).toEqual(16);

    // Testing state directly.  Antipattern?
    expect(wrapper.vm.rows).toEqual(4);
    expect(wrapper.vm.cols).toEqual(4);
    expect(wrapper.vm.mines).toEqual(5);
  });

  it("Rejects invalid number of rows", () => {
    const resetRowsInput = wrapper.find("input[name='reset-rows']");
    resetRowsInput.setValue(`0`);
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("Rejects invalid number of Columns", () => {
    const resetColsInput = wrapper.find("input[name='reset-cols']");
    resetColsInput.setValue(`-1`);

    // Test rendered output
    const errors = wrapper.findAll(".errors li");
    expect(errors.length >= 1).toEqual(true);

    // Test vm state
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("Rejects invalid number of mines", () => {
    const newMinesInput = wrapper.find("input[name='reset-mines']");
    // Default board is 4x4 = 16 cells, so 17 mines in 16 cells in invalid.
    newMinesInput.setValue("17");
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("provides a button to reset the game", () => {
    const resetBtn = wrapper.find(".reset-container button");
    // Initial state
    expect(wrapper.findAll(".row").length).toEqual(4);
    expect(wrapper.findAll(".col").length).toEqual(16);

    // Set new values
    wrapper.find("input[name='reset-rows']").setValue("3");
    wrapper.find("input[name='reset-cols']").setValue("3");
    resetBtn.trigger("click");

    expect(wrapper.findAll(".row").length).toEqual(3);
    expect(wrapper.findAll(".col").length).toEqual(9);
  });
});
