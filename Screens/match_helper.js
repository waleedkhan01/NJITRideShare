import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 



export function start_match(ride){

console.log('here i am, hp_func()  ');

}


//*********************************************************************************************************************************** */

function matchride(rideKey)
{

  
  console.log("matching ride :"+rideKey);
  
  all_rides_key = 'hp_play2/rides/'
  var all_rides =  firebase.database().ref(all_rides_key);
  
  parent_ridekey = all_rides_key+ride_key
  var parentride =  firebase.database().ref(parent_ridekey);
  
  var matches_key =  "hp_play2/matches/"
  
  var child_end_location_latlng
  var child_start_location_latlng

  var end_location_latlng;
  var start_location_latlng;
  
  
  var parent_userid;
  var start_location;
  var end_location;
  var child_userid_match;
  var child_time
  var parent_time
  var child_time_flex
  var parent_time_flex
  var child_time_outofway
  var parent_time_outofway
   parentride.once('value').then(
      function(snapshot) {
        end_location = snapshot.child("end_location").val();
        start_location = snapshot.child("start_location").val();
        start_location_latlng =  snapshot.child("start_location_latlng").val();
        end_location_latlng =  snapshot.child("end_location_latlng").val();
        parent_userid = snapshot.child("userid").val();
        parent_time=  Date(snapshot.child("time").val());
        parent_time_flex= snapshot.child("time_flex").val();
        parent_time_outofway= snapshot.child("timeoutofway").val();
      }
  );
  
  
  



   all_rides.once('value').then(
    function(snapshot) {
      snapshot.forEach(function(childsnapshot){
          console.log ("matching loop: "+ childsnapshot.key)
          child_userid_match  = childsnapshot.child("userid").val();
          child_end_location = childsnapshot.child("end_location").val();
          child_start_location = childsnapshot.child("start_location").val();
          child_start_location_latlng =  childsnapshot.child("start_location_latlng").val();
          child_end_location_latlng =  childsnapshot.child("end_location_latlng").val();
          child_time = Date(childsnapshot.child("time").val());
          child_time_flex = childsnapshot.child("time_flex").val();
          child_time_outofway= childsnapshot.child("timeoutofway").val();
          if (parent_userid != child_userid_match) {
                    if (child_start_location_latlng != "")
                    {
                      console.log("matchride:  **********************************************")                
                      console.log("matchride:  "+ childsnapshot.key)        
                      console.log("matchride:  "+ parent_userid+ " / "+ child_userid_match)     
                      console.log("matchride:  "+ child_start_location + " / " + start_location)
                      console.log("matchride:  "+ JSON.stringify(child_start_location_latlng )+ " / " +JSON.stringify( start_location_latlng))
                      start_distance = haversine_latnog(start_location_latlng, child_start_location_latlng)
                      end_distance =haversine_latnog(end_location_latlng, child_end_location_latlng)
                      console.log("matchride: distance haversine: " +start_distance +" : "+ end_distance)
                      
                      //for the moment assume speed of 50kph
                      timeoutofway  = (start_distance + end_distance / 50 )* 60
                      

                      if (( timeoutofway < parent_time_outofway) && (timeoutofway < child_time_outofway) && times_with_flex(parent_time, parent_time_flex,child_time, child_time_flex))
                        {
                          console.log("match found!"+ parent_userid+ " / "+ child_userid_match )     
                          console.log("keys:"+ matches_key + parent_userid+" / " + matches_key+child_userid_match )
                          var matches_ref=  firebase.database().ref(matches_key + parent_userid );
                          var child_matches_ref =  firebase.database().ref(matches_key+child_userid_match);
                          matches_ref_ref = matches_ref .push({
                              match :'match', 
                              parent_rideid  : childsnapshot.key, 
                              child_rideid  : rideKey, 
                              userid: parent_userid  
                            })

                          child_matches_ref_ref = child_matches_ref.push({
                            match :'match', 
                            child_rideid  : childsnapshot.key,
                            parent_rideid  : rideKey ,
                            userid : child_userid_match 
                          })
                          
                          
                        }
                        else
                        console.log("no match!")
                    }

                    



          }
          else    
            console.log ("self match")
      })
    }
  );


}


