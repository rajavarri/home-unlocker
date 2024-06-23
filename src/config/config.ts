const API_URL = () => 'local';
export const API_PATH = () => ({
  apis: {
    signIn: API_URL() + '/api/app/login',
    logout: API_URL() + '/api/app/logout',
    getHomes: API_URL() + '/api/app/homes',
    unlockHome: API_URL() + '/api/app/homes',
  },
});

export const firebaseConfig = {
  // Firebase config object
  apiKey: 'AIzaSyCQpPWsWkPlKq9oPpY2uCtD4LpAPw44gnc',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'homeunlocker',
  storageBucket: 'homeunlocker.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:490135407705:android:83f99037d3931b374af548',
  measurementId: 'YOUR_MEASUREMENT_ID',
};
