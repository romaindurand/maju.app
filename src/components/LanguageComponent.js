import { Component } from 'react';
import cookie from '../lib/cookies';
import translate from '../lib/translate';

class LanguageComponent extends Component {
  constructor() {
    super()
    this.boundHandler = this.handleLanguageChange.bind(this)
    const language = cookie.getLanguage();
    this.state = {
      language,
      t: translate(language)
    };
  }

  handleLanguageChange() {
    const language = cookie.getLanguage();
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
