import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import AppContext from '../context/AppContext';
import {RootStackParamList} from '../routes/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {logInApi} from '../services/authService';
import {Button, TextInput} from 'react-native-paper';
import {appColorsCode} from '../styles/colorCodes';
import Toast from 'react-native-toast-message';

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

const LoginScreen = ({navigation}: Props) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const {dispatch} = context;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      //requesting user location permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleLogin = async () => {
    const loginCredentials = {
      userName: username,
      password: password,
    };

    try {
      const result = await logInApi(loginCredentials);

      if (typeof result === 'string') {
        Toast.show({
          type: 'error',
          text1: `${result}`,
          autoHide: true,
          visibilityTime: 3000,
          position: 'bottom',
          bottomOffset: 20,
        });
      } else {
        // Dispatch login action and navigate to HomeList
        // As we have a dispatch function available from our AppContext
        dispatch({type: 'LOGIN', payload: result}); // Dispatch the user data
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          autoHide: true,
          visibilityTime: 3000,
          position: 'bottom',
          bottomOffset: 20,
        });
        navigation.navigate('HomeList');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Toast.show({
        type: 'error',
        text1: "Login Failed', 'An error occurred during login.",
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: appColorsCode.background}]}>
      <Text style={styles.title}>Login</Text>
      <View style={[styles.formParentView, {marginBottom: 10}]}>
        <TextInput
          mode="outlined"
          label="Enter username"
          textContentType={'username'}
          selectionColor={appColorsCode.primary}
          textColor={appColorsCode.secondary}
          textAlign="center"
          style={[
            {
              color: appColorsCode.secondary,
            },
            {
              ...styles.textInput,
            },
          ]}
          outlineStyle={[
            styles.inputFieldOutlineStyle,
            {
              borderColor: appColorsCode.gray,
              backgroundColor: appColorsCode.background,
            },
          ]}
          contentStyle={styles.inputFieldContentStyle}
          onChangeText={setUsername}
          value={username}
        />
      </View>
      <View style={styles.formParentView}>
        <TextInput
          mode="outlined"
          label="Enter password"
          textContentType={'password'}
          selectionColor={appColorsCode.primary}
          textColor={appColorsCode.secondary}
          textAlign="center"
          style={[
            {
              color: appColorsCode.secondary,
            },
            {
              ...styles.textInput,
            },
          ]}
          outlineStyle={[
            styles.inputFieldOutlineStyle,
            {
              borderColor: appColorsCode.gray,
              backgroundColor: appColorsCode.background,
            },
          ]}
          contentStyle={styles.inputFieldContentStyle}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={hidePassword}
        />
      </View>
      <Button
        children="Login"
        onPress={handleLogin}
        textColor="white"
        buttonColor={appColorsCode.primary}
        style={styles.loginButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  formParentView: {
    width: '100%',
    paddingHorizontal: 18,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    width: '100%',
  },
  loginButton: {
    width: '80%',
    height: 40,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 20,
  },
  textInput: {
    width: '100%',
    height: 50,
    borderRadius: 4,
    fontSize: 16,
  },
  inputFieldOutlineStyle: {
    borderRadius: 4,
  },
  inputFieldContentStyle: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  passwordIcon: {alignItems: 'center', paddingTop: 7},
});

export default LoginScreen;
