import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 

//*********************************************************************************************************************************** */
export function start_match(rideid){
    console.log('staring  the match process..  '+rideid );
    matchRide(rideid)
}





//*********************************************************************************************************************************** */
// when_A and when_B are Dates
function times_with_flex(when_A , flex_A,  when_B, flex_B)
{
  var A_start = new Date(when_A)
  var A_end = new Date(when_A)
  
  var B_start = new Date(when_B)
  var B_end = new Date(when_B)
  

  A_start.setMinutes(A_start.getMinutes() - flex_A)
  A_end.setMinutes(A_end.getMinutes() + flex_A)
  
  B_start.setMinutes(B_start.getMinutes() - flex_B)
  B_end.setMinutes(B_end.getMinutes() + flex_B)
  
  return (A_start <= B_end ) && (A_end >= B_start)
}
//*********************************************************************************************************************************** */



export function haversine_lat_long(start , end)
{
 
 
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
 }
 



 var lat2 =end.lat;
 var lon2 = end.long;
 var lat1 = start.lat;
 var lon1 = start.long;
 
 var R = 6371; // km 
 //has a problem with the .toRad() method below.
 var x1 = lat2-lat1;
 var dLat = x1.toRad();  
 var x2 = lon2-lon1;
 var dLon = x2.toRad();  
 var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                 Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                 Math.sin(dLon/2) * Math.sin(dLon/2);  
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
 var d = R * c; 

 console.log("haversine:"+end.lat+"/"+end.long + " to "+start.lat +"/" + start.long  +" = "+d)

 return d;

}
//*********************************************************************************************************************************** */
// run the matching function on all rides for  a particular users
export function matchUser(userKey)


{
    console.log("matching userid :"+userKey);
  
    
    
    var matchesKey =  "matches/"+ userKey
    //var matchesRef=  firebase.database().ref(matchesKey  );
    //matchesRef.child( userKey).update("")
    var allRidesKey = 'rides'
    var ridesRef=  firebase.database().ref(allRidesKey );
    ridesRef.once('value').then(function(snapshot) { 
        snapshot.forEach(function(childsnapshot){
            var userId   = childsnapshot.child("hostUID").val();
            var rideId   = childsnapshot.key;
            if( userId == userKey){ 
                console.log("run matching on " + rideId +" / " + userId + " / " + userKey)            
                matchRide(rideId)
                
            }        
                
        })
    
    })
            

}

//*********************************************************************************************************************************** */

export function matchRide(rideKey)
{

 
  console.log("matching ride :"+rideKey);
  
  var all_rides_key = 'rides/'
  var all_rides =  firebase.database().ref(all_rides_key);
  
  var parent_ridekey = all_rides_key+rideKey
  var parentride =  firebase.database().ref(parent_ridekey);
  
  var matches_key =  "matches/"
  
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
        end_location = snapshot.child("endAddress").val();
        start_location = snapshot.child("startAddress").val();
        start_location_latlng =  snapshot.child("startLatLong").val();
        end_location_latlng =  snapshot.child("endLatLong").val();
        parent_userid = snapshot.child("hostUID").val();
        parent_time=  new Date(snapshot.child("dateTime").val());
        parent_time_flex= 30// snapshot.child("timeFlex").val();
        parent_time_outofway= 30// snapshot.child("timeOutOfWay").val();
      }
  );
  
  
  



   all_rides.once('value').then(
    function(snapshot) {
      snapshot.forEach(function(childsnapshot){
          console.log ("matching loop   : "+ childsnapshot.key)
          child_userid_match  = childsnapshot.child("hostUID").val();
          child_end_location = childsnapshot.child("endAddress").val();
          child_start_location = childsnapshot.child("startAddress").val();
          child_start_location_latlng =  childsnapshot.child("startLatLong").val();
          child_end_location_latlng =  childsnapshot.child("endLatLong").val();
          child_time = new Date(childsnapshot.child("dateTime").val());
          console.log("Checking conversion:" + child_time + ' / ' + childsnapshot.child("dateTime").val())
          child_time_flex =30// childsnapshot.child("timeFlex").val();
          child_time_outofway= 30//childsnapshot.child("timeOutOfWay").val();
          console.log("matchride:  **********************************************")                
          console.log("matchride:  "+ parent_userid+ " / "+ child_userid_match)     
          if (parent_userid != child_userid_match) {
                
                console.log("matchride: checking "+ childsnapshot.key + " vs " +rideKey)        
                
                console.log("matchride:  "+ child_start_location + " / " + start_location)
                console.log("matchride:  "+ child_end_location + " / " + end_location)
                console.log("matchride:  "+ child_time + " / " + parent_time)
                console.log("matchride:  "+ JSON.stringify(child_start_location_latlng )+ " / " +JSON.stringify( start_location_latlng))
                
                if (child_start_location_latlng != "")
                    {
                      start_distance = haversine_lat_long(start_location_latlng, child_start_location_latlng)
                      end_distance =haversine_lat_long(end_location_latlng, child_end_location_latlng)
                      console.log("matchride: distance haversine: " +start_distance +" : "+ end_distance)
                      
                      //for the moment assume speed of 50kph
                      timeoutofway  = (start_distance + end_distance / 50 )* 60
                      

                      if (( timeoutofway < parent_time_outofway) && (timeoutofway < child_time_outofway) && times_with_flex(parent_time, parent_time_flex,child_time, child_time_flex))
                        {
                          console.log("match found!    match found!   match found!   match found!"+ parent_userid+ " / "+ child_userid_match )     
                          console.log("keys:"+ matches_key + parent_userid+" / " + matches_key+child_userid_match )
                          var matches_ref=  firebase.database().ref(matches_key + parent_userid );
                          var child_matches_ref =  firebase.database().ref(matches_key+child_userid_match);
                          matches_ref_ref = matches_ref .push({
                              match :'match', 
                              parent_rideid  :rideKey,
                              child_rideid  :  childsnapshot.key,  
                              userid: parent_userid    
                            })
                        child_matches_ref_ref = child_matches_ref.push({
                            match :'match', 
                            parent_rideid  :childsnapshot.key,
                            child_rideid  : rideKey,  
                            userid: child_userid_match    
                            })


                          
                          
                          
                        }
                        else
                        console.log("matchride:  no match!")
                    }

                    



          }
          else    
          console.log("matchride:  self match, ignore")
      })
    }
  );


}


