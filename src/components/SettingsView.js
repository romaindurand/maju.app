import LanguageComponent from './LanguageComponent';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-date-picker';

const StyledSettings = styled.div`
  margin: 5px;
  margin-left: 20px;
  text-align: left;
  h4 {
    margin: 10px -10px;
  }
`;
class Settings extends LanguageComponent {
  constructor() {
    super();
    this.state = {
      ...this.state,
      open: false,
      endDate: null
    };
  }

  getSettings() {
    return {
      endDate: this.state.endDate
    }
  }
  render() {
    const longDateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
    const tomorrowTimestamp = new Date().setSeconds(0) + 24 * 3600 * 1000
    const longEndDate = this.state.endDate ?
      this.state.endDate.toLocaleString(this.state.language, longDateOptions)
      : null;
    const chevron = this.state.moreOptions ? <i className='fas fa-angle-down'></i> : <i className='fas fa-angle-right'></i>

    return <Fragment>
      <div className='more-options'
        onClick={() => this.setState({open: !this.state.open})}>
        {chevron}{this.state.t.more_options}
      </div>
      <StyledSettings className={this.state.open ? 'drop' : 'hidden'}>
        <div>
          <h4>Date de fin</h4>
          <DatePicker
            onChange={date => date ?
              this.setState({ endDate: new Date(date.setSeconds(1)) })
              : this.setState({ endDate: null })}
            value={this.state.endDate}
            locale={this.state.language}
            minDate={new Date(tomorrowTimestamp)}
          />
          <div>{
            this.state.endDate ?
              `Fin des votes le ${longEndDate}`
              : 'Sondage illimité dans le temps'
          }</div>
        </div>
      </StyledSettings>
    </Fragment>
  }
}

export default Settings;
