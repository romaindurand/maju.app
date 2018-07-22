import React, { Fragment } from 'react';
import LanguageComponent from './LanguageComponent';
import { withRouter } from 'react-router-dom';
import OptionResult from './OptionResult';
import voteAuth from '../lib/voteAuth';
import Card from './styled';

const StyledPollResult = Card.extend`
  padding-top: 15px;
  text-align: center;
  margin-bottom: 400px;
  a {
    text-decoration: none;
    color: green;
    font-weight: bold;
  }
  h2 i{
    font-style: normal;
    font-weight: lighter;
    font-size: 0.8em;
  }
`;

class PollResult extends LanguageComponent {
  constructor({match}) {
    super()
    this.state = {
      ...this.state,
      open: false,
      loading: false,
      pollId: match.params.pollId,
      poll: null,
      error: null
    }
  }

  
  render() {
    const winner = this.state.poll && this.state.poll.winner.join(', ')
    const resultTitle = <h2>{this.state.t.result_title} <i>({+this.state.voteCount || 0} vote{this.state.voteCount !== 1 ? 's' : ''})</i></h2>
    return this.state.open ?
      <StyledPollResult>
        {
          this.state.loading ? this.state.t.loading :
            <Fragment>
              {this.state.error ? this.state.error : resultTitle}
              {
                this.state.poll && this.state.poll.winner.length === 1 ?
                  <h3>{this.state.t.result_winner} : {winner}</h3>
                  : <h3>{this.state.t.result_tie} : {winner}</h3>}
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
      : <StyledPollResult><a href='' onClick={this.showResults.bind(this)}>{this.state.t.view_results}</a></StyledPollResult>
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
    super.componentDidMount();
    if(voteAuth.hasVoted(this.state.pollId)) this.showResults();
  }
}

export default withRouter(PollResult);
