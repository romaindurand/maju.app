import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class PollForm extends Component {
  constructor() {
    super()
    this.state = {
      error: null,
      options: ['', '', '']
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const inputs = event.target.getElementsByTagName('input');
    const formValues = Array.from(inputs).reduce((memo, input) => {
      if (input.name ==='question') memo.question = input.value
      else if (input.value !== '') memo.options.push(input.value)
      return memo
    }, {question: '', options: []});
    const response = await fetch('/api/new', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formValues)
    });
    const body = await response.json();
    if (body.error) {
      this.setState({error: body.error})
      this.errorTimeout = window.setTimeout(() => {
        this.setState({error: null});
      }, 5000);
    } else {
      this.props.history.push(`/${body.uid}`)
    }
  }
  updateOption(index, event) {
    const options = this.state.options.slice()
    options[index] = event.target.value
    this.setState({options})
  }

  componentWillUnmount() {
    window.clearTimeout(this.errorTimeout)
  }

  render() {
    const optionInputList = this.state.options.map((option, index) => this.renderOption(index))
    return (
      <form className="new-poll-form" onSubmit={this.handleSubmit.bind(this)}>
        <h2>Create your <i>majority judgement</i> poll in seconds !</h2>
        <input
          autoFocus
          type="text"
          placeholder="Type your question here…"
          name="question"
          className="drop"
          autoComplete="off"/>
        <h2>Add your poll options here</h2>
        <ol>{optionInputList}</ol>
        <div className="submit-container">
          <button className={this.state.error ? 'error' : ''}>Create poll</button>
          {this.state.error ? <div className="error">Give at least two options</div> : ''}
          <div style={{clear: 'both'}}></div>
        </div>
      </form>
    );
  }
  
  handleOptionClick(i) {
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
          name={`option${i}`}
          placeholder="Poll option…"
          onChange={event => this.updateOption(i, event)}
          onFocus={event => this.handleOptionClick(i)}/>
      </li>
    );
  }
}

export default withRouter(PollForm);
