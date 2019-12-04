import React, {Component} from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, FlatList, SafeAreaView, Image, Alert} from 'react-native';
import Constants from 'expo-constants';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const DATA = [
  {
    RID: '1',
    dateTime: 'December 3rd, 5:00 PM',
    startAddress: 'home',
    endAddress: 'NJIT'
  },
  {
    RID: '2',
    dateTime: 'December 3rd, 5:30 PM',
    startAddress: 'NJIT',
    endAddress: 'home'
  },
  {
    RID: '3',
    dateTime: 'December 5th, 9:30 AM',
    startAddress: 'home',
    endAddress: 'NJIT'
  },
];
const DATA2 = [
  {
    RID: '2',
    dateTime: 'December 3rd, 5:30 PM',
    startAddress: 'NJIT',
    endAddress: 'home'
  },
  {
    RID: '3',
    dateTime: 'December 5th, 9:30 AM',
    startAddress: 'home',
    endAddress: 'NJIT'
  },
];

export default class BookableRides extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: 'false',
          data: firebase.database(),
          dict: []
        }
    }
    

    async componentDidMount(){
      this.getBookings();
      await this.getRides();
    }

    getBookings(){
      this.setState({data: DATA})
    }
    createAlert(dateTime, RID){
      Alert.alert(
        'Book Ride for ' + dateTime +'?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
            this.setState({data: DATA2})
          }},
        ],
        {cancelable: true},
      )
    }
    async getRides(){
      var loadedRides = false;
      var currentRides = await this.state.data.ref('rides').once('value', function (snapshot) {
        loadedRides = true;
      });
      if(loadedRides == true){
        currentRides.forEach((data) => {
          this.state.dict.push({
            RID:   data.key,
            value: data
        });
        })
      }
      console.log(this.state.dict[0].value)
      console.log(DATA)
    }
    render(){
        return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
              <Text style={styles.header}>Book Rides</Text>
              <View style = {styles.list}>
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => 

                      <TouchableOpacity style={styles.item} onPress = {() => this.createAlert(item.dateTime, item.RID)}>
                        <View style ={styles.itemText}>
                          <Text style={styles.title}>{item.dateTime}</Text>
                          <Text style={styles.subtitle}>{item.startAddress}</Text>
                          <Text style={styles.subtitle}>{item.endAddress}</Text>
                        </View>
                        {/* <View style={styles.itemImage}>
                          <Image
                            style={{width: 48, height: 48}}
                            source={require('../assets/Images/Arrow-128x128.png')}
                          />
                        </View> */}
                    </TouchableOpacity>}

                  keyExtractor={item => item.id}
                />
              </View>
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
    fontSize: 12,
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
  }
});
