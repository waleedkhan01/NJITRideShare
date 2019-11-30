import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, Image} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import CreateRideMenu from './CreateRideMenu'
import CreateRideBegin from './CreateRideBegin'

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

const RideStack = createStackNavigator({
  
  CreateRideMenu: CreateRideMenu,
  CreateRideBegin: CreateRideBegin
  },
  {
    initialRouteName: 'CreateRideBegin',
    headerMode: 'none',
    header: {
      left: null,
    }
  }
);

const AppContainer = createAppContainer(RideStack);
export default AppContainer;