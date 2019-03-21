import { shallowMount } from "@vue/test-utils";
import Reset from "@/components/Reset.vue";

describe("Reset", () => {
  describe("handleClick", () => {
    it("invokes a click handler that is passed via props", () => {
      const spy = jest.fn();
      const wrapper = shallowMount(Reset, {
        propsData: {
          resetBoard: spy
        }
      });
      wrapper.find("button").trigger("click");
      expect(spy).toBeCalled();
    });
  });

  describe("validation", () => {
    it("valids new rows", () => {
      const spy = jest.fn();
      const wrapper = shallowMount(Reset, {
        propsData: { validBoard: spy }
      });
      wrapper.vm.resetRows = 2;
      expect(spy).toBeCalled();
    });

    it("valids new cols", () => {
      const spy = jest.fn();
      const wrapper = shallowMount(Reset, {
        propsData: { validBoard: spy }
      });
      wrapper.vm.resetCols = 2;
      expect(spy).toBeCalled();
    });

    it("valids new cols", () => {
      const spy = jest.fn();
      const wrapper = shallowMount(Reset, {
        propsData: { validBoard: spy }
      });
      wrapper.vm.resetMines = 2;
      expect(spy).toBeCalled();
    });
  });
});
