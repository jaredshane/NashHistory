import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

class Trip extends Component {

  renderTrips() {
  return this.props.tripList.map(trip => {
    console.log('trip', trip)
    return (
      <View key={trip.number}>
        <Text>{trip.title} {trip.subtitle}</Text>
        <Button></Button>
      </View>
    )
  })
}

  render() {
    // console.log("this.props", this.props);
    return (
      <View>
        {this.renderTrips()}
      </View>
    )
  }
}

export default Trip
