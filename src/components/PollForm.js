import React, { Component } from 'react';

class PollForm extends Component {
  constructor() {
    super()
    this.state = {
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
    console.log(body)
  }
  updateOption(index, event) {
    const options = this.state.options.slice()
    options[index] = event.target.value
    this.setState({options})
  }

  render() {
    const optionInputList = this.state.options.map((option, index) => this.renderOption(index))
    return (
      <form className="new-poll-form" onSubmit={this.handleSubmit}>
        <h2>Create your <i>majority judgement</i> poll in seconds !</h2>
        <input type="text" placeholder="Type your question here…" name="question"/>
        <h2>Add your poll options here</h2>
        <ol>{optionInputList}</ol>
        <div className="submit-container">
          <button>Create poll</button>
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
      <li key={i}>
        <input
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

export default PollForm;
