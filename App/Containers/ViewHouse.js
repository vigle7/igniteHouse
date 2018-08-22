import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../Themes/Colors";
import PropTypes from "prop-types";

const propTypes = {
  price: PropTypes.string,
  title: PropTypes.string
};

class ViewHouse extends React.Component {
  render() {
    const title = this.props.title || "No house";
    const price = this.props.price || "No house";

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title || "無標題"}</Text>
            <Text style={styles.info}>{price || "無價格"}</Text>
          </View>
        </View>
        <View style={styles.breaker} />
      </View>
    );
  }
}

ViewHouse.propTypes = propTypes;

const imageSize = 130;
const styles = StyleSheet.create({
  infoContainer: {
    paddingLeft: 20
  },
  breaker: {
    height: 1,
    backgroundColor: colors.darkGray,
    marginVertical: 15,
    width: "100%"
  },
  topContainer: {
    flexDirection: "row"
  },
  container: {
    padding: 20
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2
  },
  title: {
    color: colors.darkGray,
    fontSize: 28,
    marginBottom: 20
  },
  info: {
    color: colors.darkGray,
    marginBottom: 7
  }
});

export default ViewHouse;
