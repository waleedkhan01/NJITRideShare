import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//npm install react-navigation and react-navigation-stack
//npm install react-navigation-tabs
//or
//yarn add react-navigation
//yarn add react-native-reanimated react-native-gesture-handler react-native-screens@^1.0.0-alpha.23
//also expo install react-native-gesture-handler (if you npm install you will receive warnings)
//yarn add react-navigation-tabs
//npm install react-native-modal-datetime-picker
//react-native-dark-mode

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import LandingScreen from './Screens/LandingScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PasswordChangeScreen from './Screens/PasswordChangeScreen';

import BookRide from './TabScreens/BookRide';
import BookableRides from './TabScreens/BookableRides';
import CreateRide from './TabScreens/CreateRide';
import CreateRideMenu from './TabScreens/CreateRideMenu';
import CreateRideBegin from './TabScreens/CreateRideBegin';
import MyRides from './TabScreens/MyRides';
import SettingsScreen from './TabScreens/SettingsScreen';


export default class App extends React.Component {
  render(){
    return (
      
      <View style = {styles.container}>
        <AppContainer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

const AuthNavigator = createStackNavigator({
  
  LandingScreen: LandingScreen,
  SignUpScreen: SignUpScreen,
  PasswordChangeScreen: PasswordChangeScreen,
  },
  {
    initialRouteName: 'LandingScreen',
    headerMode: 'none',
    header: {
      left: null,
    }
  }
);



const TabNavigator = createBottomTabNavigator({
  
  BookableRides: {
    screen: BookRide,
    navigationOptions: () => ({
      title: `Book`,
      headerBackTitle: null,
    }),
  },
  CreateRide: {
    screen: CreateRide,
    navigationOptions: () => ({
      title: `Create Ride`,
      headerBackTitle: null,
    }),
  },
  MyRides: {
    screen: MyRides,
    navigationOptions: () => ({
      title: `My Rides`,
      headerBackTitle: null,
    }),
  },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: () => ({
      title: `Settings`,
      headerBackTitle: null,
    }),
  },
  },
  {
    initialRouteName: 'BookableRides',
    order: ['BookableRides', 'CreateRide', 'MyRides', 'SettingsScreen']
  }
);

const AppStack = createStackNavigator(
  {
    AuthNavigator,
    TabNavigator
  },
  {
    headerMode: "none",
    initialRouteName: "TabNavigator"
  }
)

const AppContainer = createAppContainer(AppStack);
const TabContainer = createAppContainer(TabNavigator);