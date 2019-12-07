import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import TabBarIcon from './TabScreens/TabBarIcon';

//npm install react-navigation and react-navigation-stack
//npm install react-navigation-tabs
//or
//yarn add react-navigation
//yarn add react-native-reanimated react-native-gesture-handler react-native-screens@^1.0.0-alpha.23
//also expo install react-native-gesture-handler (if you npm install you will receive warnings)
//yarn add react-navigation-tabs
//npm install react-native-modal-datetime-picker
//npm install react-native-dark-mode
//npm install react-native-google-places-autocomplete
//npm install react-native-elements
//Expo install expo-sms
//Expo install expo-mail-composer
//npm install lodash
//npm install react-native-modal
//npm install moment

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

import LandingScreen from './Screens/LandingScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PasswordChangeScreen from './Screens/PasswordChangeScreen';

import BookRide from './TabScreens/BookRide';
import BookableRides from './TabScreens/BookableRides';
import CreateRide from './TabScreens/CreateRide';
import CreateRideMenu from './TabScreens/CreateRideMenu';
import CreateRideBegin from './TabScreens/CreateRideBegin';
import MyRides from './TabScreens/MyRides';
import Matches from './TabScreens/Matches';
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
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'}/>
      ),
      headerBackTitle: null,
    }),
  },
  CreateRide: {
    screen: CreateRide,
    navigationOptions: () => ({
      title: `Create Ride`,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}/>
      ),
      headerBackTitle: null,
    }),
  },
  MyRides: {
    screen: MyRides,
    navigationOptions: () => ({
      title: `My Rides`,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}/>
      ),
      headerBackTitle: null,
    }),
  },
  Matches: {
    screen: Matches,
    navigationOptions: () => ({
      title: `Matches`,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-git-compare' : 'md-git-compare'}/>
      ),
      headerBackTitle: null,
    }),
  },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: () => ({
      title: `Settings`,
      tabBarIcon: ({ focused }) => (
        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}/>
      ),
      headerBackTitle: null,
    }),
  },
  },
  {
    initialRouteName: 'MyRides',
    order: ['BookableRides', 'CreateRide', 'MyRides', 'Matches','SettingsScreen']
  }
);

const AppStack = createStackNavigator(
  {
    AuthNavigator,
    TabNavigator
  },
  {
    headerMode: "none",
    initialRouteName: "AuthNavigator"
  }
)

const AppContainer = createAppContainer(AppStack);
const TabContainer = createAppContainer(TabNavigator);