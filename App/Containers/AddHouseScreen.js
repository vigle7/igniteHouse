import React from "react";
import {
  View,
  Text,
  CameraRoll,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Image,
  ScrollView,
  ImageStore,
  Platform,
  ActivityIndicator
} from "react-native";
import { ImagePicker, Permissions } from "expo";
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
  Icon,
  ButtonGroup
} from "react-native-elements";
import uuid from "react-native-uuid";
import mime from "mime-types";
import { API, Storage } from "aws-amplify";
import colors from "../Themes/Colors";
// import files from "../Utils/files"

const { width, height } = Dimensions.get("window");

let styles = {};

export default class AddHouseScreen extends React.Component {
  static navigationOptions = {
    title: "房屋上架"
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      selectedGenderIndex: null,
      modalVisible: false,
      input: {
        houseId: "UNAUTH",
        title: "0",
        price: "0",
        floor: "0"
      },
      showActivityIndicator: false
    };
    this.pickImage = this.pickImage.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.addHouse = this.addHouse.bind(this);
    this.readImage = this.readImage.bind(this);
    this.apiSaveHouse = this.apiSaveHouse.bind(this);
  }

  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20
    })
      .then(res => {
        this.setState({ images: res.edges });
        this.props.navigation.navigate("UploadPhoto", {
          data: this.state,
          updateSelectedImage: this.updateSelectedImage
        });
      })
      .catch(err => console.log("error getting photos...:", err));
  };

  // async pickImage() {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   if (status === "granted") {
  //     const image = await ImagePicker.launchImageLibraryAsync({
  //       allowsEditing: true,
  //       aspect: [4, 3]
  //     });
  //     console.log(image);
  //     this.setState({ selectedImage: image });
  //   } else {
  //     throw new Error("CAMERA_ROLL permission not granted");
  //   }
  // }

  toggleModal() {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }));
  }

  async addHouse() {
    const { selectedImage: image } = this.state;
    this.setState({ showActivityIndicator: true });
    this.readImage(image)
      .then(fileInfo => ({
        ...this.state.input,
        picKey: fileInfo && fileInfo.key
      }))
      .then(this.apiSaveHouse)
      .then(apiResponse => {
        console.log(`response from saving hosue: ${apiResponse}`);
        this.setState({ showActivityIndicator: false });
        // this.props.screenProps.handleRetrievePet()
        // this.toggleModal()
      })
      .catch(err => {
        console.log("error saving pet...", err);
        this.setState({ showActivityIndicator: false });
      });
  }

  readImage(image = null) {
    debugger;
    if (image === null) {
      return Promise.resolve();
    }
    const result = {};

    result.type = mime.lookup(image.uri);

    const extension = mime.extension(result.type);
    const imagePath = image.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const key = `${picName}`;
    return fetch(imagePath)
      .then(response => response.blob())
      .then(Buffer => Storage.put(key, Buffer))
      .then(fileInfo => ({ key: fileInfo.key }))
      .then(x => console.log("SAVED IMAGE WITH KEY", x) || x)
      .catch(err => console.log("IMAGE UPLOAD ERROR", err));
  }

  async apiSaveHouse(house) {
    return await API.post("HouseCRUD", "/House", { body: house });
  }

  updateGender = index => {
    let gender = "頂加";
    if (index === this.state.selectedGenderIndex) {
      index = null;
      gender = "";
    } else if (index === 1) {
      gender = "非頂加";
    }
    this.setState(state => ({
      selectedGenderIndex: index,
      input: {
        ...state.input,
        gender
      }
    }));
  };

  render() {
    const { selectedImage } = this.state;

    return (
      <View style={{ flex: 1, paddingBottom: 0 }}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.title}>增加租屋資訊</Text>
          <TouchableWithoutFeedback onPress={this.getPhotos}>
            {selectedImage === null ? (
              <View style={styles.addImageContainer}>
                <Icon size={34} name="camera-roll" color={colors.grayIcon} />
                <Text style={styles.addImageTitle}>Upload Photo</Text>
              </View>
            ) : (
              <Image
                style={styles.addImageContainer}
                source={{ uri: selectedImage.uri }}
              />
            )}
          </TouchableWithoutFeedback>

          {/* {this.state.image && (
            <Image
              source={{ uri: this.state.image }}
              style={{ width: 200, height: 200 }}
            />
          )} */}

          <FormLabel>標題</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable
            placeholder="輸入標題"
            returnKeyType="next"
            ref="title"
            textInputRef="titleInput"
            onChangeText={title => this.updateInput("title", title)}
            value={this.state.input.title}
          />
          <FormLabel>價格</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable
            placeholder="輸入價格"
            returnKeyType="next"
            ref="price"
            textInputRef="priceInput"
            onChangeText={price => this.updateInput("price", price)}
            value={this.state.input.price}
          />
          <FormLabel>樓層</FormLabel>
          <FormInput
            inputStyle={styles.input}
            selectionColor={colors.primary}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            editable
            placeholder="輸入價格"
            returnKeyType="next"
            ref="floor"
            textInputRef="floorInput"
            onChangeText={floor => this.updateInput("floor", floor)}
            value={this.state.input.floor}
          />
          {/* <FormLabel>頂加</FormLabel>
          <View style={styles.buttonGroupContainer}>
            <ButtonGroup
              innerBorderStyle={{ width: 0.5 }}
              underlayColor="#0c95de"
              containerStyle={{ borderColor: "#d0d0d0" }}
              selectedTextStyle={{ color: "white", fontFamily: "lato" }}
              selectedBackgroundColor={colors.primary}
              onPress={this.updateGender}
              selectedIndex={this.state.selectedGenderIndex}
              buttons={["頂加", "非頂加"]}
            />
          </View> */}
          <Button
            fontFamily="FontAwesome"
            containerViewStyle={{ marginTop: 20 }}
            backgroundColor={colors.primary}
            large
            title="提交"
            onPress={this.addHouse}
          />
          <Text onPress={this.toggleModal} style={styles.closeModal}>
            Dismiss
          </Text>
        </ScrollView>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        </Modal>
      </View>
    );
  }
}

styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8
  },
  addImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.lightGray,
    borderColor: colors.mediumGray,
    borderWidth: 1.5,
    marginVertical: 14,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  addImageTitle: {
    color: colors.darkGray,
    marginTop: 3
  },
  closeModal: {
    color: colors.darkGray,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: colors.darkGray,
    fontSize: 18,
    marginBottom: 15
  },
  input: {
    fontFamily: "FontAwesome"
  },
  activityIndicator: {
    backgroundColor: colors.mask,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});

// import React, { Component } from "react"
// import { Text, View, TextInput, StyleSheet, Image } from "react-native"
// import { Button } from "react-native-elements"
// import autobind from "autobind-decorator"
// import { ImagePicker, Permissions } from "expo"
// import { Actions } from "react-native-router-flux"

// // import Amplify, { API } from 'aws-amplify'
// import { API, Storage } from "aws-amplify"
// // import aws_exports from '../../src/aws-exports'

// // Amplify.configure(aws_exports)

// export default class AddHouseScreen extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       apiResponse: null,
//       title: "0",
//       image: null,
//     }
//   }

//   // noteId is the primary key of the particular record you want to fetch
//   @autobind
//   async getNote() {
//     const path = `/House/${this.state.title}`
//     try {
//       const apiResponse = await API.get("HouseCRUD", path)
//       console.log(`response from getting hosue: ${apiResponse}`)
//       this.setState({ apiResponse })
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   @autobind
//   handleChangeNoteId(event) {
//     this.setState({ title: event })
//   }

//   @autobind
//   async pickImage() {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
//     if (status === "granted") {
//       const image = await ImagePicker.launchImageLibraryAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//       })
//       console.log(image)
//       this.setState({ image: image.uri })
//       fetch(image.uri)
//         .then(response => response.blob())
//         .then(Buffer => Storage.put(this.state.title, Buffer))
//         .then(x => console.log("SAVED IMAGE WITH KEY", x) || x)
//         .catch(err => console.log("IMAGE UPLOAD ERROR", err))
//     } else {
//       throw new Error("CAMERA_ROLL permission not granted")
//     }
//   }

//   @autobind
//   async saveNote() {
//     const newHouse = {
//       body: {
//         title: this.state.title,
//         price: "800",
//         floor: "8",
//       },
//     }
//     const path = "/House"

//     // Use the API module to save the note to the database
//     try {
//       const apiResponse = await API.post("HouseCRUD", path, newHouse)
//       console.log(`response from saving hosue: ${apiResponse}`)
//       this.setState({ apiResponse })
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   // noteId is the NoteId of the particular record you want to delete
//   @autobind
//   async deleteNote() {
//     const path = `/House/object/${this.state.title}/800`
//     try {
//       const apiResponse = await API.del("HouseCRUD", path)
//       console.log(`response from deleteing hosue: ${apiResponse}`)
//       this.setState({ apiResponse })
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   render() {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "transparent",
//         }}
//       >
//         <Text>
//           Response:{" "}
//           {this.state.apiResponse && JSON.stringify(this.state.apiResponse)}
//         </Text>
//         <Button title="Save Note" onPress={this.saveNote} />
//         <Button title="Get Note" onPress={this.getNote} />
//         <Button title="Delete Note" onPress={this.deleteNote} />
//         <Button title="Go to TabBar page" onPress={Actions.drawer} />
//         <TextInput
//           style={styles.textInput}
//           autoCapitalize="none"
//           onChangeText={this.handleChangeNoteId}
//         />
//         <View>
//           <Button title="選擇圖片並上傳" onPress={this.pickImage} />

//           {this.state.image && (
//             <Image
//               source={{ uri: this.state.image }}
//               style={{ width: 200, height: 200 }}
//             />
//           )}
//         </View>
//       </View>
//     )
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   textInput: {
//     margin: 15,
//     height: 30,
//     width: 200,
//     borderWidth: 1,
//     color: "green",
//     fontSize: 20,
//     backgroundColor: "black",
//   },
// })
