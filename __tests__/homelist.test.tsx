import { getHomesList } from "../src/services/homeService";
import homesData from "../src/mock/homes.json";
import usersData from "../src/mock/users.json";

describe("get homes list", () => {
  it("should return all homes when the user is an admin", () => {
    const homesList = getHomesList("1", true);
    expect(homesList).toEqual(homesData);
  });
  it("should return specific homes for a regular user", () => {
    const homesList = getHomesList("4", false);
    const expectedHomes = homesData.filter((home) =>
      usersData[3].homeIds.includes(home.id)
    );
    expect(homesList).toEqual(expectedHomes);
  });
  it("should return an empty list for a user ID that does not exist", () => {
    const homesList = getHomesList("999", false);
    expect(homesList).toBeNull;
  });
  it("should return an empty list for a user with no associated homes", () => {
    const homesList = getHomesList("5", false); // Assuming user with ID 5 has no associated homes
    expect(homesList).toBeNull;
  });
  it("should return an empty list for an empty user ID", () => {
    const homesList = getHomesList("", false);
    expect(homesList).toBeNull;
  });
});
