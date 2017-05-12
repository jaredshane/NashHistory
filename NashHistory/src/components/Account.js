import React, { Component } from 'react'
import { View, TextInput, Text } from 'react-native'

class Account extends Component {

  state = {
    email: ''
  }

  renderLoginPage() {
    if (this.props.email === null) {
      return (
        <View>
          <TextInput
            secureTextEntry={false}
            placeholder='email@email.com'
            autoCorrect={false} //won't show autocorrect options when user is typing in email
            style={styles.textInput}
            onChangeText={email => console.log(email)}
          />
          <TextInput
            secureTextEntry
            placeholder='password'
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={password => console.log(password)}
          />

        </View>
      )
    }
  }

  render() {
    console.log(this.props)
    return (
      <View>
        {this.renderLoginPage()}
      </View>
    )
  }
}

const styles = {
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5
  },
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
}

export default Account
