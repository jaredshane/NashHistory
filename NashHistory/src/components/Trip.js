import React, { Component } from 'react'
import { Text, TouchableHighlight, Linking, ScrollView } from 'react-native'
import axios from 'axios'
import Card from './Card'
import CardSection from './CardSection'

class Trip extends Component {

  constructor(props) {
    super(props)
    this.state = {
      longitude: '',
      latitude: '',
      trip: []
    }
    this.saveTrips = this.saveTrips.bind(this)
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
  const newArr = this.state.trip
  newArr.push(this.props.tripList)
  this.setState({ trip: newArr[0] })
  // console.log('trip state', this.state.trip)

  if (this.props.email) {
    const id = this.props.id
    axios.get(`https://lit-eyrie-84713.herokuapp.com/v1/trip/${id}`)
    .then((res) => {
      // console.log('trip res', res.data)
      res.data.map((trip) => {
        // console.log('trip', trip)
        // console.log(this.state.trip)
        const tripArr = this.state.trip
        tripArr.push(trip)
        return this.setState({ trip: tripArr })
      })
    })
  }
}

navigatePlace(la, lo) {
  const ula = this.state.latitude
  const ulo = this.state.longitude
  const url = `http://maps.apple.com/?saddr=${ula},${ulo}&daddr=${la},${lo}&dirflg=d`
  return Linking.openURL(url)
}

saveTrips() {
  // console.log(this.state.trip)
  Promise.all(this.state.trip.map(trip => {
    // console.log(trip)
    const data = {
      latitude: trip.latitude,
      longitude: trip.longitude,
      title: trip.title,
      subtitle: trip.subtitle,
      number: trip.number,
      location: trip.location,
      user_id: this.props.id }
    return axios.post('https://lit-eyrie-84713.herokuapp.com/v1/trip', data)
    .then((res) => {
      // console.log(res)
    })
  }))
}

showSave() {
  if (this.props.email) {
    return (
      <TouchableHighlight
        onPress={this.saveTrips}
        style={styles.saveButton}
      >
        <Text style={styles.textStyle}>
          Save Your Trip!
        </Text>
      </TouchableHighlight>
    )
  }
}

renderTrips() {
  return this.props.tripList.map(trip => {
    // console.log('trip', trip)
    return (
      <CardSection key={trip.number}>
        <Card>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.location}>{trip.location}</Text>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={this.navigatePlace.bind(this, trip.latitude, trip.longitude)}
          >
              <Text style={styles.textStyle}>Navigate</Text>
            </TouchableHighlight>

        </Card>
      </CardSection>
    )
  })
}

  render() {
    return (
      <ScrollView style={{ marginBottom: 49 }}>
        {this.renderTrips()}
        {this.showSave()}
      </ScrollView>
    )
  }
}

const styles = {
  location: {
    padding: 10
  },
  buttonStyle: {
    // borderColor: '007aff',
    // borderWidth: 2,
    alignSelf: 'stretch',
    backgroundColor: '#007aff',
    padding: 10
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff'
  },
  saveButton: {
    alignSelf: 'stretch',
    backgroundColor: 'green',
    padding: 20,
    margin: 7
  }

}
export default Trip
