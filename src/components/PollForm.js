import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Recaptcha from 'react-google-invisible-recaptcha';

class PollForm extends Component {
  constructor() {
    super()
    this.state = {
      error: null,
      question: '',
      options: ['', '', ''],
      recaptchaSiteKey: null
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
    
    this.recaptcha.execute()
  }
  
  async postFormData () {
    const token = this.recaptcha.getResponse()
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
  }

  async componentDidMount() {
    const response = await fetch('/api/recaptcha')
    const data = await response.json()
    this.setState({recaptchaSiteKey: data.siteKey})
  }

  render() {
    const optionInputList = this.state.options.map((option, index) => this.renderOption(index))
    return (
      <form className="new-poll-form" onSubmit={this.handleSubmit.bind(this)}>
        <h2>Create your <i>majority judgement</i> poll in seconds !</h2>
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
          this.state.recaptchaSiteKey ?
            <Recaptcha
              ref={ ref => this.recaptcha = ref }
              sitekey={ this.state.recaptchaSiteKey }
              onResolved={ this.postFormData.bind(this) } />  
            : null
        }
      </form>
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
