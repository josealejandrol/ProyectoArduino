import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  Image
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial';

class Logo extends React.Component {
  render() {
      return (
          //Add your logo in the image tag
          <View style={{ flex: 1 }}>
          <Image
              source={require('../assets/nodeschoolTab-logo.jpg')}
              resizeMode = "contain"
              style = {{
                width: 50,
                marginRight: 0,
                alignSelf:'center'
              }}
          />
          </View>
      );
  }
}
 
export default class BluetoothScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: <Logo />,
    };
  };

  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
    }
  }
  componentWillMount(){
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values
 
      this.setState({ isEnabled, devices })
    })
 
    BluetoothSerial.on('bluetoothEnabled', () => {
 
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({  devices })
      })
 
      BluetoothSerial.on('bluetoothDisabled', () => {
 
         this.setState({ devices: [] })
 
      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
 
    })
 
  }
  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);
      
      ToastAndroid.show(`Conectado a: ${device.name}`, ToastAndroid.SHORT);
    })
    .catch((err) => console.log((err.message)))
  }
  _renderItem(item){
 
    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={styles.deviceNameWrap}>
              <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
            </View>
          </TouchableOpacity>)
  }
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }
 
  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }
  discoverAvailableDevices () {
    
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        this.setState({ unpairedDevices: uniqueDevices, discovering: false })
      })
      .catch((err) => console.log(err.message))
    }
  }
  toggleSwitch(){
    BluetoothSerial.write("a")
    .then((res) => {
      console.log(res);
      console.log('Successfuly wrote to device a')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  toggleSwitch2(){
    BluetoothSerial.write("b")
    .then((res) => {
      console.log(res);
      console.log('Successfuly wrote to device b')
      this.setState({ connected: true })
    })
    .catch((err) => console.log(err.message))
  }
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Lista de dispositivos Bluetooth disponibles</Text>
            <View style={styles.toolbarButton}>
              <Switch
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
              />
            </View>
      </View>
        <Button
          onPress={this.discoverAvailableDevices.bind(this)}
          title="Buscar dispositivos"
          color="#841584"
        />
        <FlatList
          style={{flex:1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={(item) => this._renderItem(item)}
        />
        <View style={{marginBottom: 20}}>
          <Button
            onPress={this.toggleSwitch.bind(this)}
            title="Enviar alerta a"
            color="#0000FF"
          />
        </View>
        <View style={{marginBottom: 20}}>
          <Button
            onPress={this.toggleSwitch2.bind(this)}
            title="Enviar alerta b"
            color="#10ce13"
          />  
        </View>  
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  }
});