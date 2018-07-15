import React, { Component, Fragment } from 'react';
import cookie from 'react-cookies';

class LanguageComponent extends Component {
  constructor() {
    super()
    if (!cookie.load('language')) cookie.save('language', 'en-US');
    this.state = {
      language: 'en-US'
    }
  }
}

export default LanguageComponent;
