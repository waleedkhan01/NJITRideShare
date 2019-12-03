import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';

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


/*


referential integrity checklist




*/



//**************************************************** */
//const googleMapsClient = require('@google/maps').createClient({
//  key: 'AIzaSyByKskZI_u6sZgApyVEruIJMJgk7kXHMUI'
//});

//**************************************************** */
/*const firebaseConfigHP = {
  apiKey: "AIzaSyDDwjbsTUbyxErb9WtU35ztJuRO1fQ7Ycs",
  authDomain: "carpool-hp.firebaseapp.com",
  databaseURL: "https://carpool-hp.firebaseio.com",
  projectId: "carpool-hp",
  storageBucket: "carpool-hp.appspot.com",
  messagingSenderId: "794248439085",
  appId: "1:794248439085:web:dadf4a9e1f366750815fa4",
  measurementId: "G-THQCV1QRYP"
};
//*********************************************************************************************************************************** */
function test(){
  var geo_ridekey
   console.log("hp testing");
   geo_ridekey = 'hp_play/rides/'
   var newrideref =  firebase.database().ref(geo_ridekey);
   var start_location;
   var end_location;
   
       newrideref.once('value').then(
       function(snapshot) {
         end_location = snapshot.child("end_location").val();
         start_location = snapshot.child("start_location").val();
         start_lat_lng = dogeocode(start_location,"/start_location_latlng","start_location",geo_ridekey);
         end_lat_lng = dogeocode(end_location,"/end_location_latlng","end_location",geo_ridekey);
         console.log(end_location+"/"+start_location)  ;
         }
       );
   
     
   
     return
 
 }
//*********************************************************************************************************************************** */
export default class MatchScreen extends React.Component{
  
  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };
    }

  state = {
    loading: true,
    listitems: new Array
  }
  /****************************************** */ 
        
  dosnap(snapshot,  that)    {
    console.log("dosnapshot:"+snapshot.key)
    // We have the list of matches at this point
    
    
    var start_location
    snapshot.forEach( function(snap){
      rideid_key = snap.child("parent_rideid").val()
      child_rideid_key = snap.child("child_rideid").val()
      child_rideid_key = "hp_play/rides/"+child_rideid_key

      rideid_key = "hp_play/rides/"+rideid_key
      console.log('wtf')
      console.log(rideid_key + " / "+ child_rideid_key)

      rideid_ref = firebase.database().ref(rideid_key)
      // Now we get the ride that goes with it
      rideid_ref.once('value').then(function(ride_snapshot) {
        end_location = ride_snapshot.child("end_location").val();
        start_location = ride_snapshot.child("start_location").val();
        time = ride_snapshot.child("time").val();
        console.log(end_location+"/"+start_location)  ;
        
        // Now we get the child ride    
        child_rideid_ref = firebase.database().ref(child_rideid_key)
        child_rideid_ref.once('value').then(function(child_ride_snapshot) {                  
          
          child_ride_start_location = child_ride_snapshot.child("start_location").val()
          child_ride_end_location = child_ride_snapshot.child("end_location").val()
          child_ride_time = child_ride_snapshot.child("time").val()
          console.log("childride: "+child_ride_start_location )
          // Now the user that goes with the child ride                                   
          child_rideid_userid = child_ride_snapshot.child("userid").val();
          child_user_key = "hp_play/users/"+child_rideid_userid
          child_user_ref = firebase.database().ref(child_user_key)
          child_user_ref.once('value').then(function(child_user_snapshot) {
            child_user_name = child_user_snapshot.child("name").val()
            child_user_email = child_user_snapshot.child("email").val()
            child_user_phone = child_user_snapshot.child("phone").val()

            // we are now like three levels of asynch functions deep and we have to be careful to retrigger render
            val= [snap.key ,
              {start_location : start_location,
              end_location: end_location,
              time: time, 
              child_ride_start_location:child_ride_start_location,
              child_ride_end_location:child_ride_end_location,
              child_ride_time:child_ride_time,
              child_user_name:child_user_name,
              child_user_email:child_user_email,
              child_user_phone:child_user_phone}]

              console.log(val)
              the_array = that.state.listitems

              the_array.push(_.cloneDeep(val))        
              val[0] = val[0]+"_"
              the_array.push(_.cloneDeep(val))        
                         
                            
              console.log("Heres the array: ")
              console.log( the_array)
              that.setState({listitems:the_array})
              console.log("Heres the state: ")
              console.log( that.state.listitems)
          })
        })            
      })
    })
  };
     
  /****************************************** */ 
  componentDidMount() {
    console.log("hereiam")
      //const currentUser = firebase.auth().currentUser.uid;
      firebase.database().ref('hp_play/matches/-LucaAHrnRB3M__T-tZg/').on('value',(snapshot) =>{
              
              this.dosnap(snapshot, this);
              this.setState({loading:false})
              console.log("listener done... I should be seeing something...")
      })
        
    }  

    touchlist(item)
    {
      console.log("touched") 
      this.props.navigation.navigate('MatchDetail', {detail:item});
    }
    /****************************************** */
    renderItem({item})  
    {      
      console.log("renderitem:"+ item[1])
      
      return(
      <View>
      <TouchableOpacity onPress = {() => this.touchlist(item) }>
      <ListItem title = {item[1].child_user_name +" is leaving from " + item[1].child_ride_start_location +" on "+ item[1].child_ride_time}
       subtitle={"You looked for "+ item[1].start_location+" at "+ item[1].time} /></TouchableOpacity></View>); 
    } 
    /****************************************** */
    render(){
      console.log('render')  
      console.log(this.state.listitems.length)
      if (this.state.loading) { 
        console.log('rendering:loading true')
        return (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>          
            <ActivityIndicator size="large" color="dodgerblue" />
          </View>
        )
      }
      else
          console.log("rendering: loading false") 
          
          console.log(_.cloneDeep(this.state.listitems))
          return (
          <View style = {{alignItems: 'stretch'}}>
            <StatusBarBackground style={{backgroundColor:'midnightblue'}}/>
            <MyAppHeaderText> </MyAppHeaderText>
            <MyAppHeaderText>Your Matched Rides</MyAppHeaderText>          
            <FlatList
              data = {_.cloneDeep(this.state.listitems)}
              renderItem={this.renderItem.bind(this)} // the bind gives that function the conext it need to get 'this' 
              keyExtractor={item => item[0]}
            />

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

class MyAppHeaderText extends React.Component {
  render() {
    return (
      <Text>
        <Text style={{fontSize: 20}}>{this.props.children}</Text>
      </Text>
    );
  }
}