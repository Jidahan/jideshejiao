import React, { Component } from 'react'
import { Platform, TextInput } from 'react-native'

export default class LLTextInput extends Component {

  
    render() {
      return <TextareaItem {...this.props} />
    }
}