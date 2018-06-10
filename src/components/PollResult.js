import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import OptionResult from './OptionResult';

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
`;

class PollResult extends Component {
  constructor({match}) {
    super()
    this.state = {
      loading: true,
      pollId: match.params.pollId,
      poll: null,
      error: null
    }
  }

  
  render() {
    return (
      <StyledPollResult>
        {this.state.error ? this.state.error : null}
        {this.state.loading ? 'Loading ...' : null}
        {
          this.state.poll &&
          this.state.poll.sortedOptions
            .map(optionName => {
              return this.state.poll.ratios.find(ratio => ratio.name === optionName)
            })
            .map(ratio => {
              return (<OptionResult key={ratio.name} name={ratio.name} ratios={ratio.scoreRatio}/>)
            })
        }
      </StyledPollResult>
    );
  }

  async componentDidMount() {
    const response = await fetch(`/api/results/${this.state.pollId}`);
    this.setState({loading: false})
    if (response.status === 404) return this.setState({error: 'Poll not found'})
    const poll = await response.json();
    this.setState({poll});
  }
}

export default withRouter(PollResult);
