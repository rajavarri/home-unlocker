import React, {useEffect} from 'react';
import {AppProvider} from './src/context/AppContext';
import AppNavigator from './src/navigation';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const App = () => {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#61da9a',
          backgroundColor: '#61da9a',
          height: 50,
          width: '90%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          borderRadius: 8,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
        }}
        text1NumberOfLines={2}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
        }}
        style={{
          borderLeftColor: '#B3261E',
          backgroundColor: '#B3261E',
          height: 50,
          width: '90%',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          borderRadius: 8,
        }}
      />
    ),
  };

  return (
    <AppProvider>
      <AppNavigator />
      <Toast config={toastConfig} />
    </AppProvider>
  );
};

export default App;
