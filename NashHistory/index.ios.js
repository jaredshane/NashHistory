import React, { Component } from 'react'
import { AppRegistry, AlertIOS, TabBarIOS } from 'react-native'
import Map from './src/components/Map'
import Trip from './src/components/Trip'
import Account from './src/components/Account'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      trip: [],
      selectedTab: 0,
      email: null,
      id: null,
    }
    this.handleAddTrip = this.handleAddTrip.bind(this)
    this.loggedIn = this.loggedIn.bind(this)
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
    this.setState({ selectedTab: tab })
  }

  loggedIn(email, password) {
    console.log('email', email, password)
  }

  render() {
    console.log('this.state', this.state.trip)
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
          <Trip tripList={this.state.trip} />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title='Account'
          selected={this.state.selectedTab === 2}
          icon={require('./src/images/account.png')}
          onPress={this.handleTabPress.bind(this, 2)}
        >
          <Account email={this.state.email} id={this.state.id} />
        </TabBarIOS.Item>
      </TabBarIOS>

    )
  }
}

AppRegistry.registerComponent('NashHistory', () => App)
