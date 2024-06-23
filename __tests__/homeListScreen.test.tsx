// __tests__/HomeListScreen.test.tsx

import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RoleType} from '../src/enums/roleTypeEnum';
import {Home} from '../src/types';
import {getHomesList} from '../src/services/homeService';
import AppContext from '../src/context/AppContext';
import HomeListScreen from '../src/screens/homeListScreen';

// Mock dependencies
jest.mock('../services/homeService');
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const Stack = createStackNavigator();

describe('HomeListScreen', () => {
  const dispatch = jest.fn();
  const user = {id: 1, role: RoleType.AGENT, homeIds: [1, 2]};
  const homes: Array<Home> = [
    {
      id: 1,
      address: {
        addressLine: '1, MG Road',
        city: 'Bangalore',
        pincode: '560001',
        state: 'Karnataka',
        country: 'India',
      },
      description: 'Modern apartment in the heart of Bangalore.',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
      location: {
        latitude: 12.9715987,
        longitude: 77.5945627,
      },
      state: 'unlocked',
    },
    {
      id: 2,
      address: {
        addressLine: '2, Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
        state: 'Karnataka',
        country: 'India',
      },
      description: 'Beautiful house with a spacious garden.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      location: {
        latitude: 12.9715987,
        longitude: 77.5945627,
      },
      state: 'unlocked',
    },
  ];

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
            <Stack.Screen name="HomeList">{() => ui}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>,
    );
  };

  it('renders correctly', () => {
    (getHomesList as jest.Mock).mockReturnValue(homes);

    const {getByText} = renderWithProviders(
      <HomeListScreen navigation={navigation} />,
    );

    expect(getByText('Home List')).toBeTruthy();
  });

  it('shows an error message when there is an error', async () => {
    (getHomesList as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to load homes');
    });

    const {getByText} = renderWithProviders(
      <AppContext.Provider
        value={{
          ...contextValue,
          state: {...contextValue.state, error: 'Failed to load homes'},
        }}>
        <HomeListScreen navigation={navigation} />
      </AppContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText('Failed to load homes')).toBeTruthy();
    });
  });

  it('fetches and displays the homes list', async () => {
    (getHomesList as jest.Mock).mockReturnValue(homes);

    const {getByText} = renderWithProviders(
      <HomeListScreen navigation={navigation} />,
    );

    await waitFor(() => {
      expect(getByText('123 Main St')).toBeTruthy();
      expect(getByText('Beautiful house')).toBeTruthy();
      expect(getByText('456 Oak St')).toBeTruthy();
      expect(getByText('Lovely apartment')).toBeTruthy();
    });
  });

  it('navigates to HomeDetail on home item press', async () => {
    (getHomesList as jest.Mock).mockReturnValue(homes);

    const {getByText} = renderWithProviders(
      <HomeListScreen navigation={navigation} />,
    );

    await waitFor(() => {
      fireEvent.press(getByText('123 Main St'));
      expect(navigation.navigate).toHaveBeenCalledWith('HomeDetail', {
        home: homes[0],
      });
    });
  });
});
