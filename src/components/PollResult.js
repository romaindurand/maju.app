import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import OptionResult from './OptionResult';
import cookie from 'react-cookies';

const StyledPollResult = styled.div`
  box-shadow: 0 0 5px darkgray;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 3px;
  padding-top: 15px;
  padding-bottom: 20px;
  background-color: white;
  max-width: 600px;
  margin: auto;
  text-align: center;
  a {
    text-decoration: none;
    color: green;
    font-weight: bold;
  }
`;

class PollResult extends Component {
  constructor({match}) {
    super()
    this.state = {
      open: false,
      loading: false,
      pollId: match.params.pollId,
      poll: null,
      error: null
    }
  }

  
  render() {
    const winner = this.state.poll && this.state.poll.winner.join(', ')
    const resultTitle = <h2>Results <i>({+this.state.voteCount || 0} vote{this.state.voteCount !== 1 ? 's' : ''})</i></h2>
    return this.state.open ?
      <StyledPollResult>
        {
          this.state.loading ? 'Loading ...' :
            <Fragment>
              {this.state.error ? this.state.error : resultTitle}
              {this.state.poll && this.state.poll.winner.length === 1 ? <h3>Winner : {winner}</h3> : <h3>Tie break : {winner}</h3>}
            </Fragment>
        }
        {
          this.state.poll &&
          this.state.poll.sortedOptions
            .map(optionName => {
              return this.state.poll.ratios.find(ratio => ratio.name === optionName)
            })
            .map((ratio, index) => {
              return (<OptionResult rank={index} key={ratio.name} name={ratio.name} ratios={ratio.scoreRatio}/>)
            })
        }
      </StyledPollResult>
      : <StyledPollResult><a href='' onClick={this.showResults.bind(this)}>View results</a></StyledPollResult>
  }

  async showResults(event) {
    if (event) event.preventDefault()
    this.setState({open: true, loading: true})
    const response = await fetch(`/api/results/${this.state.pollId}`);
    this.setState({loading: false})
    if (response.status === 404) return this.setState({error: 'Poll not found'})
    const poll = await response.json();
    this.setState({poll, voteCount: poll.voteCount});
  }

  async componentDidMount() {
    const voteCookie = cookie.load(this.state.pollId);
    if(voteCookie) this.showResults()
  }
}

export default withRouter(PollResult);
