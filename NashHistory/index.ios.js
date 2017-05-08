import React, { Component } from 'react'
import { AppRegistry, View } from 'react-native'
import Map from './src/components/Map'

class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />
      </View>
    )
  }
}

AppRegistry.registerComponent('NashHistory', () => App)
