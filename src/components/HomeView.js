import React, { Fragment } from 'react';
import LanguageComponent from './LanguageComponent';
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

class HomeView extends LanguageComponent {
  render() {
    return (
      <Fragment>
        <PollForm language={this.state.language}/>
        <Instructions>
          <div>{this.state.t.home_instruction_create}</div>
          <div>{this.state.t.home_instruction_share}</div>
          <div>{this.state.t.home_instruction_analyze}</div>
        </Instructions>
        <Faq id="faq">
          <h2>{this.state.t.home_faq_title}</h2>
        </Faq>
      </Fragment>
    );
  }
}

export default HomeView;
