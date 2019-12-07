
import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

/*export const googleAutoCompleteConfig =  {
    placeholder: 'Enter Location',
    minLength: 2,
    autoFocus: false,
    returnKeyType: 'default',
    listViewDisplayed: 'auto',
    fetchDetails: true,
    //renderDescription: {row : => row.description}, // custom description render

    query: {
      key: 'AIzaSyCkSccKLoUZ2pGuwh35miYfrSVGSFTYcoc',
      language: 'en', // language of the results
      types: 'address'
    },
    styles: {
      textInputContainer: {
        width: '100%'
      },
      description: {
        fontWeight: 'bold'
      },
      predefinedPlacesDescription: {
        color: '#1faadb'
      }
    },
    currentLocation: false
}*/
export const googleAutoCompleteConfig = <GooglePlacesAutocomplete
  placeholder='Enter Location'
  minLength={2}
  autoFocus={false}
  returnKeyType={'default'}
  listViewDisplayed='auto'
  fetchDetails={true}
  renderDescription={row => row.description} // custom description render


  /*onPress={(data, details = null) => {
    //console.log(data, details);                      
    let formatted = 'formatted' + this.state.inputAddress
    this.setState({ [this.state.inputAddress]: { lat: details.geometry.location.lat, long: details.geometry.location.lng } }
    );
    this.setState({ [formatted]: data.description });

    *//*console.log(this.state.formattedstartLocation);
    console.log(this.state.formattedendLocation);*//*
  }}*/
  query={{
    key: 'AIzaSyCkSccKLoUZ2pGuwh35miYfrSVGSFTYcoc',
    language: 'en', // language of the results
    types: 'address'
  }}

  styles={{
    textInputContainer: {
      width: '100%'
    },
    description: {
      fontWeight: 'bold'
    },
    predefinedPlacesDescription: {
      color: '#1faadb'
    }
  }}
/>