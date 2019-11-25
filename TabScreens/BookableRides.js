import * as React from 'react';
import { StyleSheet, Text, View , TextInput, Button, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import Constants from 'expo-constants';
import { blue, black, white } from 'ansi-colors';

import * as firebase from 'firebase'; 
import {firebaseConfig} from '../Screens/FirebaseHelper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default class BookableRides extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
          <View style = {styles.container}>
            <View style = {styles.generic}>
              <Text>Book Rides</Text>
              <View style = {styles.list}>
                <FlatList
                  data={DATA}
                  renderItem={({ item }) => <Item title={item.title} />}
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
  item: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '100%',
  },
  title: {
    flex: 1,
    fontSize: 32,
  },
  list:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    width: '100%',
  }
});
