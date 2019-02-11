import { shallowMount } from "@vue/test-utils";
import Cell from "@/components/Cell.vue";

describe("Cell", () => {
  let mineWrapper;

  beforeEach(() => {
    mineWrapper = shallowMount(
      <Cell
        mine="true"
        flag="false"
        active="true"
        row="0"
        col="0"
        border-mines="0"
      />
    );
  });

  it.skip('emits a "click" event when clicked', () => {
    // console.log(wrapper.vm);

    const cell = mineWrapper.find(".cell-container");
    // console.log(cell);
    cell.trigger("click", {});
    // console.log(cell.emitted());
  });
});
