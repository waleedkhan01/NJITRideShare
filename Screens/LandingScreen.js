import * as React from 'react';
import { StyleSheet, Text, View , TextInput} from 'react-native';
import { blue } from 'ansi-colors';

import * as firebase from 'firebase'; 

export default class LandingScreen extends React.Component{
    constructor(props){
        super(props);

        var firebaseConfig = {
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
            firebase.analytics();
            this.register();
          }
          
        this.state = {
            userEmail : '',
            userPassword: '',
            data: firebase.database(),
            auth: firebase.auth()
        };
        this.register();
    }

    async register(email, password){
        //firebase.auth().createUserWithEmailAndPassword("waleedkhan01@hotmail.com", "123456");
        await firebase.auth().signInWithEmailAndPassword("waleedkhan01@hotmail.com", "123456");
        console.log( firebase.auth().currentUser.uid);
    }

    render(){
        return (
            <View style={styles.container}>
              <Text style={styles.header}>Welcome to NJIT RideShare!</Text>
              <TextInput type="text" style={styles.input} placeholder = "Email Address"></TextInput>
              <TextInput type="text" style={styles.input} placeholder = "Password"></TextInput>
              <Text style={styles.bottom}></Text>
              <Text style={styles.bottom}>Sign In</Text>
              <Text style={styles.bottom}>Reigster</Text>
              <Text style={styles.bottom}></Text>
              
            </View>
          );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header:{
    flex: 1,
    paddingTop: 75,
    color: 'red',
    fontSize: 20,
  },
  text: {
      flex: 1,
      backgroundColor: 'white',
  },
  input:{
    flex:1,
  },
  bottom:{
    flex: 1,
  }
});
