import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LandingScreen from './Screens/LandingScreen';

export default class App extends React.Component {
  render(){
    return (
      <View style = {styles.container}>
        <LandingScreen/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
