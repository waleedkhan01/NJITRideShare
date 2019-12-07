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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Overlay } from 'react-native-elements';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import * as matchMaker from '../Screens/matchHelper';



export default class BookableRides extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: true,
          data: firebase.database(),
          dict: [],
          auth: firebase.auth(),
          isGoogleAutoCompleteVisible: false,
          startLocation: {},
          formattedstartLocation: undefined,
          endLocation: {},
          formattedendLocation: undefined,
          inputAddress: '',
          sorted: false
        }
    }

    showGoogleAutoComplete = () => {
      this.setState({ isGoogleAutoCompleteVisible: true });
      //console.log(this.state.isGoogleAutoCompleteVisible);
      };

    hideGoogleAutoComplete = () => {
      this.setState({ isGoogleAutoCompleteVisible: false });
      //console.log(this.state.isGoogleAutoCompleteVisible);
      };

  distCompare(a, b) {
    console.log('Sorting by distance')
    const distA = a.totalDist
    const distB = b.totalDist

    let comparison = 0;

    if (distA > distB) {
        comparison = 1;
      }
    else if (distA < distB) {
        comparison = -1;
      }
      return comparison;
  };

  distanceSort = () => {
    console.log('Sort started')
    let dict = this.state.dict;
    let filterStartAddress = this.state.startLocation;
    let filterendAddress = this.state.endLocation;

    for (var i = 0; i < dict.length; i++) {
      console.log('for loop started')
      let startLocation = dict[i].startLatLong
      let endLocation = dict[i].endLatLong

      //console.log(startLocation.lat + " " + endLocation.long)
      let totalDist = matchMaker.haversine_lat_long(filterStartAddress, startLocation)
      totalDist += matchMaker.haversine_lat_long(filterendAddress, endLocation)
      console.log(totalDist);
      dict[i].totalDist = totalDist;      
    }
    this.setState({ dict: dict })
  };

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
      if(uid){
        console.log('users/'+uid+'/ridesJoined/'+RID)
        await this.state.data.ref('users/'+uid+'/ridesJoined/'+RID).set(true);
        await this.state.data.ref('rides/'+RID+'/clients/'+uid).set(true, () => {
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
      var currentRides = await this.state.data.ref('rides').on('value', (snapshot) => {
        loadedRides = true;
        var dict = []

        snapshot.forEach((child) => {
          var clients = child.val().clients;
         
          if(clients != undefined && clients != null){
            clients = Object.keys(clients);
            var hostUID = child.val().hostUID;
            var auth = this.state.auth;

            if(auth!=null && auth!=undefined && auth.currentUser!=null && auth.currentUser!=undefined){
              auth = auth.currentUser.uid;
              // console.log("AUTH:" + auth)
              
              //If the current user is already a client/host for this booking then do nothing
              var matches = clients.filter(item => item.includes(auth));
              if((matches.length!=null &&  matches.length>0) || hostUID==auth){
                // console.log("Client is booking host")
              }
              else if(matches.length!=null && matches.length==0 && hostUID!=auth){
                //Else if the current user is not aready a client for this booking, then push the data for the booking into the dictionary for bookings to show the user 
                dict.push({
                  RID: child.key,
                  dateTime: child.val().dateTime,
                  startAddress: child.val().startAddress,
                  endAddress: child.val().endAddress,
                  startLatLong: child.val().startLatLong,
                  endLatLong: child.val().endLatLong,
                  totalDist: 0
                });
                console.log(dict)
              }
            }   
          }
        });
        //save dictionary of bookings to state, done loading
        this.setState({ dict: dict, loading: false })
      });

    }
    render(){
      return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
            <Text style={styles.header}>Book Rides</Text>
            <View style={styles.filter}>
              <TouchableOpacity style={styles.buttonLight} onPress={() => {
                this.showGoogleAutoComplete();
                this.setState({ inputAddress: "startLocation" })
              }}>
                <Text style={styles.buttonLightText}>Select Start Address</Text>
              </TouchableOpacity>

                <TouchableOpacity style={styles.buttonLight} onPress={() => {
                  this.showGoogleAutoComplete();
                  this.setState({ inputAddress: "endLocation" })
                }}>
                  <Text style={styles.buttonLightText}>Select End Address</Text>
                </TouchableOpacity>
                <AntDesign name="filter" size={32} color="white" onPress={() => {
                  this.distanceSort()
                  this.setState({sorted:  true});
                }} />
            </View>

              {this.state.loading == false && this.state.dict.length > 0 &&
              <View style = {styles.list}>
               <FlatList
                  data={this.state.sorted ? this.state.dict.sort(this.distCompare) : this.state.dict}
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

                <Overlay
                  isVisible={this.state.isGoogleAutoCompleteVisible}
                  onBackdropPress={() => this.setState({ isGoogleAutoCompleteVisible: false })}
                >
                  <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                    <View style={{ alignSelf: 'center', height: 50, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/*<Ionicons name="md-close" size={32} color="red" onPress={() => this.hideGoogleAutoComplete()}/>
                  <Ionicons name="md-checkmark" size={32} color="green" onPress={() => this.hideGoogleAutoComplete()} />*/}
                      <Text style={styles.actionText} onPress={() => this.hideGoogleAutoComplete()}>Cancel</Text>
                      <Text style={styles.actionText} onPress={() => this.hideGoogleAutoComplete()}>Confirm</Text>
                    </View>

                    <GooglePlacesAutocomplete
                      placeholder='Enter Location'
                      minLength={2}
                      autoFocus={false}
                      returnKeyType={'default'}
                      listViewDisplayed='auto'
                      fetchDetails={true}
                      renderDescription={row => row.description} // custom description render


                      onPress={(data, details = null) => {
                        //console.log(data, details);
                        let formatted = 'formatted' + this.state.inputAddress
                        this.setState({ [this.state.inputAddress]: { lat: details.geometry.location.lat, long: details.geometry.location.lng } }
                        );
                        this.setState({ [formatted]: data.description });

                        console.log(this.state.formattedstartLocation);
                        console.log(this.state.formattedendLocation);
                      }}
                      query={{
                        key: 'AIzaSyCkSccKLoUZ2pGuwh35miYfrSVGSFTYcoc',
                        language: 'en', // language of the results
                        types: 'address'
                      }}

                      styles={{
                        textInputContainer: {
                          width: '100%'
                        },
                        description: {
                          fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                          color: '#1faadb'
                        }
                      }}
                    />

                  </View>
                </Overlay>
                
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
    paddingTop: '10%',
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
  },
  buttonLight: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    width: "30%",
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    color: 'white',
  },
  buttonLightText: {
    color: 'black',
    fontSize: 12
  },
  filter: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionText: {
    color: 'cornflowerblue'
  }
});
