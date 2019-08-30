import React,{Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';

//screens
import BluetoothScreen from '../screens/BluetoothScreen';

const AppNavigator = createStackNavigator({
    BluetoothScreen
})

export default createAppContainer(AppNavigator);