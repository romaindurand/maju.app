import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Card from './styled';
import Recaptcha from 'react-google-invisible-recaptcha';
const FINAL_TITLE_INDEX = 19
class PollForm extends Component {
  constructor() {
    super()
    this.state = {
      error: null,
      question: '',
      options: ['', '', ''],
      recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITEKEY,
      majuTitle: 5
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
    const response = await fetch('/api/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        question: this.state.question,
        options: this.getOptions(),
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
    return (
      <Card className="new-poll-form">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h2>Create your <a href="#faq" onClick={this.handleMajuClick.bind(this)}>{this.getMajuTitle(this.state.majuTitle)}</a> poll in seconds !</h2>
        <input
          onChange={event => this.setState({ question: event.target.value })}
          autoFocus
          type="text"
          placeholder="Type your question here…"
          className="drop"
          autoComplete="off"/>
        <h2>Add your poll options here</h2>
        <ol>{optionInputList}</ol>
        <div className="submit-container">
          <button className={this.state.error ? 'error' : ''}>Create poll</button>
          {this.state.error ? <div className="error">{this.state.error}</div> : ''}
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
      </Card>
    );
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
          placeholder="Poll option…"
          onChange={event => this.updateOption(i, event)}
          onFocus={event => this.handleOptionClick(i)}/>
      </li>
    );
  }
}

export default withRouter(PollForm);
