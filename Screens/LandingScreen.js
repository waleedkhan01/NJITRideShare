import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity} from 'react-native';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from './FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

export default class LandingScreen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userEmail : '',
            userPassword: '',
            data: firebase.database(),
            auth: firebase.auth(),
            signInError: ''
        };
    }

    async register(email, password){
      console.log("Navigating to registration screen");
      this.props.navigation.navigate('SignUpScreen');
    }
    async signIn(){
      var email = this.state.userEmail;
      var pass = this.state.userPassword;
      var err="";

      await firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
        err = error;
          console.log(error);
          console.log("Not signed in due to error.");
      })

      if(err=="" && firebase.auth().currentUser.uid != null){
        console.log("Successful sign in, continue to next page");
        
        //No error
        this.setState({"signInError": ""});
        this.props.navigation.navigate('BookableRides');
      }
      else{
        this.setState({"signInError": "Invalid email/password"});
      }
    }
    passwordChange(){
      this.props.navigation.navigate('PasswordChangeScreen');
    }

    render(){
      console.log(this.state.signInError);
        return (
            <View style={styles.container}>

              <View style ={styles.generic}>
                <Text style={styles.header}>NJIT RideShare</Text>
              </View>  

              <View style ={styles.spacer}/>

              <View style ={styles.email}>
                <TextInput type="text" style={styles.inputEmail} placeholder = "Email Address" keyboardType = "email-address" 
                  onChangeText = {(text) => this.setState({"userEmail": text})
                                }
                  value = {this.state.userEmail}
                  autoCapitalize = "none"
                  autoCompleteType = "email"
                  autoCorrect = {false}
                >
                </TextInput>
              </View>

              <View style ={styles.generic}>
                <TextInput type="text" style={styles.inputPass} placeholder = "Password"
                onChangeText = {(text) => this.setState({"userPassword": text})
              }
                value = {this.state.userPassword}
                autoCapitalize = "none"
                autoCompleteType = "password"
                autoCorrect = {false}
                secureTextEntry={true}
                ></TextInput>
              </View>  
              
              <View style ={styles.generic}>
                <TouchableOpacity style={styles.button} onPress = {() => this.signIn()}>
                    <Text >Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress = {() => this.register()}>
                  <Text>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonDark} onPress = {() => this.passwordChange()}>
                  <Text style = {styles.buttonDarkText}>Reset Password</Text>
                </TouchableOpacity>
                {/*  The code below will conditionally render error text  */}
                {this.state.signInError.length > 1 && 
                <Text style={styles.error}>Invalid email/password</Text>
                }
                {this.state.signInError.length <1 && 
                <Text style={styles.noError}>Valid</Text>
                }
              </View>
              
              <View style ={styles.generic}/>

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
  },
  email:{
    flex:.4,
    width: '100%',
    alignItems: "center",
    justifyContent: "space-around",
  },
  spacer:{
    flex:0.4,
    width: '100%',
  },
  header:{
    flex: 1,
    paddingTop: "25%",
    color: 'red',
    textShadowColor:'black',
    textShadowRadius: 2,
    fontWeight: "800",
    fontSize: 33,
    textAlign: "center"
  },
  text: {
      flex: 1,
      backgroundColor: 'white',
  },
  inputEmail:{
    flex: 1,
    textAlign: 'left',
    width: '75%',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 20,
    paddingLeft: '5%',
    height: '1%',
    fontWeight: "bold"
  },
  inputPass:{
    flex:0.35,
    textAlign: 'left',
    width: '75%',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 4,
    borderRadius: 20,
    paddingLeft: '5%',
    height: '1%',
    fontWeight: "bold"
  },
  button:{
    flex: 0.3,
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
    backgroundColor: '#fff',
    elevation: 2, // Android
  },
  buttonDark:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    width: "30%",
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
  error:{
    color: 'red'
  },
  noError:{
    color: '#a8a8a8'
  },
});
