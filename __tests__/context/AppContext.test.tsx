import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {AppContextValue} from '../../src/types';
import AppContext from '../../src/context/AppContext';

describe('AppContext', () => {
  it('renders AppContext component', () => {
    const testValue: AppContextValue = {
      state: {
        isLoggedIn: false,
        user: null,
        homes: [],
        error: null,
      },
      dispatch: jest.fn(),
    };

    const {getByTestId} = render(
      <AppContext.Provider value={testValue}>
        <AppContext />
      </AppContext.Provider>,
    );

    // Check if AppContext component is rendered
    const appContextElement: any = screen.getByTestId('app-context');
    expect(appContextElement).toBeInTheDocument();

    // Add more specific tests as needed
  });
});
