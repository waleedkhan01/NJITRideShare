import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, Image} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Helpers/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import MatchScreen from './MatchScreen'
import MatchDetail from './MatchDetail'
import ProfileScreen from '../Screens/profileScreen';


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: '#a8a8a8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generic:{
    flex:1,
    width: '100%',
    alignItems: "center",
    justifyContent: "space-around",
  }
});

const MatchStack = createStackNavigator({
  
  MatchScreen: MatchScreen,
  MatchDetail: MatchDetail,
  Profile: ProfileScreen
  },
  {
    initialRouteName: 'MatchScreen',
    headerMode: 'none',
    header: {
      left: null,
    }
  }
);

const AppContainer = createAppContainer(MatchStack);
export default AppContainer;