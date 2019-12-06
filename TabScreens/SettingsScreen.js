import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

export default class SettingsScreen extends React.Component{
    constructor(props){
        super(props);

    }

  changeScreen = () => {
    this.props.navigation.navigate('AuthNavigator');
  }

  async signOut() {
      err = ''
    await firebase.auth().signOut().then(function () {
      console.log('Successfully logged out');
      }).catch(function (error) {
        // An error happened.
        err = error
        console.log("Signed Out Failed");
        console.log(error);
      });

      if (err == '') {
        console.log('Nagivating to Landing screen');
        this.props.navigation.navigate('AuthNavigator');
      }

    }

    render(){
        return (
            <View style = {styles.container}>
              <Text>Settings</Text>
              <TouchableOpacity style={styles.buttonRed} onPress={() => this.signOut()}>
                <Ionicons name="md-log-out" color="white" size={32}/>
                <Text style={styles.buttonLightText}>Logout</Text>
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
  },
    buttonRed: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    backgroundColor: "red",
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 15,
    width: "40%",
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    color: 'white',
  },
  buttonLightText: {
    color: 'white',
    fontSize: 16
  },
});
