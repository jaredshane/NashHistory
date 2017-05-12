import React, { Component } from 'react'
import { View, Text, Button, TouchableHighlight, Linking } from 'react-native'

class Trip extends Component {

  constructor(props) {
    super(props)
    this.state = {
      longitude: '',
      latitude: ''
    }
  }

componentWillMount() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.setState({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
       })
    }
  )
}

navigatePlace(la, lo) {
  const ula = this.state.latitude
  const ulo = this.state.longitude
  const url = `http://maps.apple.com/?saddr=${ula},${ulo}&daddr=${la},${lo}&dirflg=d`
  return Linking.openURL(url)
}

renderTrips() {
  return this.props.tripList.map(trip => {
    console.log('trip', trip)
    return (
      <View key={trip.number}>
        <Text>{trip.title} {trip.location}</Text>
        <TouchableHighlight
          onPress={this.navigatePlace.bind(this, trip.latitude, trip.longitude)}
        >
          <Text>Navigate</Text>
        </TouchableHighlight>
      </View>
    )
  })
}

  render() {
    return (
      <View>
        {this.renderTrips()}
      </View>
    )
  }
}

export default Trip