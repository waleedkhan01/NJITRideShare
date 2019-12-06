import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, Alert} from 'react-native';

import {  ActivityIndicator, FlatList } from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { YellowBox } from 'react-native';
import{ ListItem} from 'react-native-elements';
import _ from 'lodash';
import StatusBarBackground from '../Screens/statusbar'

import * as SMS from 'expo-sms';  // EXPO INSTALL expo-sms
import * as MailComposer from 'expo-mail-composer'; //expo install expo-mail-composer
import * as db from '../Screens/databaseHelper';
import { Linking } from 'expo';
//*********************************************************************************************************************************** */
export default class MatchDetail extends React.Component{
  
  state = {
    loading: true,
    matchkey:'' , 
    item: {}
  }
  
  constructor(props){
      super(props);

      var item = this.props.navigation.state.params.detail;
      console.log(item)
      this.state.matchkey = item[0]
      this.state.item = _.cloneDeep(item[1])

      YellowBox.ignoreWarnings(['Setting a timer']);
      const _console = _.clone(console);
      console.warn = message => {
        if (message.indexOf('Setting a timer') <= -1) {
          _console.warn(message); 
        }
      };
      };
  
  /****************************************** */ 
  viewProfile(){
    console.log("view profile pressed")

    this.props.navigation.navigate('Profile');

    

  }
  bookRide(riderId, driverId, rideId)
  {
    console.log("Rider:" + riderId +" joining ride "+rideId)
    riderJoinKey='users/' + riderId +"/ridesJoined/"+rideId
    riderKey='rides/' + rideId +"/clients/" + riderId
    
    var rideJoinRef =  firebase.database().ref(riderJoinKey);
    var rideRef =   firebase.database().ref(riderKey);
    
    
    newRef = rideJoinRef.set({
      [rideId ]:true,       
    })

    newRef = rideRef.set({
      [riderId] :true,       
    })



  }
  bookMyRide(){

    console.log("Booking my ride")
    console.log(this.state.item)
    riderId =  this.state.item.child_user_id
    driverId = this.state.item.userId
    rideId = this.state.item.rideId    
    db.removeRide(item.childRideId)
    this.bookRide(riderId, driverId, rideId)
    this.props.navigation.goBack()

  }
  bookTheirRide(){


    console.log("Booking their ride")
    console.log(this.state.item)
    riderId =  this.state.item.userId
    driverId = this.state.item.child_user_id
    rideId = this.state.item.childRideId
    
    this.bookRide(riderId, driverId, rideId)
    db.removeRide(this.state.item.rideId)
    this.props.navigation.goBack()
  }
    

    /****************************************** */ 
    bookIt(){
    Alert.alert(
      'Book Ride',
      'Keep which ride?  This will cancel the other.',
      [
        {text: 'My Ride', onPress: () => this.bookMyRide()},
        {text: 'Their Ride', onPress: () => this.bookTheirRide(), style: 'cancel'}
      ],
      { cancelable: true }
    )
  }

  callUser()
  {
    console.log("call user")
    Linking.openURL(`tel:${item.child_user_phone}`);

  }

  textUser()
  {
    console.log("text user")
    const isAvailable =  SMS.isAvailableAsync();
    if (isAvailable) {
      SMS.sendSMSAsync(
        item.child_user_phone, "Hello! I'd like to share a ride with you from "+item.start_location +" around " +  item.time
      );
    } else {
      alert("Sorry, text messages are not available on this device")
    }

  }

  emailUser()
  {
    console.log("email  user")
    MailComposer.composeAsync({
      recipients: [item.child_user_email],
      subject: "I'd like to share a ride!",
      body: "Hello! I'd like to share a ride with you from "+item.start_location +" around " +  item.time
      })
  }


