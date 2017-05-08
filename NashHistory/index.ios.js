import React, { Component } from 'react'
import { MapView, AppRegistry, View } from 'react-native'
import axios from 'axios'
const { APPTOKEN } = require('./app_token')

console.log(APPTOKEN)

class App extends Component {

  state = {
    region: {
      latitude: 36.159130,
      longitude: -86.770105,
      latitudeDelta: 0.4043,
      longitudeDelta: 0.4034
    },
    annotations: []
  }

  componentWillMount() {
    axios.get(`https://data.nashville.gov/resource/m4hn-ihe4.json?$$app_token=${APPTOKEN}`)
    .then((res) => {
      for (let item of res.data) {
        item.subtitle = item.marker_text
        delete item.marker_text
        delete item.mapped_location
      }
      this.setState({ annotations: res.data })
      // console.log(res.data)
    })
  }


  render() {
    const { annotations } = this.state
    // annotations.forEach(annotation => {
    //   annotation.rightCalloutView = (
    //
    //   )
    // })
    return (
      <View style={{ flex: 3 }}>
        <MapView
          showsUserLocation
          style={{ flex: 2 }}
          region={this.state.region}
          annotations={annotations}
        />
      </View>
    )
  }
}

AppRegistry.registerComponent('NashHistory', () => App)
