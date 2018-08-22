import { StackNavigator } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import AddHouseScreen from "../Containers/AddHouseScreen";
import AuthScreen from "../Containers/AuthScreen";
import HouseList from "../Containers/HouseList";
import RootContainer from "../Containers/RootContainer";
import Storagetest from "../Containers/Storagetest";
import ViewHouse from "../Containers/ViewHouse";
import UploadPhoto from "../Components/UploadPhoto";
import styles from "./Styles/NavigationStyles";

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    LaunchScreen: { screen: LaunchScreen },
    AddHouseScreen: { screen: AddHouseScreen },
    AuthScreen: { screen: AuthScreen },
    HouseList: { screen: HouseList },
    RootContainer: { screen: RootContainer },
    Storagetest: { screen: Storagetest },
    ViewHouse: { screen: ViewHouse },
    UploadPhoto: { screen: UploadPhoto }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "AddHouseScreen",
    navigationOptions: {
      headerStyle: styles.header
    }
  }
);

export default PrimaryNav;
