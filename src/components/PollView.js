import React, { Component, Fragment } from 'react';
import VoteForm from './VoteForm';
import PollResult from './PollResult';

class PollView extends Component {
  render() {
    return (
      <Fragment>
        <VoteForm/>
        <PollResult language={this.props.language}/>
      </Fragment>
    );
  }
}

export default PollView;
