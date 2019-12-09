import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 


export function removeRide(rideId)
  
  {
    rideKey = 'rides/'+rideId
    console.log("removing ride: "+rideKey)
    var rideRef =  firebase.database().ref(rideKey);
    rideRef.remove()

    // clean up any references in users
    userKey = 'users'
    var userRef=  firebase.database().ref(userKey );
    userRef.once('value').then(function(snapshot_users) { 
        snapshot_users.forEach(function(childsnapshot){

            ridesCreatedKey = 'users/'+childsnapshot.key +'/ridesCreated/'+rideId 
            ridesJoinedKey = 'users/'+childsnapshot.key +'/ridesJoined/'+rideId 
            console.log("removing ride: "+ridesCreatedKey)
            console.log("removing ride: "+ridesJoinedKey)
            var ridesCreatedRef =  firebase.database().ref(ridesCreatedKey).remove()
            var ridesJoinedRef =  firebase.database().ref(ridesJoinedKey).remove()
          })
    })

    // clean up any references in matches
    var matchRef=  firebase.database().ref('matches' );
    console.log("cleaning up matches for rideId:  "+rideId) 
       
    matchRef.once('value').then(function(snapshot_matches) { 
        snapshot_matches.forEach(function(childsnapshot){
            console.log("removing ride: checking matches:"+childsnapshot.key)
            var matchUserRef = firebase.database().ref('matches/'+childsnapshot.key )
            matchUserRef.once('value').then(function(snapshot_user_matches) { 
                snapshot_user_matches.forEach(function(childsnapshot_user_matches){
                    var matchId     = childsnapshot_user_matches.key
                    var childRideId  = childsnapshot_user_matches.child("child_rideid").val();
                    var parentRideId = childsnapshot_user_matches.child("parent_rideid").val();
                    console.log("removing ride: checking matches:"+matchId +" " + childRideId+" "+parentRideId)
                    
                    
                    if ((childRideId == rideId ) || (parentRideId == rideId))
                    {
                        firebase.database().ref('matches/'+childsnapshot.key+"/"+matchId).remove() 
                        console.log("cleaning up matches:  "+matchId)
                    }
                })  
            }) 
        })
    })
  }
  