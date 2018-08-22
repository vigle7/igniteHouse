import React, { Component } from "react";
import { View, Button, Image } from "react-native";
import autobind from "autobind-decorator";
// import RNFetchBlob frdom 'rn-fetch-blob'
import { ImagePicker, Permissions } from "expo";
import { connect } from "react-redux";
import { Storage } from "aws-amplify";

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from "./Styles/StorageStyle";

class Storagetest extends Component {
  constructor(props) {
    super(props);
    this.state = { image: null };
    this.pickImage = this.pickImage.bind(this);
  }

  async pickImage() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      console.log(image);
      this.setState({ image: image.uri });
      fetch(image.uri)
        .then(response => response.blob())
        .then(Buffer => Storage.put("testImage", Buffer))
        .then(x => console.log("SAVED IMAGE WITH KEY", x) || x)
        .catch(err => console.log("IMAGE UPLOAD ERROR", err));
    } else {
      throw new Error("CAMERA_ROLL permission not granted");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="選擇圖片並上傳" onPress={this.pickImage} />

        {this.state.image && (
          <Image
            source={{ uri: this.state.image }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Storagetest);
