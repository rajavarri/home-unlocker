// import { logInApi } from "../src/services/authService";

// describe("login test", () => {
//   it(`should test login`, () => {
//     logInApi({ userName: "admin1", password: "password1" }).then((userData) => {
//       expect(userData.username).toBe("admin1");
//     });
//   });
//   it(`should raise an error if username is incorrect`, () => {
//     logInApi({ userName: "admi", password: "password1" }).then((response) => {
//       expect(response).toBe("Invalid User");
//     });
//   });
//   it(`should raise an error if password is incorrect`, () => {
//     logInApi({ userName: "admin1", password: "password" }).then((response) => {
//       expect(response).toBe("Invalid Password");
//     });
//   });
//   it(`should raise an error if username is not provided`, () => {
//     logInApi({ userName: "", password: "password" }).then((response) => {
//       expect(response).toBe("Username doesn't exist");
//     });
//   });
// });

import { logInApi } from "../src/services/authService";

describe("login test", () => {
  it("should test login", async () => {
    const userData = await logInApi({
      userName: "admin1",
      password: "password1",
    });
    expect(userData.username).toBe("admin1");
  });

  it("should raise an error if username is incorrect", async () => {
    const response = await logInApi({
      userName: "admi",
      password: "password1",
    });
    expect(response).toBe("Invalid User");
  });

  it("should raise an error if password is incorrect", async () => {
    const response = await logInApi({
      userName: "admin1",
      password: "password",
    });
    expect(response).toBe("Invalid Password");
  });

  it("should raise an error if username is not provided", async () => {
    const response = await logInApi({ userName: "", password: "password" });
    expect(response).toBe("Username doesn't exist");
  });
});
