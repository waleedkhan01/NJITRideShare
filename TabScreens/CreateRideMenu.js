import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

//special use
import DateTimePicker from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Overlay } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default class CreateRideMenu extends React.Component{
    constructor(props){
        super(props);
        var newestDate = new Date();
        newestDate.setDate(newestDate.getDate() + 7)

        this.state = {
         data: firebase.database(),
         date: new Date(),
         formattedDate: '',
         time: new Date(),
         newestDate: newestDate,
         mode: 'date',
         show: false,
         isGoogleAutoCompleteVisible: false,
         isDatePickerVisible: false,
         isTimePickerVisible: false,
         isDarkModeEnabled: true,
         startLocation: {},
         formattedstartLocation: '',         
         endLocation: {},
         formattedendLocation: '',
         inputAddress: ''
        };
    }
    
    showDatePicker = () => {
      console.log()
      this.setState({ isDatePickerVisible: true, isDarkModeEnabled: true});
    };
  
    hideDatePicker = () => {
      this.setState({ isDatePickerVisible: false});
    };

    showGoogleAutoComplete = () => {
      this.setState({ isGoogleAutoCompleteVisible: true });
      //console.log(this.state.isGoogleAutoCompleteVisible);
    };

    hideGoogleAutoComplete = () => {
      this.setState({ isGoogleAutoCompleteVisible: false });
      //console.log(this.state.isGoogleAutoCompleteVisible);
    };
  
    handleDatePicked = date => {
      
      var formatted = this.formatDate(date)
      this.setState({date: date, formattedDate: formatted})
      this.hideDatePicker();
    };

    //Formats date into mm-dd-yyyy
    formatDate(date){
      var y = date.getFullYear();
      var m = date.getMonth();
      var d = date.getDate();
      var formatted = '' + y +'-'+ m +'-'+ d;
      return formatted;
    }

    //Format time into HH:MM
    formatTime(date){
      var h = date.getHours();
      var m = date.getMinutes();
      var format = '';
      if(h/12 > 0){
        var format = ''+ (h%12) + ':' + m + 'PM';
      }
      else{
        var format = ''+h + ':' + m + 'AM';
      }
      return format;
    }

    showTimePicker = () => {
      
      this.setState({ isTimePickerVisible: true, isDarkModeEnabled: true});
    };
  
    hideTimePicker = () => {
      this.setState({ isTimePickerVisible: false});
    };
  
    handleTimePicked = time => {
      
      var formatted = this.formatTime(time);
      this.setState({time: time, formattedTime : formatted})
      this.hideTimePicker();
    };

    async createRide(){
      

      var uid = firebase.auth().currentUser.uid;
      //if the generated RID is not already used, create a new Ride in the database
      var pushID = await this.state.data.ref('rides/').push({
          clientLimit: '1',
          hostUID: uid,
          startAddress: true,
          startLatLong: { lat: this.state.startLocation.lat, long: this.state.startLocation.long},
          endAddress: true,
          endLatLong: { lat: this.state.endLocation.lat, long: this.state.endLocation.long}, 
          timeFlex: '15',
          timeOutOfWay: '15'
        }).catch(function(error){
          console.log(error)
          console.log("ERROR: Unable to create Ride");
          return;
        });

        console.log("PUSH: "+pushID)
        //Add the ride under the user as well
        await this.state.data.ref('users/' + uid + '/ridesCreated').update({
          [pushID.key] : true
        })

        if (this.state.formattedDate != undefined && this.state.formattedTime != undefined && this.state.startLocationlat == '' && this.state.endLocationlat == '') {
          this.props.navigation.goBack();
        }
      
    }

    render(){
        return (
            <View style = {styles.container}>
              <Text style={styles.header}>Create A Ride</Text>
              <TouchableOpacity style={styles.buttonLight} onPress = {() => this.showDatePicker()}>
                  <Text style = {styles.buttonLightText}>Select Date</Text>
              </TouchableOpacity>

              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDatePicker}
                isDarkModeEnabled = {true}
                minimumDate = {this.state.date}
                maximumDate = {this.state.maximumDate}
                mode = "date"
              />

              <TouchableOpacity style={styles.buttonLight} onPress = {() => this.showTimePicker()}>
                  <Text style = {styles.buttonLightText}>Select Time</Text>
              </TouchableOpacity>
              
              <DateTimePicker
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this.handleTimePicked}
                onCancel={this.hideTimePicker}
                isDarkModeEnabled = {true}
                mode = "time"
              />

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

              <Overlay
                isVisible={this.state.isGoogleAutoCompleteVisible}
                onBackdropPress={() => this.setState({ isGoogleAutoCompleteVisible: false })}
              >
                  <View style={{ flex: 1,flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                    <Ionicons name="md-close" size={32} color="red" onPress={() => this.hideGoogleAutoComplete()} />
                    <Ionicons name="md-checkmark" size={32} color="green" onPress={() => this.hideGoogleAutoComplete()} />

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
                        this.setState({ [this.state.inputAddress]: { lat: details.geometry.location.lat, long: details.geometry.location.lng } });
                        this.setState({ [formatted]: data.description});

                        /*console.log(this.state.formattedstartLocation);
                        console.log(this.state.formattedendLocation);*/
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
                      currentLocation={false}
                    />
                  </View>
                </Overlay>

              <TouchableOpacity style={styles.buttonDark} onPress = {() => this.createRide()}>
                  <Text style = {styles.buttonDarkText}>Confirm Ride</Text>
            </TouchableOpacity>

              {this.state.formattedDate == '' && this.state.formattedTime == undefined && this.state.startLocationlat == '' && this.state.endLocationlat == '' &&
                <Text style={styles.dateTextRed}> Please Select a Date, Time, Starting Address and Ending Address</Text>
              }
              { this.state.formattedTime != undefined  && this.state.formattedDate == undefined &&
                <Text style = {styles.dateText}> {'Date: Please Select a Date ' + '\n' + 'Time: ' + this.state.formattedTime} </Text>
              } 
              { this.state.formattedTime == undefined  && this.state.formattedDate != undefined && this.state.formattedDate != '' &&
                <Text style = {styles.dateText}> {'Date: ' + this.state.formattedDate + '\n' + 'Time: Please Select a Time'} </Text>
              } 
              { this.state.formattedTime != undefined  && this.state.formattedDate != undefined &&
                <Text style = {styles.dateText}> {'Date: ' + this.state.formattedDate + '\n' + 'Time: ' + this.state.formattedTime} </Text>
              } 
              <Text style = {styles.spacer}>
              </Text>
                
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
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
  buttonLightText: {
    color: 'black',
    fontSize: 12
  },
  buttonDark:{
    flex: 0.075,
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
