import React, { Fragment } from 'react';
import LanguageComponent from './LanguageComponent';
import PollForm from './PollForm';
import Card from './styled';
import locales from '../translate';

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
    const t = locales(this.state.language)
    return (
      <Fragment>
        <PollForm language={this.state.language}/>
        <Instructions>
          <div>{t.home_instruction_create}</div>
          <div>{t.home_instruction_share}</div>
          <div>{t.home_instruction_analyze}</div>
        </Instructions>
        <Faq id="faq">
          <h2>{t.home_faq_title}</h2>
        </Faq>
      </Fragment>
    );
  }
}

export default HomeView;
