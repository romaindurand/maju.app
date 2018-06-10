import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import VoteForm from './VoteForm';
import PollResult from './PollResult';

class PollView extends Component {
  constructor({match}) {
    super()
    this.state = {
      error: null,
      options: ['', '', '']
    }
  }

  
  render() {
    return (
      <div>
        <VoteForm />
        <PollResult />
      </div>
    );
  }
}

export default withRouter(PollView);
