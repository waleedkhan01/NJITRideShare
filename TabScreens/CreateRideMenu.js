import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

//special use
import {randomString} from 'random-string';
import DateTimePicker from "react-native-modal-datetime-picker";

export default class CreateRideMenu extends React.Component{
    constructor(props){
        super(props);
        var randomString = require('random-string');
        var x = randomString(); // x contains now a random String with the length of 8
        
 
        var newestDate = new Date();
        newestDate.setDate(newestDate.getDate() + 7)

        this.state = {
         random: x,
         date: new Date(),
         newestDate: newestDate,
         mode: 'date',
         show: false,
         isDateTimePickerVisible: false,
         isDarkModeEnabled: true
        };
    }
    
    showDateTimePicker = () => {
      console.log()
      this.setState({ isDateTimePickerVisible: true, isDarkModeEnabled: true});
    };
  
    hideDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: false});
    };
  
    handleDatePicked = date => {
      console.log("A date has been picked: ", date);
      this.hideDateTimePicker();
    };

    
    render(){

        return (
            <View style = {styles.container}>
             <Text style={styles.header}>Create A Ride</Text>
             <Button title="Show DatePicker" onPress={this.showDateTimePicker} />
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                isDarkModeEnabled = {true}
                minimumDate = {this.state.date}
                maximumDate = {this.state.maximumDate}
              />

              {this.state.random != null &&
                <Text>{this.state.random} </Text>}
                
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
  header:{
    paddingTop: "25%",
    color: 'black',
    fontWeight: "800",
    fontSize: 33,
    textAlign: "center"
  },
  select:{
    fontSize: 35
  }
});
