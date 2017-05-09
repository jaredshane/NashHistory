import React, { Component } from 'react'
import { AppRegistry, View, AlertIOS, TabBarIOS } from 'react-native'
import Map from './src/components/Map'
import Trip from './src/components/Trip'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      trip: []
    }
    this.handleAddTrip =  this.handleAddTrip.bind(this)
  }

  handleAddTrip(annotation) {
    console.log(annotation)
    const trip = this.state.trip
    trip.push(annotation)
    this.setState({ trip })
    console.log(this.state)
    AlertIOS.alert(
      `${annotation.title} successfully added to your trip!`,
      'Select the Trip tab to view your trip'
    )
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title='Map'
          selected
          selectedIcon={require('./src/images/map.png')}
        >
          <Map handleAddTrip={this.handleAddTrip} />
        </TabBarIOS.Item>
      </TabBarIOS>



      //
      // <View style={{ flex: 1 }}>
      //
      //   <Trip tripList={this.state.trip}/>
      // </View>
    )
  }
}

AppRegistry.registerComponent('NashHistory', () => App)
