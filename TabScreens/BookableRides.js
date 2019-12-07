//Waleed Khan
import React, {Component} from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, FlatList, SafeAreaView, Image, Alert, ActivityIndicator} from 'react-native';
import Constants from 'expo-constants';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';



export default class BookableRides extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: true,
          data: firebase.database(),
          dict: [],
          auth: firebase.auth()
        }
    }
    

    async componentWillMount(){

      await this.getRides().then(() => {
        // this.setState({loading: false});
      });

    }

    componentDidMount(){
      this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
        this.setState({
          user
        });
      });
    }

    async bookRide(RID){
      var uid = this.state.user.uid;

      var userData;
      
      await this.state.data.ref('users/'+uid).once('value', (snapshot) => {
        userData = snapshot.val();
      })

      if(userData){
        userData.ridesJoined = null;
        await this.state.data.ref('users/'+uid+'/ridesJoined/'+RID).set(true);
        await this.state.data.ref('rides/'+RID+'/clients/'+uid).set(userData, () => {
          this.getRides();
        });
        
      }
    }

    async createAlert(dateTime, RID){
      Alert.alert(
        'Book Ride for ' + new Date(dateTime).toLocaleDateString() + " at " + new Date(dateTime).toLocaleString({},{hour: '2-digit', minute:'2-digit'}) +'?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
           this.bookRide(RID);
          }},
        ],
        {cancelable: true},
      )
    }
    async getRides(){

      var loadedRides = false;
      var auth = this.state.auth;
      uid = 0;
      
      var currentRides = await this.state.data.ref('rides').on('value', (snapshot) => {
        loadedRides = true;
        var dict = []

        snapshot.forEach((child) => {
          console.log("Child:");
          console.log(child)
          var clients = child.val().clients;
          
          if(auth!=null && auth!=undefined && auth.currentUser!=null && auth.currentUser!=undefined){
            
            var hostUID = child.val().hostUID;
            uid = auth.currentUser.uid;

            if(clients != undefined && clients != null){

              clients = Object.keys(clients);
              
              //If the current user is already a client/host for this booking then do nothing
              var matches = clients.filter(item => item.includes(uid));

              if((matches.length!=null &&  matches.length>0) || hostUID==uid){
                // console.log("Client is booking host")
              }
              else if(matches.length!=null && matches.length==0 && hostUID!=uid){
                //Else if the current user is not aready a client for this booking, then push the data for the booking into the dictionary for bookings to show the user 
                dict.push({
                  RID: child.key,
                  dateTime: child.val().dateTime,
                  startAddress: child.val().startAddress,
                  endAddress: child.val().endAddress,
                });
              }
            } 
            else if(hostUID != uid){
              //Else if there is not aready a client for this booking, then push the data for the booking into the dictionary for bookings to show the user 
              dict.push({
                RID: child.key,
                dateTime: child.val().dateTime,
                startAddress: child.val().startAddress,
                endAddress: child.val().endAddress,
              });
            }  
          }
        });
        //save dictionary of bookings to state, done loading
        this.setState({dict : dict, loading: false, uid: uid})
      });

    }
    render(){
        return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
              <Text style={styles.header}>Book Rides</Text>
              {this.state.loading == false && this.state.dict.length > 0 &&
              <View style = {styles.list}>
               <FlatList
                  data={this.state.dict}
                  renderItem={({ item }) => 

                      <TouchableOpacity style={styles.item} onPress = {() => {
                                this.createAlert(item.dateTime, item.RID)
                                console.log(item)
                                }}>
                        <View style ={styles.itemText}>
                          <Text style={styles.title}>{new Date(item.dateTime).toDateString()+", " + new Date(item.dateTime).toLocaleString({},{hour: '2-digit', minute:'2-digit'})}</Text>
                          <Text style={styles.subtitle}>{"Start Address:\n" + item.startAddress}</Text>
                          <Text style={styles.subtitle}>{"End Address:\n" + item.endAddress}</Text>
                        </View>
                        {/* <View style={styles.itemImage}>
                          <Image
                            style={{width: 48, height: 48}}
                            source={require('../assets/Images/Arrow-128x128.png')}
                          />
                        </View> */}
                    </TouchableOpacity>}

                  keyExtractor={item => item.RID}
                />
                {
                  this.state.loading == true && 
                  <View style={styles.loading}>
                    <ActivityIndicator
                    size="large" 
                    color="#0000ff"
                    />
                  </View>
                }
                
                
              </View>
              }
              {
                  this.state.loading == false && this.state.dict.length == 0 &&
                  <View style={styles.noRidesContainer}>
                    <Text style={styles.noRides}> No Rides to Book Right Now... </Text>
                  </View>
              }
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
    marginTop: Constants.statusBarHeight
  },
  header:{
    flex:0.1,
    paddingTop: "5%",
    color: 'black',
    fontWeight: "800",
    fontSize: 33,
    textAlign: "center",
  },
  item: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 5
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
    paddingBottom: '1%'
  },
  list:{
    flex:1,
    width: '95%',
  },
  itemText:{
    flex:1
  },
  itemImage:{
    flex:0.2,
    alignContent: 'flex-end', alignItems: 'flex-end'
  },
  flatList:{
    flex:1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  loading:{
    flex:1,
    flexDirection: "column",
    justifyContent: 'flex-start',
    paddingTop: '25%'
  },
  noRides:{
    flex:0.25,
    textAlign: 'center',
  },
  noRidesContainer:{
    flex:1,
    justifyContent: 'center',

  }
});
