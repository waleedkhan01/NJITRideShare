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

import Modal from "react-native-modal";


export default class BookableRides extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: true,
          data: firebase.database(),
          dict: [],
          auth: firebase.auth(),
          isVisible: false,
          driverName: '',
          ridePicked: undefined,
          uid: 0
        }
        this.createAlert = this.createAlert.bind(this);
    }
    

    async componentWillMount(){

      await this.getRides().then(() => {
        // this.setState({loading: false});
      });

    }

    toggleModal() {
      this.setState({ isVisible: !this.state.isVisible });
    }
    
    async getRides(){
      var uid = 0;
      var loadedRides = false;
      var currentRides = await this.state.data.ref('rides').on('value', (snapshot) => {
        loadedRides = true;
        var dict = []

        snapshot.forEach((child) => {

          var clients = child.val().clients;
          var hostUID = child.val().hostUID;
          var auth = this.state.auth;


          if(auth!=null && auth!=undefined && auth.currentUser!=null && auth.currentUser!=undefined){
            auth = auth.currentUser.uid;
            uid = auth;
            
            if(clients != undefined && clients != null){
              clients = Object.keys(clients);
              
              //If the current user is already a client/host for this booking then do nothing
              var matches = clients.filter(item => item.includes(auth));
              if((matches.length!=null &&  matches.length>0) ){
                // console.log("Client is booking host")
                dict.push({
                  RID: child.key,
                  dateTime: child.val().dateTime,
                  startAddress: child.val().startAddress,
                  endAddress: child.val().endAddress,
                  isHost: false,
                  hostName: child.val().hostName,
                  clientNames: child.val().clientNames,
                  driverPhoneNumber: child.val().hostName,
                  driverEmail: child.val().hostEmail
                });
              }
              else if(hostUID==auth){
                dict.push({
                  RID: child.key,
                  dateTime: child.val().dateTime,
                  startAddress: child.val().startAddress,
                  endAddress: child.val().endAddress,
                  isHost: true,
                  hostName: child.val().hostName,
                  clientNames: child.val().clientNames,
                  driverPhoneNumber: child.val().hostName,
                  driverEmail: child.val().hostEmail
                });
                //Else if the current user is not aready a client for this booking, then push the data for the booking into the dictionary for bookings to show the user 
                // dict.push({
                //   RID: child.key,
                //   dateTime: child.val().dateTime,
                //   startAddress: child.val().startAddress,
                //   endAddress: child.val().endAddress,
                // });
              }
            }  
            else if(hostUID==auth){
              dict.push({
                RID: child.key,
                dateTime: child.val().dateTime,
                startAddress: child.val().startAddress,
                endAddress: child.val().endAddress,
                isHost: true,
                hostName: child.val().hostName,
                driverPhoneNumber: child.val().hostPhone,
                driverEmail: child.val().hostEmail,
              });
            } 
          }
        });
        //save dictionary of bookings to state, done loading
        this.setState({dict : dict, loading: false, uid: uid})
      });
    }

    async createAlert(){
      var ridePicked = this.state.ridePicked;
      if(ridePicked != undefined){
        Alert.alert(
          'Delete Ride for '+ new Date(ridePicked.dateTime).toLocaleDateString() + " at " + new Date(ridePicked.dateTime).toLocaleString({},{hour: '2-digit', minute:'2-digit'}) +'?',
          '',
          [
            {
              text: 'Cancel',
              onPress: async() => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: async() => {
            await this.deleteRide(ridePicked);
            }},
          ],
          {cancelable: true},
        )
      }
    }

    async deleteRide(ridePicked){
      this.toggleModal();
      var RID = ridePicked.RID;
      var uid = this.state.uid;

      //delete user from rides
      if(ridePicked.isHost == false){
        await this.state.data.ref('users/'+uid+'/ridesJoined/'+RID).set(null);
        await this.state.data.ref('rides/'+RID+'/clients/'+uid).set(null, async () => {
        });
        

      }
      //if the user created the ride, delete the entire ride
      else if(ridePicked.isHost == true){
        await this.state.data.ref('users/'+uid+'/ridesCreated/'+RID).set(null);
        await this.state.data.ref('rides/'+RID).set(null, async () => {
        });
      }
    }


    render(){
        return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
              <Text style={styles.header}>My Rides</Text>
              {this.state.loading == false && this.state.dict!=undefined && this.state.dict.length==0 &&
                  <View style={styles.noRidesContainer}>
                  <Text style={styles.noRides}> No Rides Booked Yet... </Text>
                  </View>
              }
              {(this.state.loading == false && this.state.dict!=undefined && this.state.dict.length>0) &&
              <View style = {styles.list}>
               <FlatList
                  data={this.state.dict}
                  renderItem={({ item }) => 
                      
                      <TouchableOpacity style={styles.item} onPress = { () => {
                

                                this.setState({ridePicked: item});
                                this.toggleModal()
                                
                                // this.createAlert(item.dateTime, item.RID)
                                console.log(item)
                                }}>
                        <View style ={styles.itemText}>
                          {item.isHost==true &&
                          <Text style={styles.createdTitle}>You Created:</Text>
                          }
                          {item.isHost==false &&
                          <Text style={styles.joinedTitle}>You Joined:</Text>
                          }
                          <Text style={styles.title}>{new Date(item.dateTime).toDateString()+", " + new Date(item.dateTime).toLocaleString({},{hour: '2-digit', minute:'2-digit'})}</Text>
                          <Text style={styles.subtitle}>{"Start Address:\n" + item.startAddress}</Text>
                          <Text style={styles.subtitle}>{"End Address:\n" + item.endAddress}</Text>
                        </View>
                        

                        
                    </TouchableOpacity>}

                  keyExtractor={item => item.id}
                />
                { this.state.ridePicked!=undefined &&
                <Modal
                  isVisible = {this.state.isVisible}
                  onBackdropPress={() => this.setState({ isVisible: false })}
                  animationIn = {"slideInUp"}
                  animationOut = {"zoomOutDown"}
                  style={styles.modal}
                  onSwipeComplete={() => this.setState({ isVisible: false })}
                  swipeDirection="down"
                >
                  <View style={styles.modalView}>

                    <Text style = {styles.modalTitle}>Ride Details</Text>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Driver Name:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>{ this.state.ridePicked.hostName}</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Driver Phone Number:</Text>
                      <View style = {styles.modalInfoContainer}>
                        
                        <Text style = {styles.modalText}>123-456-7890</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Driver Email:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>me@you.com</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Ride Sharers:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>Alex Blue, Cristina Decker, Eric Freeman</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Start Address:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>{this.state.ridePicked.startAddress}</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Destination:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>{this.state.ridePicked.endAddress}</Text>
                      </View>
                    </View>

                    <View style = {styles.modalTextContainer}>
                      <Text style = {styles.modalTextTitle}>Pickup Time:</Text>
                      <View style = {styles.modalInfoContainer}>
                        <Text style = {styles.modalText}>{new Date(this.state.ridePicked.dateTime).toLocaleString({},{hour: '2-digit', minute:'2-digit'})}</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.itemImage} onPress = {() => {this.createAlert()}}>
                          <Image
                            style={{width: 55, height: 55}}
                            source={require('../assets/Images/trashRed-512.png')}
                          />
                    </TouchableOpacity>
                  </View>
                </Modal>
                }
                
              </View>
              }
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
  createdTitle: {
    fontSize: 24,
    color: 'green'
  },
  joinedTitle: {
    fontSize: 24,
    color: 'blue'
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
    alignContent: 'center', 
    alignItems: 'center',
    paddingBottom: '5%',
  },
  flatList:{
    flex:1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  loading:{
    flex:1,
    flexDirection: "column",
    justifyContent: 'center',
    paddingTop: '25%'
  },
  modal: {
    justifyContent: 'flex-end',
  },
  modalView:{
    flex: 0.77, 
    paddingTop: '10%',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)', 
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignContent: 'flex-start',
    borderRadius: 25,
  },
  modalTextContainer:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  modalInfoContainer:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  modalTextTitle:{
    textAlign: 'left',
    paddingLeft: '5%',
    fontWeight: "700",
    fontSize: 16
  },
  modalText:{
    textAlign: 'left',
    paddingLeft: '2%',
    fontSize: 16
  },
  modalTitle:{
    fontSize: 32,
    textAlign: 'center',
    fontWeight: "700",
    paddingBottom: '5%'
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
