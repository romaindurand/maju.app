import LanguageComponent from './LanguageComponent';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import OptionVoteForm from './OptionVoteForm';
import styled from 'styled-components';
import voteAuth from '../lib/voteAuth';
import Fingerprint2 from 'fingerprintjs2';
import Recaptcha from 'react-google-invisible-recaptcha';
import Card from './styled';

const StyledVoteForm = Card.extend`
  text-align: center;
`;

const VoteFormList = styled.div`
  margin-top: 20px;
`;

const Question = styled.h1`
  margin: 0;
`;

const Instructions = styled.div`
  color: gray;
`;

const VoteButton = styled.button`
  position: relative;
  left: 10px;
  font-size: 1.5em;
  background-color: #00aa00;
  border-radius: 5px;
  color: white;
  border: 1px solid #00ff00;
  padding: 5px 20px;
  cursor: pointer;
  margin-top: 10px;
`;

class VoteForm extends LanguageComponent {
  constructor({match}) {
    super()
    this.state = {
      ...this.state,
      loading: true,
      pollId: match.params.pollId,
      selectedValues: {},
      question: '',
      canVote: false,
      recaptchaSiteKey: process.env.REACT_APP_RECAPTCHA_SITEKEY,
      error: null
    }
  }

  async componentDidMount() {
    super.componentDidMount();
    const hasVoted = voteAuth.hasVoted(this.state.pollId);
    this.setState({hasVoted});

    fetch(`/api/poll/${this.state.pollId}`)
      .then(response => {
        this.setState({loading: false});
        if (response.status === 404) throw new Error('404')
        return response.json()
      })
      .then(poll => {
        if (hasVoted) return this.setState({
          question: poll.question,
          error: 'has_voted',
          loading: false
        });
        const selectedValues = poll.options.reduce((memo, option) => ({...memo, [option]: null}), {})
        this.setState({
          question: poll.question,
          selectedValues,
          canVote: true
        })
      })
      .catch(ex => {
        return this.setState({
          question: '404 POLL NOT FOUND :(',
          error: ''
        });
      })
  }

  updateSelectedValue (optionName, value) {
    this.setState({
      selectedValues: Object.assign({}, this.state.selectedValues, {
        [optionName]: value
      })
    })
  }

  isVoteValid () {
    return Object.values(this.state.selectedValues).every(value => value !== null)
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  handleVoteClick () {
    if (this.isProduction()) this.recaptcha.execute()
    else this.postFormData()
  }

  async postFormData () {
    const token = this.isProduction() ? this.recaptcha.getResponse() : null
    const pollId = this.props.match.params.pollId;
    voteAuth.setVote(pollId);
    new Fingerprint2().get(async fingerprint => {
      const response = await fetch(`/api/vote/${pollId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          token,
          vote: this.state.selectedValues,
          fingerprint
        })
      });
      // TODO : handle errors
      const body = await response.json();
      window.location.reload(true);
    });
  }
  
  render() {
    const optionVoteForms = Object.keys(this.state.selectedValues).map((option, index) => (
      <OptionVoteForm
        name={option}
        selectedValue={this.state.selectedValues[option]}
        key={index}
        updateSelectedValue={this.updateSelectedValue.bind(this)}
      />
    ))
    const question = (
      <div>
        <Question>{this.state.question}</Question>
        <Instructions>{ this.state.canVote ? this.state.t.vote_instructions : this.state.t[this.state.error] }</Instructions>
      </div>)
    return (
      <StyledVoteForm>
        <div>{this.state.loading ? this.state.t.loading : question}</div>
        {
          this.state.canVote ?
            <Fragment>
              <VoteFormList>{optionVoteForms}</VoteFormList>
              {
                this.isVoteValid() ?
                  <VoteButton
                    className="drop"
                    onClick={this.handleVoteClick.bind(this)}>
                    {this.state.t.vote_button}
                  </VoteButton> : null
              }
              {
                this.isProduction() ?
                  <Recaptcha
                    ref={ ref => this.recaptcha = ref }
                    sitekey={ this.state.recaptchaSiteKey }
                    onResolved={ this.postFormData.bind(this) } />  
                  : null
              }
            </Fragment>
            : null
        }
      </StyledVoteForm>
    );
  }
}

export default withRouter(VoteForm);
