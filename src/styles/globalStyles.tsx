import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'left',
  },
  boldFont: {
    fontWeight: 'bold',
  },
  fullHW: {
    height: '100%',
    width: '100%',
  },
  customFont: {
    includeFontPadding: false,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  displayNone: {
    display: 'none',
  },
  wholeFlexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default globalStyles;
