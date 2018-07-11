import React, { Component, Fragment } from 'react';
import VoteForm from './VoteForm';
import PollResult from './PollResult';

class PollView extends Component {
  render() {
    return (
      <Fragment>
        <VoteForm/>
        <PollResult/>
      </Fragment>
    );
  }
}

export default PollView;
