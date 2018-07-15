import React, { Component, Fragment } from 'react';
import cookie from 'react-cookies';

class LanguageComponent extends Component {
  constructor() {
    super()
    this.boundHandler = this.handleLanguageChange.bind(this)
    if (!cookie.load('language')) cookie.save('language', 'en-US');
    this.state = {
      language: cookie.load('language')
    }
  }

  handleLanguageChange() {
    this.setState({ language: cookie.load('language') })
  }

  componentDidMount() {
    window.addEventListener('LanguageChange', this.boundHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('LanguageChange', this.boundHandler)
  }
}

export default LanguageComponent;
