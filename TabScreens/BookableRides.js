import React, {Component} from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, FlatList, SafeAreaView, Image} from 'react-native';
import Constants from 'expo-constants';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const DATA = [
  {
    id: '1',
    title: 'December 3rd, 5:00 PM',
    startAddress: 'home',
    endAddress: 'NJIT'
  },
  {
    id: '2',
    title: 'December 3rd, 5:30 PM',
    startAddress: 'NJIT',
    endAddress: 'home'
  },
  {
    id: '3',
    title: 'December 5th, 9:30 AM',
    startAddress: 'home',
    endAddress: 'NJIT'
  },
];

function Item({ title, startAddress, endAddress}) {
  return (
    <TouchableOpacity style={styles.item}>
      <View style ={styles.itemText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{startAddress}</Text>
        <Text style={styles.subtitle}>{endAddress}</Text>
      </View>
      {/* <View style={styles.itemImage}>
        <Image
          style={{width: 48, height: 48}}
          source={require('../assets/Images/Arrow-128x128.png')}
        />
      </View> */}
    </TouchableOpacity>
  );
}

export default class BookableRides extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading: 'false'
        }
    }

    componentDidMount(){
      this.getBookings();
    }

    getBookings(){
      this.setState({data: DATA})
    }

    render(){
        return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
              <Text>Book Rides</Text>
              <View style = {styles.list}>
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => <Item 
                                              title={item.title} 
                                              startAddress={"Start Address: "+item.startAddress} 
                                              endAddress={"End Address: "+item.endAddress} 
                                              />}
                  keyExtractor={item => item.id}
                  style = {styles.flatList}
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
  item: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: '2',
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
    paddingTop: '20%',
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
