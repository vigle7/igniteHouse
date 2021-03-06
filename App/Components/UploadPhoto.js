import React from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";

import { Button, Icon } from "react-native-elements";

import colors from "../Themes/Colors";

const { width, height } = Dimensions.get("window");
let styles = {};

class UploadPhoto extends React.Component {
  static navigationOptions = {
    title: "Upload Photo"
  };
  state = {
    selectedImageIndex: null
  };
  componentDidMount() {
    // @todo - refactor into redux, we probably don't need to be setting state in componentDidMount,
    // but for now we need to duplicate this state in this component for UI purposes.
    let { selectedImageIndex } = this.props.navigation.state.params.data;
    if (selectedImageIndex) {
      this.setState(() => ({ selectedImageIndex }));
    }
  }
  updateSelectedImage = (image, index) => {
    const { updateSelectedImage } = this.props.navigation.state.params;
    updateSelectedImage(image, index);
    if (index === this.state.selectedImageIndex) {
      index = null;
    }
    this.setState(() => ({ selectedImageIndex: index }));
  };
  render() {
    const { selectedImageIndex } = this.state;
    const { images, selectedImage } = this.props.navigation.state.params.data;

    return (
      <View>
        <View style={styles.imageContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {images.map((image, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.updateSelectedImage(image, index)}
                >
                  <Image
                    source={{ uri: image.node.image.uri }}
                    style={{
                      width: width / 2,
                      height: width / 2,
                      opacity: selectedImageIndex === index ? 0.7 : 1
                    }}
                  />
                </TouchableWithoutFeedback>
              );
            })}
          </ScrollView>
        </View>
        {selectedImageIndex || selectedImageIndex === 0 ? (
          <View style={{ position: "absolute", bottom: 5, right: 25 }}>
            <Icon
              onPress={() => this.props.navigation.goBack()}
              raised
              reverse
              name="check"
              size={34}
              containerStyle={{ width: 50, height: 50 }}
              color={colors.primary}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

styles = StyleSheet.create({
  imageContainer: {
    width,
    height: height - 60
  },
  scrollViewContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

export default UploadPhoto;
