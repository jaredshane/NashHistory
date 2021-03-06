import React, { Component } from 'react'
import { MapView, Text, View, StyleSheet, Button } from 'react-native'
import axios from 'axios'

const { APPTOKEN } = require('../../app_token')

class Map extends Component {
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
    })
  }

  handleAdding(annotation) {
    this.props.handleAddTrip(annotation)
  }


  render() {
    const { annotations } = this.state
    annotations.forEach(annotation => {
      annotation.detailCalloutView = (
        <View style={{ borderTopWidth: 1, borderColor: '#000000' }}>
          <Text style={styles.subtitle}>{annotation.subtitle}</Text>
          <Button title="Add to Trip" onPress={() => this.handleAdding(annotation)} />
        </View>
      )
    })
    return (
      <MapView
        showsUserLocation
        style={{ flex: 1 }}
        region={this.state.region}
        annotations={annotations}
      />
    )
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 12,
    marginLeft: 10,
    marginRight: 14,
    paddingRight: 14,
    textAlign: 'center'
  }
})

export default Map
