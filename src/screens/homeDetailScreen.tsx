import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import AppContext from "../context/AppContext";
import { Home, Location } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../routes/types";
import { RouteProp } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { RoleType } from "../enums/roleTypeEnum";
import { appColorsCode } from "../styles/colorCodes";
import CustomHeader from "../../shared/CustomHeader";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { HomeStateType } from "../enums/homeStateEnum";
import { updateHome } from "../services/homeService";
import Toast from "react-native-toast-message";
import PushNotification from "react-native-push-notification";
import { initNotificationSetup } from "../../notificationConfig";
import { getDistanceFromLatLonInMeters } from "../utils/distanceCalculator";

type HomeDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "HomeDetail"
>;

type HomeDetailRouteProp = RouteProp<RootStackParamList, "HomeDetail">;

type Props = {
  navigation: HomeDetailScreenNavigationProp;
  route: HomeDetailRouteProp;
};

const HomeDetailScreen = ({ route, navigation }: Props) => {
  const context = useContext(AppContext);
  const { home }: { home: Home } = route.params;
  const dispatch = context?.dispatch;
  const [userLocation, setUserLocation] = useState<Location>();
  const [disableLock, setDisableLock] = useState<boolean>(false);

  if (!context) {
    return null;
  }

  const { user } = context.state;

  const [homeDetails, setHomeDetails] = useState<Home>(home);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords);
      },
      (error) => {
        if (dispatch)
          dispatch({
            type: "SET_ERROR",
            payload: "Failed to get user location",
          });
      }
    );
  }, [dispatch, user?.id]);

  useEffect(() => {
    canUnlock();
    intiateNotification();
  }, [userLocation]);

  const intiateNotification = () => {
    const notificationOptions = [
      {
        name: "Close",
        action: closeNotification,
      },
    ];
    initNotificationSetup(notificationOptions);
  };

  const closeNotification = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  const canUnlock = () => {
    if (!userLocation) return false;
    const distance = getDistanceFromLatLonInMeters(
      userLocation,
      homeDetails.location
    );
    setDisableLock(distance <= 30 || user?.role === RoleType.ADMIN);

    // Send notification to admin if user is within 30 meters of home
    if (distance <= 30 && user?.role !== RoleType.ADMIN) {
      PushNotification.localNotification({
        channelId: "homeunlocker",
        title: "Home-Unlocker",
        message: `${user?.username} is within 30 meters of your home`,
        ongoing: true,
        importance: "max",
        priority: "max",
        allowWhileIdle: true,
        visibility: "public",
        actions: ["Accept", "Reject"],
      });
    }
  };

  const unlockHome = async () => {
    try {
      // Update Home API call
      let homeResult = updateHome(homeDetails.id);
      if (homeResult) {
        let homeContent = homeDetails;
        homeContent.state =
          homeContent.state === HomeStateType.LOCKED ? "locked" : "unlocked";
        setHomeDetails(homeContent);

        // Send notification to user after home is unlocked
        if (user?.role === RoleType.ADMIN) {
          PushNotification.localNotification({
            channelId: "homeunlocker",
            title: "Home-Unlocker",
            message: `admin ${homeContent.state} home`,
            ongoing: true,
            importance: "max",
            priority: "max",
            allowWhileIdle: true,
            visibility: "public",
            actions: ["Close"],
          });
        }
      }
      if (dispatch) {
        dispatch({ type: "SET_HOMES", payload: homeResult });
      }
      Toast.show({
        type: "success",
        text1: `Home ${homeDetails.state} !`,
        autoHide: true,
        visibilityTime: 3000,
        position: "bottom",
        bottomOffset: 20,
      });
    } catch (error) {
      console.error("Unlock Home Error:", error);
      Toast.show({
        type: "error",
        text1: "Error', 'Failed to unlock home.",
        autoHide: true,
        visibilityTime: 3000,
        position: "bottom",
        bottomOffset: 20,
      });
    }
  };

  return (
    <>
      <CustomHeader
        title="Home Details"
        backIcon={true}
        navigation={navigation}
      />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: appColorsCode.background,
          flex: 1,
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: appColorsCode.background },
          ]}
        >
          <Image source={{ uri: homeDetails.image }} style={styles.image} />
          <View style={styles.addressView}>
            <Text>
              <Text style={styles.headerText}>Description : </Text>
              <Text style={styles.description}>{homeDetails.description}</Text>
            </Text>
            <Text>
              <Text style={styles.headerText}>Address line : </Text>
              <Text style={styles.description}>
                {homeDetails.address.addressLine}
              </Text>
            </Text>
            <Text>
              <Text style={styles.headerText}>City : </Text>
              <Text style={styles.description}>{homeDetails.address.city}</Text>
            </Text>
            <Text>
              <Text style={styles.headerText}>State : </Text>
              <Text style={styles.description}>
                {homeDetails.address.state}
              </Text>
            </Text>
            <Text>
              <Text style={styles.headerText}>Country : </Text>
              <Text style={styles.description}>
                {homeDetails.address.country}
              </Text>
            </Text>
            <Text>
              <Text style={styles.headerText}>Pincode : </Text>
              <Text style={styles.description}>
                {homeDetails.address.pincode}
              </Text>
            </Text>
          </View>
          <View style={styles.buttonView}>
            <Button
              uppercase={true}
              children={
                homeDetails.state === HomeStateType.LOCKED ? "lock" : "Unlock"
              }
              buttonColor={
                !disableLock ? appColorsCode.gray : appColorsCode.primary
              }
              textColor="white"
              onPress={unlockHome}
              style={
                !disableLock ? styles.unlockDisabledButton : styles.unlockButton
              }
              disabled={!disableLock}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: appColorsCode.gray,
  },
  addressView: { display: "flex", justifyContent: "flex-start" },
  description: { fontSize: 16, color: "#555", textAlign: "center" },
  unlockButton: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "600",
    color: appColorsCode.text,
    cursor: "pointer",
  },
  unlockDisabledButton: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: appColorsCode.gray,
    color: appColorsCode.text,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "black" },
  buttonView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    display: "flex",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: appColorsCode.gray,
  },
  image: { width: 200, height: 200, alignSelf: "center", marginBottom: 5 },
});

export default HomeDetailScreen;
