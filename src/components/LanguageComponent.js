import { Component } from 'react';
import cookie from 'react-cookies';
import translate from '../translate';

class LanguageComponent extends Component {
  constructor() {
    super()
    this.boundHandler = this.handleLanguageChange.bind(this)
    if (!cookie.load('language')) cookie.save('language', 'en-US');
    const language = cookie.load('language');
    this.state = {
      language,
      t: translate(language)
    };
  }

  handleLanguageChange() {
    const language = cookie.load('language');
    this.setState({ language, t: translate(language) })
  }

  componentDidMount() {
    window.addEventListener('LanguageChange', this.boundHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('LanguageChange', this.boundHandler)
  }
}

export default LanguageComponent;
