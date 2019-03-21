import { shallowMount } from "@vue/test-utils";
import { flagAllMines, winGame, activateAllCells } from "../specHelpers";
import Board from "@/components/Board.vue";

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = null;
  wrapper = shallowMount(Board);
});

describe("Board", () => {
  describe("generateBoard", () => {
    it("returns false when rows/cols/mines are invalid", () => {
      expect(wrapper.vm.generateBoard(0, 0, 0)).toEqual(false);
    });

    it("sets the correct number of safeCells", () => {
      wrapper.vm.generateBoard(4, 5, 6);
      expect(wrapper.vm.safeCells).toEqual(14);
    });

    it("initialized a 2D board of cells", () => {
      wrapper.vm.generateBoard(4, 5, 6);
      const arr = expect.any(Array);
      expect(wrapper.vm.board).toEqual(arr);
      expect(wrapper.vm.board[0]).toEqual(arr);
    });
  });

  describe("non-flag click", () => {
    it("Starts the game on first click", () => {
      // expect(wrapper.vm.gameActive).toEqual(false);
      const spy = jest.fn();
      wrapper = shallowMount(Board, {
        propsData: {
          startGame: spy
        }
      });
      wrapper.vm.handleClick(0, 0, false);
      expect(spy).toHaveBeenCalledWith();
    });

    it("invokes Board.handleFlagClick if passed flag is true", () => {
      const spy = jest.spyOn(Board.methods, "handleFlagClick");
      wrapper = shallowMount(Board);
      wrapper.vm.handleClick(0, 0, true);
      expect(spy).toBeCalled();
    });

    it("returns false if the cell is inactive", () => {
      wrapper.vm.board[0][0].active = false;
      expect(wrapper.vm.handleClick(0, 0, false)).toEqual(false);
    });

    it("triggers a mine and reveals all mines", () => {
      const revealMinesSpy = jest.spyOn(Board.methods, "revealMines");
      wrapper = shallowMount(Board);
      wrapper.vm.board[0][0].mine = true;
      wrapper.vm.handleClick(0, 0, false);
      expect(revealMinesSpy).toBeCalled();
    });

    it("triggers a mine and loses game", () => {
      const loseGameSpy = jest.fn();
      wrapper = shallowMount(Board, {
        propsData: {
          loseGame: loseGameSpy
        }
      });
      wrapper.vm.board[0][0].mine = true;
      wrapper.vm.handleClick(0, 0, false);
      expect(loseGameSpy).toBeCalled();
    });

    it("checks to see if the game is over", () => {
      const spy = jest.spyOn(Board.methods, "isGameWon");
      wrapper = shallowMount(Board);
      wrapper.vm.board[0][0].mine = false;
      wrapper.vm.handleClick(0, 0, false);
      expect(spy).toBeCalled();
    });
  });

  describe("flag click", () => {
    it("places a flag", () => {
      wrapper.vm.handleFlagClick(0, 0);
      expect(wrapper.vm.board[0][0].flag).toEqual(true);
      expect(wrapper.vm.board[0][0].active).toEqual(false);
    });

    it("decrements mines", () => {
      const mines = wrapper.vm.mines;
      wrapper.vm.handleFlagClick(0, 0);
      expect(wrapper.vm.mines).toEqual(mines - 1);
    });

    it("removes a flag", () => {
      const mines = wrapper.vm.mines;
      wrapper.vm.board[0][0].flag = true;
      wrapper.vm.handleFlagClick(0, 0);
      expect(wrapper.vm.board[0][0].flag).toEqual(false);
      expect(wrapper.vm.mines).toEqual(mines + 1);
    });

    it("replaces a number with a flag", () => {
      wrapper.vm.board[0][0].active = false;
      wrapper.vm.handleFlagClick(0, 0);
      expect(wrapper.vm.board[0][0].flag).toEqual(true);
    });

    it("invokes gameWon()", () => {
      const spy = jest.spyOn(Board.methods, "isGameWon");
      wrapper = shallowMount(Board);
      wrapper.vm.handleFlagClick(0, 0);
      expect(spy).toBeCalled();
    });
  });

  describe("isGameWon", () => {
    it("returns true if all mines have been flagged and non-mines have been clicked", () => {
      expect(wrapper.vm.isGameWon()).toEqual(false);
      winGame(wrapper);
      expect(wrapper.vm.isGameWon()).toEqual(true);
    });

    it("returns false unless all mines have been flagged.", () => {
      wrapper.vm.board[0][0].mine = true;
      expect(wrapper.vm.isGameWon()).toEqual(false);
    });
  });

  describe("revealMines", () => {
    it("reveals all mines", () => {
      expect(wrapper.vm.board[0][0].reveal).toEqual(false);
      wrapper.vm.revealMines();
      expect(wrapper.vm.board[0][0].reveal).toEqual(true);
    });
  });

  describe("validGame", () => {
    it("Rejects 0 rows", () => {
      wrapper.vm.rows = 0;
      expect(wrapper.vm.validBoard()).toEqual(false);
      expect(wrapper.vm.errors.length >= 1).toEqual(true);
    });

    it("Rejects isNaN rows", () => {
      wrapper.vm.rows = "asdf";
      expect(wrapper.vm.validBoard()).toEqual(false);
      expect(wrapper.vm.errors.length >= 1).toEqual(true);
    });

    it("Rejects invalid number of Columns", () => {
      wrapper.vm.cols = -1;
      expect(wrapper.vm.validBoard()).toEqual(false);
      expect(wrapper.vm.errors.length >= 1).toEqual(true);
    });

    it("Rejects invalid number of mines", () => {
      wrapper.vm.rows = 4;
      wrapper.vm.cols = 4;
      wrapper.vm.mines = 16;
      expect(wrapper.vm.validBoard()).toEqual(false);
      expect(wrapper.vm.errors.length >= 1).toEqual(true);
    });
  });

  describe("allMinesFlagged", () => {
    it("returns true if all mines have been flagged", () => {
      flagAllMines(wrapper);
      expect(wrapper.vm.allMinesFlagged()).toEqual(true);
    });

    it("returns false if all mines have been flagged", () => {
      flagAllMines(wrapper);
      wrapper.vm.board[0][0].mine = true;
      wrapper.vm.board[0][0].flag = false;
      expect(wrapper.vm.allMinesFlagged()).toEqual(false);
    });
  });

  describe("allCellsActive", () => {
    it("returns true if all cells are active", () => {
      activateAllCells(wrapper);
      expect(wrapper.vm.allCellsActive()).toEqual(true);
    });

    it("returns false if all cells are active", () => {
      activateAllCells(wrapper);
      wrapper.vm.board[0][0].active = false;
      expect(wrapper.vm.allCellsActive()).toEqual(false);
    });
  });
});
