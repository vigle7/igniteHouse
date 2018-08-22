import { StackNavigator } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import AddHouseScreen from "../Containers/AddHouseScreen";
import AuthScreen from "../Containers/AuthScreen";
import HouseList from "../Containers/HouseList";
import RootContainer from "../Containers/RootContainer";
import ViewHouse from "../Containers/ViewHouse";
import UploadPhoto from "../Components/UploadPhoto";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    RootContainer: { screen: RootContainer }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "RootContainer",
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

export default PrimaryNav;
