import { updateHome } from "../src/services/homeService";
import homesData from "../src/mock/homes.json";
import { HomeStateType } from "../src/enums/homeStateEnum";

describe("updateHome function", () => {
  it("should toggle the state of an existing home from locked to unlocked", () => {
    const homeId = 1;
    const initialState = homesData.find((home) => home.id === homeId)?.state;

    // Call the updateHome function
    updateHome(homeId);
    const updatedState = homesData.find((home) => home.id === homeId)?.state;

    if (initialState === HomeStateType.LOCKED) {
      expect(updatedState).toBe(HomeStateType.UNLOCKED);
    } else {
      expect(updatedState).toBe(HomeStateType.LOCKED);
    }
  });

  it("should toggle the state of an existing home from unlocked to locked", () => {
    const homeId = 2;
    const initialState = homesData.find((home) => home.id === homeId)?.state;

    // Call the updateHome function
    updateHome(homeId);
    const updatedState = homesData.find((home) => home.id === homeId)?.state;

    if (initialState === HomeStateType.UNLOCKED) {
      expect(updatedState).toBe(HomeStateType.LOCKED);
    } else {
      expect(updatedState).toBe(HomeStateType.UNLOCKED);
    }
  });

  it("should return the same homes list if the home does not exist", () => {
    const initialHomesList = [...homesData];
    const homeId = 999; // Non-existing home ID

    // Call the updateHome function
    const updatedHomesList = updateHome(homeId);

    expect(updatedHomesList).toEqual(initialHomesList);
  });
});
