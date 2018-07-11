import React, { Component, Fragment } from 'react';
import PollForm from './PollForm';
import Card from './styled';

const Faq = Card.extend`
  margin-bottom: 1500px;
`;

const Instructions = Card.extend`
  display: flex;
  justify-content: space-evenly;
  div {
    margin-right: 5px;
  }
`;

class HomeView extends Component {
  render() {
    return (
      <Fragment>
        <PollForm />
        <Instructions>
          <div>1. Create a poll</div>
          <div>2. Share your link</div>
          <div>3. Analyze poll results</div>
        </Instructions>
        <Faq id="faq">
          <h2>What is majority judgement ?</h2>
        </Faq>
      </Fragment>
    );
  }
}

export default HomeView;
