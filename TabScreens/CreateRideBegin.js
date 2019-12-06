import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { blue, black, white } from 'ansi-colors';
import Constants from 'expo-constants';

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
              <View style = {styles.generic}>
                <Text style={styles.header}>Create a Ride</Text>

                  <View style = {styles.imageContainer}>
                  
                    <TouchableOpacity
                    onPress = {() => this.createRide()}
                    >
                      <Image
                      style={{width: 125, height: 125}}
                      source={require('../assets/Images/Plus-512x512.png')}
                      loadingIndicatorSource={<ActivityIndicator
                        size="large" 
                        color="#0000ff"
                        />}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#a8a8a8',
  },
  header:{
    flex:0.1,
    paddingTop: "5%",
    color: 'black',
    fontWeight: "800",
    fontSize: 33,
    textAlign: "center",
  },
  imageContainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generic:{
    flex:1,
    width: '100%',
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: Constants.statusBarHeight
  },
});
