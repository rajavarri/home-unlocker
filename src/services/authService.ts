// authservice.ts

import usersData from "../mock/users.json";

export const logInApi = async (loginCredentials: {
  userName: string;
  password: string;
}): Promise<any> => {
  if (!loginCredentials?.userName) {
    return "Username doesn't exist";
  }
  // if (!loginCredentials?.password) {
  //   return 'Password Incorrect';
  // }
  let userIndex = usersData.findIndex(
    (eachUser) => eachUser.username === loginCredentials.userName
  );
  if (userIndex === -1) {
    return "Invalid User";
  }
  if (userIndex > -1) {
    if (usersData[userIndex].password !== loginCredentials?.password) {
      return "Invalid Password";
    }

    return usersData[userIndex]; // Return the user data after successful login
  }
};
