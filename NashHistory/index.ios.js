import React, { Component } from 'react'
import { AppRegistry, View, AlertIOS, TabBarIOS } from 'react-native'
import Map from './src/components/Map'
import Trip from './src/components/Trip'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      trip: [],
      selectedTab: 0
    }
    this.handleAddTrip =  this.handleAddTrip.bind(this)
  }

  handleAddTrip(annotation) {
    const trip = this.state.trip
    trip.push(annotation)
    this.setState({ trip })
    AlertIOS.alert(
      `${annotation.title} successfully added to your trip!`,
      'Select the Trip tab to view your trip'
    )
  }

  handleTabPress(tab) {
  this.setState({selectedTab: tab})
}

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title='Map'
          selected={this.state.selectedTab === 0}
          icon={require('./src/images/map.png')}
          onPress={this.handleTabPress.bind(this, 0)}
        >
          <Map handleAddTrip={this.handleAddTrip} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title='Trip'
          selected={this.state.selectedTab === 1}
          icon={require('./src/images/trip.png')}
          onPress={this.handleTabPress.bind(this, 1)}
        >
          <Trip tripList={this.state.trip}/>
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
