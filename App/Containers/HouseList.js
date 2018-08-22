import React from "react";
import {
  View,
  ScrollView,
  Text,
  Animated,
  Image,
  Easing,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import { Icon, Divider } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import { API, Storage } from "aws-amplify";
import colors from "../Themes/Colors";

const styles = {};
export default class HouseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: null,
      loading: true
    };
    this.animatedIcon = new Animated.Value(0);
  }

  componentDidMount() {
    this.handleRetrievePet();
    this.animate();
  }

  animate() {
    Animated.loop(
      Animated.timing(this.animatedIcon, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear
      })
    ).start();
  }

  handleRetrievePet() {
    API.get("HouseCRUD", "/House/UNAUTH")
      .then(apiResponse =>
        Promise.all(
          apiResponse.map(async house => {
            // Make "key" work with paths like:
            // "private/us-east-1:7817b8c7-2a90-4735-90d4-9356d7f8f0c7/091357f0-f0bc-11e7-a6a2-937d1d45b80e.jpeg"
            // and
            // "44b223e0-9707-11e7-a7d2-cdc5b84df56b.jpeg"

            const [, , , key] = /(([^\/]+\/){2})?(.+)$/.exec(house.picKey);
            const picUrl = house.picKey && (await Storage.get(key));
            debugger;
            return { ...house, picUrl };
          })
        )
      )
      .then(apiResponse => {
        this.setState({ apiResponse, loading: false });
      })
      .catch(e => {
        this.setState({ apiResponse: e.message, loading: false });
      });
  }

  renderHouse(house, index) {
    const uri = house.picUrl;

    return (
      <View key={house.picKey}>
        <TouchableHighlight
          onPress={() => {
            Actions.ViewHouse({ house });
          }}
          underlayColor="transparent"
        >
          <View style={styles.petInfoContainer}>
            <Image
              defaultSource={require("../Images/house.png")}
              resizeMode="cover"
              source={uri ? { uri } : require("../Images/house.png")}
              style={styles.petInfoAvatar}
            />
            <Text style={styles.petInfoName}>
              {house.title}
              {"\n"}
              {house.price}
            </Text>
          </View>
        </TouchableHighlight>
        <Divider style={{ height: 0.5, backgroundColor: "#c5cfe5" }} />
      </View>
    );
  }

  render() {
    const { loading, apiResponse } = this.state;
    const spin = this.animatedIcon.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    return (
      <View style={[{ flex: 1 }]}>
        {!loading && (
          <View
            style={{
              position: "absolute",
              bottom: 25,
              right: 25,
              zIndex: 1
            }}
          >
            <Icon
              onPress={this.toggleModal}
              raised
              reverse
              name="add"
              size={44}
              containerStyle={{ width: 50, height: 50 }}
              color={colors.primary}
            />
          </View>
        )}
        <ScrollView
          style={[{ flex: 1, zIndex: 0 }]}
          contentContainerStyle={[
            loading && { justifyContent: "center", alignItems: "center" }
          ]}
        >
          {loading && (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Icon name="autorenew" color={colors.grayIcon} />
            </Animated.View>
          )}
          {!loading && (
            <View style={styles.container}>
              <Text style={styles.title}>My Pets</Text>
              {typeof apiResponse === "string" ? (
                <Text>{apiResponse}</Text>
              ) : (
                apiResponse.map((house, index) =>
                  this.renderHouse(house, index)
                )
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
styles = StyleSheet.create({
  container: {
    padding: 10
  },
  title: {
    color: colors.darkGray,
    fontSize: 18,
    marginBottom: 15
  },
  petInfoContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  petInfoName: {
    color: colors.darkGray,
    fontSize: 20,
    marginLeft: 17
  },
  petInfoAvatar: {
    width: 125,
    height: 75,
    borderRadius: 5
  }
});
