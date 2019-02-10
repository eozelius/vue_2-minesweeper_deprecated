import { shallowMount } from "@vue/test-utils";
import Board from "@/components/Board.vue";

describe("Board", () => {
  it("renders properly", () => {
    const wrapper = shallowMount(Board);
    expect(wrapper.text()).toMatch("Minesweeper");
  });
});
