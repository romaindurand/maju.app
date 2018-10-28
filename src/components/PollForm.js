import LanguageComponent from './LanguageComponent';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Card from './styled';
import Settings from './SettingsView';
import Recaptcha from 'react-google-invisible-recaptcha';
import styled from 'styled-components';
const FINAL_TITLE_INDEX = 19;

const StyledPollForm = Card.extend`
  text-align: center;
  .hidden {
    display: none;
  }
  .submit-container {
    text-align: left;
    button {
      margin-left: 20px;
      margin-top: 20px;
      background-color: green;
      border: 1px solid lightgray;
      font-size: 20px;
      padding: 5px 20px;
      font-family: 'Open Sans', sans-serif;
      color: white;
      cursor: pointer;
      transition: background-color 400ms;
      &.error {
        float: left;
        background-color: red;
      }
    }
  }
  div.error {
    float: left;
    margin: 25px 0 0 25px;
    color: darkred;
  }
  .more-options {
    user-select: none;
    text-align: left;
    cursor: pointer;
    &:hover {
      font-weight: bold;
    }
    i {
      margin: 5px;
    }
  }
  
  input[type='text'] {
    font-size: 22px;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid lightgray;
    width: calc(100% - 30px);
    &:focus {
      outline: none;
      border: 2px solid green;
    }
  }
  h2 a {
    user-select: none;
    font-size: 25px;
    font-style: normal;
    color: green;
    text-decoration: none;
  }
  ol {
    input[type='text'] {
      border: none;
      &:focus {
        border: none;
      }
    }
  }
`;

const MoreOptions = styled.div`
  
`;
class PollForm extends LanguageComponent {
  constructor() {
    super()
    this.settings = React.createRef()
    this.state = {
      ...this.state,
      error: null,
      question: '',
      options: ['', '', ''],
      recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITEKEY,
      majuTitle: 5,
      moreOptions: false,
      endDate: null
    }
  }

  notifyError(errorMEssage, timeout) {
    this.setState({error: errorMEssage})
    this.errorTimeout = window.setTimeout(() => {
      this.setState({error: null});
    }, timeout);
  }

  getOptions() {
    return this.state.options
      .filter(option => option !== '')
      .reduce((memo, option) =>
        memo.includes(option) ? memo : [...memo, option], [])
  }

  getSettings() {
    return this.settings.current.getSettings()
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    if (this.getOptions().length < 2)
      return this.notifyError('Give two different options or more.', 5000)
    
    if (this.isProduction()) this.recaptcha.execute()
    else this.postFormData()
  }
  
  getMajuTitle (index) {
    const majority = 'majority '
    const judgement = 'judgement'
    return majority.substr(0, Math.floor(index / 2))
      + judgement.substr(0, Math.floor((index - 1) / 2))
  }

  handleMajuClick (event) {
    if (this.state.majuTitle < FINAL_TITLE_INDEX) {
      event.preventDefault();
      this.majuInterval = window.setInterval(() => {
        if (this.state.majuTitle < FINAL_TITLE_INDEX)
          this.setState({ majuTitle: this.state.majuTitle + 1 })
        else window.clearInterval(this.majuInterval)
      }, 70)
    } else {
      const faq = document.getElementById('faq')
      if (typeof faq.scrollIntoView !== 'function') return;
      event.preventDefault();
      faq.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
  
  async postFormData () {
    const token = this.isProduction() ? this.recaptcha.getResponse() : null;
    debugger
    const response = await fetch('/api/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        question: this.state.question,
        options: this.getOptions(),
        settings: this.getSettings(),
        token
      })
    });
    const body = await response.json();
    if (response.status !== 200) {
      return this.notifyError(body.message, 5000)
    }
    this.props.history.push(`/${body.uid}`)
  }

  updateOption(index, event) {
    const options = this.state.options.slice()
    options[index] = event.target.value
    this.setState({options})
  }

  componentWillUnmount() {
    window.clearTimeout(this.errorTimeout)
    window.clearInterval(this.majuInterval)
  }

  render() {
    const optionInputList = this.state.options.map((option, index) => this.renderOption(index))
    return <StyledPollForm>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h2>
          {this.state.t.home_title.split('{maju}')[0]}
          <a href="#faq" onClick={this.handleMajuClick.bind(this)}>{this.getMajuTitle(this.state.majuTitle)}</a>
          {this.state.t.home_title.split('{maju}')[1]}
        </h2>
        <input
          onChange={event => this.setState({ question: event.target.value })}
          autoFocus
          type="text"
          placeholder={this.state.t.home_question_placeholder}
          className="drop"
          autoComplete="off"/>
        <h2>{this.state.t.home_options_title}</h2>
        <ol>{optionInputList}</ol>
        <Settings ref={this.settings}/>
        <div className="submit-container">
          <button className={this.state.error ? 'error' : ''}>{this.state.t.create_poll_button}</button>
          {this.state.error ? <div className="error">{this.state.error}</div> : null}
          <div style={{clear: 'both'}}></div>
        </div>
        {
          this.isProduction() ?
            <Recaptcha
              ref={ ref => this.recaptcha = ref }
              sitekey={ this.state.recaptchaSiteKey }
              onResolved={ this.postFormData.bind(this) } />  
            : null
        }
      </form>
    </StyledPollForm>;
  }
  
  handleOptionClick(i) {
    this.setState({ error: null })
    if (i === this.state.options.length - 1) {
      this.setState({options: this.state.options.slice().concat([''])})
    }
  }
  renderOption(i) {
    return (
      <li key={i} className="drop">
        <input
          autoComplete="off"
          value={this.state.options[i]}
          type="text"
          placeholder={this.state.t.home_option_placeholder}
          onChange={event => this.updateOption(i, event)}
          onFocus={event => this.handleOptionClick(i)}/>
      </li>
    );
  }
}

export default withRouter(PollForm);
