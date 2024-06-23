import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AppContext from "../context/AppContext";
import { RootStackParamList } from "../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { getHomesList } from "../services/homeService";
import { RoleType } from "../enums/roleTypeEnum";
import { Home } from "../types";
import CustomHeader from "../../shared/CustomHeader";
import { appColorsCode } from "../styles/colorCodes";
import { useTheme } from "react-native-paper";

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "HomeList"
>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

const HomeListScreen = ({ navigation }: Props) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { state, dispatch } = context;
  const { user } = context.state;

  const [homesList, setHomesList] = useState<Array<Home>>([]);

  useEffect(() => {
    const fetchHomes = () => {
      try {
        let userData: any = {
          id: user?.id,
          role: user?.role,
        };
        const homes = getHomesList(userData?.id, user?.role === RoleType.ADMIN);
        setHomesList(homes);
        dispatch({ type: "SET_HOMES", payload: homes });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load homes" });
      }
    };
    fetchHomes();
  }, [dispatch]);

  return (
    <>
      <CustomHeader title="Home List" navigation={navigation} />
      {state.error && <Text style={styles.error}>{state.error}</Text>}
      <View
        style={[
          styles.container,
          { backgroundColor: appColorsCode.background },
        ]}
      >
        <FlatList
          data={homesList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.homeContainer}
              onPress={() => navigation.navigate("HomeDetail", { home: item })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.address}>{item.address.addressLine}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    color: "red",
  },
  homeContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  address: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColorsCode.secondary,
  },
  description: {
    fontSize: 14,
    color: appColorsCode.secondary,
  },
});

export default HomeListScreen;
