import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {IconButton, Title} from 'react-native-paper';
import {appColorsCode} from '../src/styles/colorCodes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  title: string;
  backIcon?: boolean;
  navigation?: any;
};

const CustomHeader = ({title, backIcon, navigation}: Props) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: appColorsCode.background,
        },
      ]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: appColorsCode.background,
          },
        ]}>
        <View style={styles.headerView}>
          {/* {backIcon && (
            <IconButton
              icon="arrow-left"
              iconColor={appColorsCode.secondary}
              size={20}
              onPress={() => navigation.goBack()}
            />
          )} */}
          {backIcon && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              containerStyle={{marginLeft: 15}}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          )}
          {title && (
            <View style={{marginLeft: backIcon ? 10 : 30}}>
              <Title style={styles.titleStyle}>{title}</Title>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowOpacity: 0,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    elevation: 10,
    borderBottomColor: appColorsCode.gray,
    borderBottomWidth: 1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  titleStyle: {
    color: appColorsCode.secondary,
    fontSize: 22,
  },
});
export default CustomHeader;
