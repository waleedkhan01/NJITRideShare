import React from 'react';
import { Ionicons } from '@expo/vector-icons';


const tintColor = {
  tabIconDefault: '#ccc',
  tabIconSelected: '#2f95dc',
};

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={32}
      style={{ marginBottom: -3 }}
      color={props.focused ? tintColor.tabIconSelected : tintColor.tabIconDefault}
    />
  );
}
