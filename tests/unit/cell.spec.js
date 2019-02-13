import { shallowMount } from "@vue/test-utils";
import Cell from "@/components/Cell.vue";

describe("Cell", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Cell);
  });

  it('emits a "click" event when clicked', () => {
    const cell = wrapper.find(".cell-container");
    cell.trigger("click");
    expect(wrapper.emitted()).toEqual({ "cell-clicked": [[0, 0, false]] });
  });
});
