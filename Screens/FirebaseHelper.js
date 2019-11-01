import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 

export const firebaseConfig = {
    apiKey: "AIzaSyARHlc9zH8KSBluqvaOiqBNYKOWdhCfpJo",
    authDomain: "njitrideshare.firebaseapp.com",
    databaseURL: "https://njitrideshare.firebaseio.com",
    projectId: "njitrideshare",
    storageBucket: "njitrideshare.appspot.com",
    messagingSenderId: "48204486299",
    appId: "1:48204486299:web:e10eee5018103a6dcad83e",
    measurementId: "G-0N7CGLKHKT"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }




