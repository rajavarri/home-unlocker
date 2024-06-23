// __tests__/HomeDetailScreen.test.tsx

import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';
import {RoleType} from '../src/enums/roleTypeEnum';
import {HomeStateType} from '../src/enums/homeStateEnum';
import AppContext from '../src/context/AppContext';
import HomeDetailScreen from '../src/screens/homeDetailScreen';
import {appColorsCode} from '../src/styles/colorCodes';
import {updateHome} from '../src/services/homeService';

// Mock dependencies
jest.mock('../services/homeService');
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const Stack = createStackNavigator();

describe('HomeDetailScreen', () => {
  const dispatch = jest.fn();
  const user = {
    id: 1,
    role: RoleType.AGENT,
    homeIds: [1, 2],
    username: 'testuser',
  };
  const home = {
    id: 1,
    address: {
      addressLine: '123 Main St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      pincode: '123456',
    },
    description: 'Beautiful house',
    image: 'https://example.com/image1.jpg',
    location: {latitude: 10, longitude: 20},
    state: HomeStateType.LOCKED,
  };

  const contextValue = {
    state: {isLoggedIn: true, user: user, homes: [], error: null},
    dispatch,
  };

  const navigation: any = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <AppContext.Provider value={contextValue}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="HomeDetail">{() => ui}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>,
    );
  };

  it('renders correctly', () => {
    const {getByText} = renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    expect(getByText('Home Details')).toBeTruthy();
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('Beautiful house')).toBeTruthy();
  });

  it('shows the lock button disabled initially', () => {
    const {getByText} = renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    const lockButton = getByText('lock');
    expect(lockButton).toBeTruthy();
    expect(lockButton.props.style[0].backgroundColor).toBe(appColorsCode.gray);
  });

  it('updates button state based on user location', async () => {
    const mockedGeolocation = require('@react-native-community/geolocation');
    mockedGeolocation.getCurrentPosition.mockImplementation(
      (
        success: (arg0: {
          coords: {latitude: number; longitude: number};
        }) => void,
      ) => {
        success({
          coords: {latitude: 10, longitude: 20},
        });
      },
    );

    const {getByText} = renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    await waitFor(() => {
      const lockButton = getByText('lock');
      expect(lockButton).toBeTruthy();
      expect(lockButton.props.style[0].backgroundColor).toBe(
        appColorsCode.primary,
      );
    });
  });

  it('handles location fetch error', async () => {
    const mockedGeolocation = require('@react-native-community/geolocation');
    mockedGeolocation.getCurrentPosition.mockImplementation(
      (_: any, error: (arg0: {message: string}) => void) => {
        error({message: 'Location error'});
      },
    );

    renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_ERROR',
        payload: 'Failed to get user location',
      });
    });
  });

  it('unlocks the home and shows success message', async () => {
    (updateHome as jest.Mock).mockResolvedValue(home);

    const mockedGeolocation = require('@react-native-community/geolocation');
    mockedGeolocation.getCurrentPosition.mockImplementation(success => {
      success({
        coords: {latitude: 10, longitude: 20},
      });
    });

    const {getByText} = renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    await waitFor(() => {
      const lockButton = getByText('lock');
      expect(lockButton).toBeTruthy();
      fireEvent.press(lockButton);
    });

    await waitFor(() => {
      expect(updateHome).toHaveBeenCalledWith(home.id);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: `Home ${home.state} !`,
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
    });
  });

  it('shows error message on unlock failure', async () => {
    (updateHome as jest.Mock).mockRejectedValue(new Error('Unlock failed'));

    const mockedGeolocation = require('@react-native-community/geolocation');
    mockedGeolocation.getCurrentPosition.mockImplementation(
      (
        success: (arg0: {
          coords: {latitude: number; longitude: number};
        }) => void,
      ) => {
        success({
          coords: {latitude: 10, longitude: 20},
        });
      },
    );

    const {getByText} = renderWithProviders(
      <HomeDetailScreen route={{params: {home}}} navigation={navigation} />,
    );

    await waitFor(() => {
      const lockButton = getByText('lock');
      fireEvent.press(lockButton);
    });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: "Error', 'Failed to unlock home.",
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
    });
  });
});
