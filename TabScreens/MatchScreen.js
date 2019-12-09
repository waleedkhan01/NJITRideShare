import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';

import {  ActivityIndicator, FlatList } from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Helpers/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { YellowBox } from 'react-native';
import{ ListItem} from 'react-native-elements';
import _ from 'lodash';
import StatusBarBackground from '../Screens/statusbar'
import Constants from 'expo-constants';
import moment from 'moment';  





import * as matchMaker from '../Helpers/matchHelper';



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
    var the_array= []
    that.setState({listitems:[]})
    snapshot.forEach( function(snap){
      matchKey = snap.key
      console.log("*******************************************************OUTTER LOOP")
      rideId = snap.child("parent_rideid").val()
      child_rideid = snap.child("child_rideid").val()
      child_rideid_key = "rides/"+child_rideid

      rideid_key = "rides/"+rideId
      
      
      console.log(rideid_key + " / "+ child_rideid_key)

      rideid_ref = firebase.database().ref(rideid_key)
      // Now we get the ride that goes with it
      rideid_ref.once('value').then(function(ride_snapshot) {
        console.log("*******************************************************GETTING RIDE")
        user_id = ride_snapshot.child("hostUID").val();
        end_location = ride_snapshot.child("endAddress").val();
        start_location = ride_snapshot.child("startAddress").val();
        time =moment( new Date(ride_snapshot.child("dateTime").val())).format("LL");
        full_time =moment( new  Date(ride_snapshot.child("dateTime").val())).format("lll");
        console.log(end_location+"/"+start_location)  ;
        
        // Now we get the child ride    
        child_rideid_ref = firebase.database().ref(child_rideid_key)
        child_rideid_ref.once('value').then(function(child_ride_snapshot) {                  
          console.log("*******************************************************GETTING CHILD RIDE")
          child_ride_start_location = child_ride_snapshot.child("startAddress").val()
          child_ride_end_location = child_ride_snapshot.child("endAddress").val()
          child_ride_time = moment(new Date(child_ride_snapshot.child("dateTime").val())).format("LL")
          child_ride_full_time = moment(new Date(child_ride_snapshot.child("dateTime").val())).format("lll")
          console.log("childride: "+child_ride_start_location )
          // Now the user that goes with the child ride                                   
          child_rideid_userid = child_ride_snapshot.child("hostUID").val();
          child_user_key = "users/"+child_rideid_userid
          console.log("*******************************************************GETTING CHILD USER")
          child_user_ref = firebase.database().ref(child_user_key)
          child_user_ref.once('value').then(function(child_user_snapshot) {
            
            child_user_id  = child_user_snapshot.key
            child_user_name = child_user_snapshot.child("email").val()
            child_user_email = child_user_snapshot.child("email").val()
            child_user_phone = child_user_snapshot.child("phoneNumber").val()

            // we are now like three levels of asynch functions deep and we have to be careful to retrigger render
            val= [snap.key ,
              {start_location : start_location,
              end_location: end_location,
              time: time, 
              full_time: full_time, 
              matchKey: matchKey, 
              userId: user_id, 
              rideId: rideId, 
              childRideId : child_rideid,
              child_user_id : child_user_id,
              child_ride_start_location:child_ride_start_location,
              child_ride_end_location:child_ride_end_location,
              child_ride_time:child_ride_time,
              child_ride_full_time:child_ride_full_time,
              child_user_name:child_user_name,
              child_user_email:child_user_email,
              child_user_phone:child_user_phone}]

              console.log("val"+val)
              the_array = that.state.listitems
              
              the_array.push(_.cloneDeep(val))        
              
              console.log("snap list size" + that.state.listitems.length)               
              console.log("the array size " + the_array.length)               
              that.setState({listitems:the_array})
              console.log("snap list size" + that.state.listitems.length)
              
          })
        })            
      })
    })
  };
  loadMatches()
  {
    const currentUser = firebase.auth().currentUser.uid;
    firebase.database().ref('matches/'+currentUser).on('value',(snapshot) =>{
              
    this.dosnap(snapshot, this);
    this.setState({loading:false})
    console.log("listener done... I should be seeing something...")
})


  }     
  /****************************************** */ 
  componentDidMount() {
    console.log("hereiam")
      const currentUser = firebase.auth().currentUser.uid;
      //firebase.database().ref('hp_play/matches/-LucaAHrnRB3M__T-tZg/').on('value',(snapshot) =>{
      console.log("loading matches for "+currentUser)
      this.loadMatches()
    }  

    touchlist(item)
    {
      console.log("touched") 
      this.props.navigation.navigate('MatchDetail', {detail:item});  

    }
    /****************************************** */
    renderItem({item})  
    {      
      console.log("renderitem:"+ item[1].child_user_name)
      Line1 = item[1].child_user_name 
      Line2= item[1].child_ride_start_location +" on "+ item[1].child_ride_time
      Line3 = "Close to your ride "+ item[1].start_location+" at "+ item[1].time
          
      return(
        <View style = {styles.list}>
          <TouchableOpacity  style={styles.item} onPress = {() => this.touchlist(item) }>
            <View style ={styles.itemText}>
              <Text style={styles.midtitle}>{Line1}</Text>
              <Text style={styles.subtitle}>{Line2} </Text>
              <Text style={styles.subtitle}>{Line3} </Text>
            </View>
          </TouchableOpacity>
        </View>
      ); 
    } 
    /****************************************** */
    render(){
      console.log('render')  
      console.log("list size" + this.state.listitems.length)
      if (this.state.loading) { 
        console.log('rendering:loading true')
        return (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>          
            <ActivityIndicator size="large" color="dodgerblue" />
          </View>
        )
      }
      else {
        if (this.state.listitems.length == 0) {
          return(
            <View style = {styles.container}>
              <View style = {styles.generic}>
                <View style = {styles.list}>
                  <Text style={styles.header}>Matched Rides</Text>
                    <TouchableOpacity style={styles.buttonLight} onPress = {() => matchMaker.matchRide("-LvQu7wk1xV_vuQqDf3f")}>
                      <Text style = {styles.buttonLightText}>               </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonLight} onPress = {() => matchMaker.matchUser( firebase.auth().currentUser.uid)}>
                      <Text style = {styles.buttonLightText}>               </Text>
                    </TouchableOpacity>
                    <View style ={styles.buttonLightText}>
                      
                        <Text style ={{ textAlign:'center'}}>Sorry, no matches right now...</Text>
                      
                    </View>
                  </View>
                </View>
              </View>        
            )

        }
        else
          return (
            <View style = {styles.container}>
              <View style = {styles.generic}>
                <View style = {styles.list}>
                  <Text style={styles.header}>Matched Rides</Text>
                    
                  <FlatList syle ={"paddingBottom: 10%"}
                    data = {_.cloneDeep(this.state.listitems)}
                    renderItem={this.renderItem.bind(this)} // the bind gives that function the conext it need to get 'this' 
                    keyExtractor={item => item[0]}
                  />
                  </View>
                </View>
              </View>        
            
    
          );
      }            
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
      //backgroundColor :"red"
    },
    generic:{
      flex:1,
      width: '100%',
      alignItems: "center", 
      justifyContent: "space-around",
      marginTop: Constants.statusBarHeight,
      //backgroundColor:"green"
    },
    header:{
      flex:.15,
      paddingTop: "5%",
      color: 'black',
      fontWeight: "800",
      fontSize: 33,
      textAlign: "center",
      //backgroundColor:"blue"
    },
    item: {
      flex:1,
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 30,
      width: '100%',
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 15,
      marginBottom: 10,
      paddingBottom : "3%"
    },
    title: {
      fontSize: 24,
    },
    subtitle: {
      fontSize: 14,
      paddingBottom: '1%'
    },
    midtitle: {
      fontSize: 16,
      paddingBottom: '1%'
    },
    
    list:{
      flex:1,
      width: '95%',
      paddingTop: '2%',
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
      width: '100%'
    }
  })


