import React, { Component } from 'react'
import { Text } from 'react-native'

class Trip extends Component {
  render() {
    return (
      <Text>{this.props.tripList}</Text>
    )
  }
}

export default Trip
