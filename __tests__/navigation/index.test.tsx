import {render, screen} from '@testing-library/react-native';
import '@testing-library/jest-dom/extend-expect';
import AppNavigator from '../../src/navigation';
describe('AppNavigator', () => {
  it('renders AppNavigator component', () => {
    render(<AppNavigator />);

    // Check if AppNavigator component is rendered
    const appNavigatorElement = screen.getByTestId('app-navigator');
    expect(appNavigatorElement).toBeTheDocument();

    // Add more specific tests as needed
  });
});