  render()
  {

    item = _.cloneDeep(this.state.item)
    return( 

      <View style = {styles.container}>
            

        <MyAppHeaderText></MyAppHeaderText>
        <MyAppHeaderGreenText>Your ride: </MyAppHeaderGreenText> 
        <MyAppHeaderText>{item.start_location} to</MyAppHeaderText>
        <MyAppHeaderText>{item.end_location}</MyAppHeaderText>
        <MyAppHeaderText> on {item.full_time}</MyAppHeaderText>         
        <MyAppHeaderBlueText></MyAppHeaderBlueText>
        <MyAppHeaderText>Their ride: </MyAppHeaderText> 
        <MyAppHeaderText>{item.child_user_name}</MyAppHeaderText>
        <MyAppHeaderText>{item.child_ride_start_location} to </MyAppHeaderText>
        <MyAppHeaderText>{item.child_ride_end_location}</MyAppHeaderText>
        <MyAppHeaderText>on {child_ride_full_time}</MyAppHeaderText>
        <MyAppHeaderText></MyAppHeaderText>
        <MyAppHeaderText>You can reach them at:</MyAppHeaderText>              
        <MyAppHeaderText>{item.child_user_email} </MyAppHeaderText>              
        <MyAppHeaderText>{item.child_user_phone}</MyAppHeaderText>              
        
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.buttonLight} onPress = {() => this.callUser()}>
              <Text style = {styles.buttonLightText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonLight} onPress = {() => this.textUser()}>
              <Text style = {styles.buttonLightText}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLight} onPress = {() => this.emailUser()}>
              <Text style = {styles.buttonLightText}>Email</Text>
          </TouchableOpacity>

        </View>

        <View style={{ flexDirection: 'row' }}>  
          <TouchableOpacity style={styles.buttonLight} onPress = { () => this.viewProfile() }>
            <Text style = {styles.buttonLightText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLight} onPress = { () => this.bookIt() }>
            <Text style = {styles.buttonLightText}>Book</Text>
          </TouchableOpacity>
        </View>
        <MyAppHeaderText></MyAppHeaderText>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.buttonLight} onPress = { () => this.props.navigation.goBack() }>
            <Text style = {styles.buttonLightText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  } //Render
}
  
  class MyAppHeaderText extends React.Component {
    render() {
      return (
        <Text>
          <Text style={{fontSize: 18}}>{this.props.children}</Text>
        </Text>
      );
    }
  }

  class MyAppHeaderGreenText extends React.Component {
    render() {
      return (
        <Text>
        <Text style={{fontSize: 18,color: 'green'}}>{this.props.children}</Text>
        </Text>
      );
    }
  }

  class MyAppHeaderBlueText extends React.Component {
    render() {
      return (
        <Text>
          <Text style={{fontSize: 18,color: 'blue'}}>{this.props.children}</Text>
        </Text>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#a8a8a8',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    generic:{
      flex:1,
      width: '100%',
      alignItems: "center",
      justifyContent: "center",
    },
    header:{
      flex:0.1,
      paddingTop: "15%",
      color: 'black',
      fontWeight: "800",
      fontSize: 33,
      textAlign: "center",
    },
    select:{
      fontSize: 35 
    },
    styles:{
      flex:1,
    },
    buttonLight:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderColor: 'black',
      borderWidth: 3, 
      borderRadius: 15,
      width: "40%",
      height: 40,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 2, // Android
      color:'white',
    },
    buttonLightText: {
      color: 'black',
      fontSize: 20
    },
    buttonDark:{
      //flex: 0.075,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      borderColor: 'black',
      borderWidth: 3,
      borderRadius: 15,
      width: "40%",
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 2, // Android
      color:'white',
    },
    buttonDarkText: {
      color: 'white',
      fontSize: 12
    },
    spacer: {
      flex: 0.01,
      width: '20%',
    },
    dateText: {
      flex: 0.1,
      width: '80%',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center'
    },
    dateTextRed: {
      flex: 0.1,
      width: '80%',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      color: 'red',
    }
  });
  