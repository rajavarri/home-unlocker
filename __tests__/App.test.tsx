import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

test('renders App component', () => {
  const {getByTestId} = render(<App />);
  const appProvider = getByTestId('app-provider');
  const appNavigator = getByTestId('app-navigator');
  expect(appProvider).toBeTruthy();
  expect(appNavigator).toBeTruthy();
});
