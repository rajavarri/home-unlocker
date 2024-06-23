// mocks.tsx
import React from 'react';

export const AppProvider = ({children}: {children: React.ReactNode}) => (
  <div data-testid="mock-app-provider">{children}</div>
);

const AppNavigator = () => (
  <div data-testid="mock-app-navigator">Mock App Navigator</div>
);

export default AppNavigator;
