import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, Image} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import CreateRideMenu from './CreateRideMenu'

export default class CreateRide extends React.Component{
    constructor(props){
        super(props);
    }

    createRide(){
      console.log("navigating");
      this.props.navigation.navigate('CreateRideMenu');
    }

    render(){
        return (
            <View style = {styles.container}>
              <TouchableOpacity
                onPress = {() => this.createRide()}
              >
              
                <Image
                style={{width: 125, height: 125}}
                source={require('../assets/Images/Plus.png')}
                />

              </TouchableOpacity>
             
            </View>
        );
    }
}

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
