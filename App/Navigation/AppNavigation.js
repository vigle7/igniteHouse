import { StackNavigator, TabNavigator } from "react-navigation";
import AddHouseScreen from "../Containers/AddHouseScreen";
import AuthScreen from "../Containers/AuthScreen";
import HouseList from "../Containers/HouseList";
import ViewHouse from "../Containers/ViewHouse";
import UploadPhoto from "../Components/UploadPhoto";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = TabNavigator(
  {
    AddHouseScreen: { screen: AddHouseScreen },
    AuthScreen: { screen: AuthScreen },
    HouseList: { screen: HouseList },
    ViewHouse: { screen: ViewHouse },
    UploadPhoto: { screen: UploadPhoto }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "AddHouseScreen",
    swipeEnabled: true,
    navigationOptions: {
      headerStyle: styles.header
    },
    tabBarOptions: {
      style: {
        padding: 15
      }
    }
  }
);

export default PrimaryNav;

// import { StackNavigator } from "react-navigation";
// import LaunchScreen from "../Containers/LaunchScreen";

// import styles from "./Styles/NavigationStyles";

// // Manifest of possible screens
// const PrimaryNav = StackNavigator(
//   {
//     AddHouseScreen: { screen: AddHouseScreen }
//   },
//   {
//     // Default config for all screens
//     headerMode: "none",
//     initialRouteName: "AddHouseScreen",
//     navigationOptions: {
//       headerStyle: styles.header
//     }
//   }
// );

// export default PrimaryNav;
