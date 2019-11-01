import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//npm install react-navigation and react-navigation-stack
//also expo install react-native-gesture-handler (if you npm install you will receive warnings)
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './Screens/LandingScreen';
import SignUpScreen from './Screens/SignUpScreen';

export default class App extends React.Component {
  render(){
    return (
      <View style = {styles.container}>
        <AppContainer/>
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

const AppNavigator = createStackNavigator({
  
  LandingScreen: LandingScreen,
  SignUpScreen: SignUpScreen,
  },
  {
    initialRouteName: 'LandingScreen',
    headerMode: 'none'
  }
  // {Home: {
  //   screen: SignUpScreen,
  //   screen: LandingScreen,
  //   navigationOptions: { header: null }  }
);

const AppContainer = createAppContainer(AppNavigator);