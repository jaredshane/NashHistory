import React, { Component } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Modal,
  CameraRoll,
  ScrollView,
  Image
} from 'react-native'
import axios from 'axios'
import { RNS3 } from 'react-native-aws3'
const { options } =  require('../../awsoptions')

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      page: '',
      passwordConfirmation: '',
      error: '',
      id: '',
      modalVisible: false,
      photoModal: false,
      photos: [],
      selectedImage: ''
    }
    this.loginButtonPress = this.loginButtonPress.bind(this)
    this.registerButtonPress = this.registerButtonPress.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.logoutButtonPress = this.logoutButtonPress.bind(this)
    this.toggleEntryModal = this.toggleEntryModal.bind(this)
    this.togglePhotoModal = this.togglePhotoModal.bind(this)
    this.pickImage = this.pickImage.bind(this)
    // this.showImages = this.showImages.bind(this)
    this.setImageToState = this.setImageToState.bind(this)
  }

  componentWillMount() {
    if (this.props.email === null) {
      this.setState({ page: 'login' })
    } else {
      this.setState({ page: 'journal' })
    }
  }

  // componentWillUpdate() {
  //   console.log('this happens everytime component updates')
  //   this.showImages()
  // }

  loginButtonPress() {
    axios.post('https://lit-eyrie-84713.herokuapp.com/v1/login', {
      email: this.state.email,
      password: this.state.password
    })
    .then((res) => {
      console.log(res)
      return this.setState({ id: res.data.id, password: '' })
    })
    .then(() => {
      this.props.loggedIn(this.state.email, this.state.id)
      this.setState({ page: 'journal' })
    })
  }

  registerButtonPress() {
    this.setState({ page: 'register' })
  }

  registerUser() {
    if (this.state.password === this.state.passwordConfirmation) {
      console.log('registering')
      axios.post('https://lit-eyrie-84713.herokuapp.com/v1/register', {
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        console.log(res.data.user[0].id)
        this.setState({
          id: res.data.user[0].id,
          page: 'journal',
          password: '',
          passwordConfirmation: ''
        })
      })
      .then(() => {
        console.log('register', this.state.id)
        this.props.loggedIn(this.state.email, this.state.id)
      })
    } else {
      this.setState({ error: 'Your passwords did not match, please try again' })
    }
  }

  logoutButtonPress() {
    this.setState({ page: 'login' })
  }

  openModal() {
    this.setState({ modalVisible: true })
  }

  closeModal() {
    this.setState({ modalVisible: false })
  }

  pickImage() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then((photo) => {
      console.log('photo', photo)
    })

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
          <Modal
            animationType='fade'
            // transparent
            visible={this.state.modalVisible}
          >
            <TextInput
              maxLength={1000}
              multiline
              placeholder='Write about your trip'
              keyboardAppearance='dark'
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={this.pickImage}
            >
              <Text>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.closeModal}
            >
              <Text>
                Close
              </Text>
            </TouchableOpacity>
          </Modal>
          <TouchableOpacity
            onPress={this.openModal}
          >
            <Text>
              Create New Entry
            </Text>

          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.logoutButtonPress}
          >
              <Text>Logout</Text>
            </TouchableOpacity>
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
  inputContainer: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    marginTop: 45,
    justifyContent: 'flex-start',
    // flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
}

export default Account
