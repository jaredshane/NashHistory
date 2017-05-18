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
import Card from './Card'
import CardSection from './CardSection'

const { options } = require('../../awsoptions')

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
      selectedImage: '',
      selectedImageName: '',
      entry: '',
      userEntries: []
    }
    this.loginButtonPress = this.loginButtonPress.bind(this)
    this.registerButtonPress = this.registerButtonPress.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.logoutButtonPress = this.logoutButtonPress.bind(this)
    this.toggleEntryModal = this.toggleEntryModal.bind(this)
    this.togglePhotoModal = this.togglePhotoModal.bind(this)
    this.pickImage = this.pickImage.bind(this)
    this.setImageToState = this.setImageToState.bind(this)
    this.posttoAWS = this.posttoAWS.bind(this)
  }

  componentWillMount() {
    if (this.props.email === null) {
      this.setState({ page: 'login' })
    } else {
      this.setState({ page: 'journal' })
    }
  }

  // componentDidUpdate() {
  //   this.renderEntries()
  // }

  setImageToState(photo) {
    console.log(this.state, photo)
    this.setState({
      selectedImage: photo.node.image.uri,
      selectedImageName: photo.node.image.filename
    })
    // console.log('this.state.selectedImage', this.state.selectedImage)
  }

  logoutButtonPress() {
    this.setState({ page: 'login' })
  }

  toggleEntryModal() {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  togglePhotoModal() {
    this.setState({ photoModal: !this.state.photoModal, modalVisible: !this.state.modalVisible })
  }

  pickImage() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then((cameraRoll) => {
      this.setState({ photos: cameraRoll.edges, photoModal: true, modalVisible: false })
      // console.log(cameraRoll.edges)
    })
  }

  registerUser() {
    if (this.state.password === this.state.passwordConfirmation) {
      console.log('registering')
      axios.post('https://lit-eyrie-84713.herokuapp.com/v1/register', {
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        // console.log(res.data.user[0].id)
        this.setState({
          id: res.data.user[0].id,
          page: 'journal',
          password: '',
          passwordConfirmation: ''
        })
      })
      .then(() => {
        // console.log('register', this.state.id)
        this.props.loggedIn(this.state.email, this.state.id)
      })
    } else {
      this.setState({ error: 'Your passwords did not match, please try again' })
    }
  }

  registerButtonPress() {
    this.setState({ page: 'register' })
  }

  loginButtonPress() {
    axios.post('https://lit-eyrie-84713.herokuapp.com/v1/login', {
      email: this.state.email,
      password: this.state.password
    })
    .then((res) => {
      // console.log(res)
      return this.setState({ id: res.data.id, password: '' })
    })
    .then(() => {
      this.props.loggedIn(this.state.email, this.state.id)
      this.setState({ page: 'journal' })
      const id = this.state.id
      axios.get(`https://lit-eyrie-84713.herokuapp.com/v1/journal/${id}`)
      .then((res) => {
        // console.log(res)
        this.setState({ userEntries: res.data })
        console.log(res)
        console.log(this.state)
      })
    })
  }

  posttoAWS() {
    // console.log('this')
    const file = {
      // `uri` can also be a file system path (i.e. file://)
      uri: this.state.selectedImage,
      name: this.state.selectedImageName,
      type: 'image/jpg'
    }

    console.log('file', file)

    RNS3.put(file, options).then(response => {
      // console.log(response)
      if (response.status !== 201) console.log('Failed to upload image to S3')
      // console.log('aws', response.body.postResponse.location)
      return response.body.postResponse.location
    })
    .then((res) => {
      const data = {
        entry: this.state.entry,
        photo_url: res,
        user_id: this.state.id
      }
      const entryArr = this.state.userEntries
      console.log('data', data, entryArr)
      entryArr.push(data)
      this.setState({ userEntries: entryArr })
      axios.post('https://lit-eyrie-84713.herokuapp.com/v1/journal', data)
      .then((response) => {
        // console.log('response', response)
        this.setState({ modalVisible: false })
      })
    })
  }

  renderEntries() {
    console.log(this.state.userEntries)
    console.log('this was called')
    return this.state.userEntries.map(entry => {
      return (
        <CardSection key={entry.id}>
          <Card>
            <Text>{entry.entry}</Text>
            <Image source={{ uri: entry.photo_url }} style={{ height: 100, width: 100 }} />
          </Card>
        </CardSection>
      )
    })
  }

  render() {
    // console.log(this.state)
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
            style={styles.loginButtonStyle}
          >
            <Text style={styles.textStyle} >Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.registerButtonPress}
          >
            <Text style={styles.textStyle} >Register</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (this.state.page === 'journal') {
      return (
        <ScrollView style={{ marginBottom: 50 }}>
          {/********** modal for creating a new entry *********/}
          <Modal
            animationType='fade'
            // transparent
            visible={this.state.modalVisible}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Journal Entry</Text>
            </View>
            <TextInput
              maxLength={1000}
              multiline
              placeholder='Write about your trip'
              keyboardAppearance='dark'
              style={styles.entryInput}
              onChangeText={entry => this.setState({ entry })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.pickImage}
                style={styles.buttonStyle}
              >
                  <Text style={styles.textStyle}>Pick Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.posttoAWS}
                style={styles.buttonStyle}
              >
                <Text style={styles.textStyle}>Save Entry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.toggleEntryModal}
                style={styles.buttonStyle}
              >
                <Text style={styles.textStyle}>
                  Close
                </Text>
              </TouchableOpacity>

            </View>
            <Image
              style={{
                width: 300,
                height: 300,
                alignSelf: 'center'
              }}
              source={{ uri: this.state.selectedImage }}
            />

          </Modal>

          <Modal
            animationType='fade'
            visible={this.state.photoModal}
          >

            <ScrollView>
              <View style={styles.photoContainer}>
              {this.state.photos.map((photo, index) => {
                  // console.log(photo, index)
                  return (


                    <TouchableOpacity
                      key={index}
                      onPress={() => { this.setImageToState(photo) }}
                    >
                      <Image
                        style={{
                          width: 123,
                          height: 123,
                        }}
                        source={{ uri: photo.node.image.uri }}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>
                <TouchableOpacity
                  onPress={this.togglePhotoModal}
                  style={styles.buttonStyle}
                >
                  <Text style={styles.textStyle}>
                    Select Photo
                  </Text>
                </TouchableOpacity>
            </ScrollView>
          </Modal>

      {/***** Will display journal entries and buttons to create new entry and logout ******/}
          <TouchableOpacity
            style={styles.entryButtonStyle}
            onPress={this.toggleEntryModal}
          >
            <Text
              style={styles.textStyle}
            >
              Create New Entry
            </Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButtonStyle}
            onPress={this.logoutButtonPress}
          >
            <Text
              style={styles.logoutStyle}
            >
              Logout
          </Text>
          </TouchableOpacity>
          {this.renderEntries()}
        </ScrollView>
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
            style={styles.buttonStyle}
          >
              <Text style={styles.textStyle}>Register Account</Text>
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
  },
  entryInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 30,
    marginLeft: 5,
    marginRight: 5,
    padding: 2
  },
  buttonStyle: {
    // borderColor: '007aff',
    // borderWidth: 2,
    alignSelf: 'stretch',
    backgroundColor: '#007aff',
    padding: 10,
    margin: 2
  },
  textStyle: {
    alignSelf: 'center',
    color: '#fff'
  },
  logoutStyle: {
    alignSelf: 'center',
    color: '#fff'
  },
  logoutButtonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#ff0000',
    marginTop: 2,
    padding: 10
  },
  entryButtonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#00ad02',
    padding: 10
  },
  loginButtonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#00ad02',
    padding: 10,
    margin: 2
  },
  photoContainer: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 3,
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  headerText: {
    alignSelf: 'center',
    fontSize: 20
  },
  headerContainer: {
    backgroundColor: '#f7f4e8',
    padding: 10
  }
}

export default Account
