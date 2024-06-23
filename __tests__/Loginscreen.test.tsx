// __tests__/LoginScreen.test.tsx

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppProvider} from '../src/context/AppContext';
import LoginScreen from '../src/screens/LoginScreen';
import {logInApi} from '../src/services/authService';

// Mock dependencies
jest.mock('../services/authService');
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const Stack = createStackNavigator();

describe('LoginScreen', () => {
  const dispatch = jest.fn();

  const contextValue = {
    state: {isLoggedIn: false, user: null, homes: [], error: null},
    dispatch,
  };

  const navigation: any = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} navigation={navigation} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>,
    );

    expect(getByText('Login')).toBeTruthy();
  });

  it('updates username and password state on input change', () => {
    const {getByLabelText} = render(
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} navigation={navigation} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>,
    );

    const usernameInput = getByLabelText('Enter username');
    const passwordInput = getByLabelText('Enter password');

    fireEvent.changeText(usernameInput, 'testUser');
    fireEvent.changeText(passwordInput, 'testPassword');

    expect(usernameInput.props.value).toBe('testUser');
    expect(passwordInput.props.value).toBe('testPassword');
  });

  it('shows an error message on invalid login', async () => {
    (logInApi as jest.Mock).mockResolvedValue('Invalid User');

    const {getByText, getByLabelText} = render(
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} navigation={navigation} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>,
    );

    const usernameInput = getByLabelText('Enter username');
    const passwordInput = getByLabelText('Enter password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'wrongUser');
    fireEvent.changeText(passwordInput, 'wrongPassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Invalid User',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 20,
      });
    });
  });

  it('navigates to HomeList on successful login', async () => {
    const user = {id: 1, username: 'testUser'};
    (logInApi as jest.Mock).mockResolvedValue(user);

    const {getByText, getByLabelText} = render(
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} navigation={navigation} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>,
    );

    const usernameInput = getByLabelText('Enter username');
    const passwordInput = getByLabelText('Enter password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'testUser');
    fireEvent.changeText(passwordInput, 'testPassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({type: 'LOGIN', payload: user});
      expect(navigation.navigate).toHaveBeenCalledWith('HomeList');
    });
  });
});
