import React, { Component } from "react"
import { View } from "react-native"
import { Auth } from "aws-amplify"
import {
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from "react-native-elements"
import { connect } from "react-redux"
import API from "../../App/Services/Api"
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import MFAPrompt from "../Components/MFAPrompt"

// Styles
import styles from "./Styles/AuthScreenStyle"

class AuthScreen extends Component {
  api = {};
  constructor(props) {
    super(props)

    this.state = {
      showMFAPrompt: false,
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      errorMessage: "",
      fontLoaded: false,
    }

    this.baseState = this.state

    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleMFAValidate = this.handleMFAValidate.bind(this)
    this.handleMFASuccess = this.handleMFASuccess.bind(this)
    this.handleMFACancel = this.handleMFACancel.bind(this)
    this.onPhoneSubmit = this.onPhoneSubmit.bind(this)
    this.api = API.create()
  }
  componentDidMount() {
    setTimeout(() => {
      this.api.getRoot().then(result => {
        const aa = result
      })
    }, 3000)
  }
  onPhoneSubmit(event) {
    const isValidPhone = this.checkPhonePattern(event.nativeEvent.text)

    this.setState({
      errorMessage:
        !isValidPhone &&
        "Please enter a phone number with the format +(countrycode)(number) such as +12223334444",
    })
  }

  onSignUp() {
    this.setState(this.baseState)

    // this.props.onSignUp()
  }

  handleMFASuccess() {
    this.setState({ showMFAPrompt: false })

    this.onSignUp()
  }

  handleMFACancel() {
    this.setState({ showMFAPrompt: false })
  }

  checkPhonePattern = phone => /\+[1-9]\d{1,14}$/.test(phone);

  async handleSignUp() {
    const {
 username, password, email, phoneNumber 
} = this.state
    let userConfirmed = true

    Auth.signUp(username, password, email, phoneNumber)
      .then(data => {
        userConfirmed = data.userConfirmed

        this.setState({ showMFAPrompt: !userConfirmed })

        if (userConfirmed) {
          this.onSignUp()
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ errorMessage: err.message })
      })
  }

  async handleMFAValidate(code = "") {
    try {
      await Auth.confirmSignUp(this.state.username, code).then(data =>
        console.log("sign up successful ->", data),)
    } catch (exception) {
      return exception.message || exception
    }

    return true
  }

  render() {
    return (
      <View style={styles.bla}>
        <View style={styles.formContainer}>
          <View>
            <FormValidationMessage>
              {this.state.errorMessage}
            </FormValidationMessage>
            <FormLabel>Username</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              placeholder="Enter your Username"
              returnKeyType="next"
              ref="username"
              textInputRef="usernameInput"
              onSubmitEditing={() => {
                this.refs.password.refs.passwordInput.focus()
              }}
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel>Password</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              placeholder="Enter your Password"
              returnKeyType="next"
              ref="password"
              textInputRef="passwordInput"
              onSubmitEditing={() => {
                this.refs.email.refs.emailInput.focus()
              }}
              secureTextEntry
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel>Email</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
              placeholder="Enter your Email"
              returnKeyType="next"
              ref="email"
              textInputRef="emailInput"
              onSubmitEditing={() => {
                this.refs.phone.refs.phoneInput.focus()
              }}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <View>
            <FormLabel>Phone Number</FormLabel>
            <FormInput
              editable
              autoCapitalize="none"
              keyboardType="phone-pad"
              underlineColorAndroid="transparent"
              placeholder="Enter your Phone Number"
              returnKeyType="next"
              ref="phone"
              textInputRef="phoneInput"
              value={this.state.phoneNumber}
              onBlur={this.onPhoneSubmit}
              onSubmitEditing={this.onPhoneSubmit}
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
            />
            {false && (
              <FormValidationMessage>Error message</FormValidationMessage>
            )}
          </View>
          <Button
            raised
            large
            title="Sign Up"
            icon={{ name: "lock", size: 18, type: "font-awesome" }}
            onPress={this.handleSignUp}
          />
          {this.state.showMFAPrompt && (
            <MFAPrompt
              onValidate={this.handleMFAValidate}
              onCancel={this.handleMFACancel}
              onSuccess={this.handleMFASuccess}
            />
          )}
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthScreen)
