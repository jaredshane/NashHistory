import React, { Component } from 'react'
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import axios from 'axios'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      page: '',
      passwordConfirmation: '',
      error: '',
      id: ''
    }
    this.loginButtonPress = this.loginButtonPress.bind(this)
    this.registerButtonPress = this.registerButtonPress.bind(this)
    this.registerUser = this.registerUser.bind(this)
  }

  componentWillMount() {
    if (this.props.email === null) {
      this.setState({ page: 'login' })
    } else {
      this.setState({ page: 'journal' })
    }
  }

  loginButtonPress() {
    axios.post('http://localhost:3000/v1/login', {
      email: this.state.email,
      password: this.state.password
    })
    .then((res) => {
      console.log(res)
      this.setState({ id: res.data.id, password: '' })
      console.log(this.state)
    })
    // this.setState({ page: 'journal' })
  }

  registerButtonPress() {
    this.setState({ page: 'register' })
  }

  registerUser() {
    if (this.state.password === this.state.passwordConfirmation) {
      console.log('registering')
      axios.post('http://localhost:3000/v1/register', {
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        console.log(res)
        this.setState({ page: 'journal', password: '', passwordConfirmation: '' })
      })
    } else {
      this.setState({ error: 'Your passwords did not match, please try again' })
    }
  }

  render() {
    if (this.state.page === 'login') {
      return (
        <View style={styles.inputContainer}>
          <Text>Email:</Text>
          <TextInput
            autoCapitalize='none'
            keyboardType='email-address'
            secureTextEntry={false}
            placeholder='email@email.com'
            autoCorrect={false} //won't show autocorrect options when user is typing in email
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
          />
          <Text>Password:</Text>
          <TextInput
            secureTextEntry
            placeholder='password'
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
          />
          <TouchableOpacity
            onPress={this.loginButtonPress}
          >
            <Text >Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.registerButtonPress}
          >
            <Text >Register</Text>
          </TouchableOpacity>

        </View>
      )
    }

    if (this.state.page === 'journal') {
      return (
        <View>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>
      )
    }

    if (this.state.page === 'register') {
      return (
        <View style={styles.inputContainer}>
          <Text>Email:</Text>
          <TextInput
            autoCapitalize='none'
            keyboardType='email-address'
            secureTextEntry={false}
            placeholder='email@email.com'
            autoCorrect={false} //won't show autocorrect options when user is typing in email
            style={styles.textInput}
            onChangeText={email => this.setState({ email })}
          />
          <Text>Password:</Text>
          <TextInput
            secureTextEntry
            placeholder='password'
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={password => this.setState({ password })}
          />
          <Text>Confirm Password:</Text>
          <TextInput
            secureTextEntry
            placeholder='password confirmation'
            autoCorrect={false}
            style={styles.textInput}
            onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
          />
          <TouchableOpacity
            onPress={this.registerUser}
          >
              <Text>Register Account</Text>
            </TouchableOpacity>
            <Text>
              {this.state.error}
            </Text>
          </View>
      )
    }
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
