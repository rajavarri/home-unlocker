import {HomeStateType} from '../enums/homeStateEnum';
import homesData from '../mock/homes.json';
import usersData from '../mock/users.json';
import {Home} from '../types';
export const getHomesList = (userId: string, isAdmin: boolean): any => {
  if (isAdmin) {
    return homesData;
  } else {
    let userIndex = usersData.findIndex(eachUser => eachUser.id === userId);
    if (userIndex > -1) {
      let userHomeIds = usersData[userIndex].homeIds;
      let finalHomesList: Array<Home> = [];
      userHomeIds.forEach(eachHome => {
        let homeIndex = homesData.findIndex(home => home.id === eachHome);
        if (homeIndex > -1) {
          finalHomesList.push(homesData[homeIndex]);
        }
      });
      return finalHomesList;
    }
  }
};

export const updateHome = (homeId: number): any => {
  let homesList = homesData;
  let homeIndex = homesList.findIndex(home => home.id === homeId);
  if (homeIndex > -1) {
    if (homesList[homeIndex].state === HomeStateType.LOCKED) {
      homesList[homeIndex].state = HomeStateType.UNLOCKED;
    } else {
      homesList[homeIndex].state = HomeStateType.LOCKED;
    }
  }
  return homesList;
};
