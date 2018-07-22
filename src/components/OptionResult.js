import React from 'react';
import tinygradient from 'tinygradient';
import styled from 'styled-components';
import LanguageComponent from './LanguageComponent';

const StyledOptionResult = styled.div`
  width: calc(100% - 50px);
  margin-bottom: 10px;
  margin-left: 10px;
`;

const StyledRatio = styled.div`
  height: 30px;
  float: left;
  font-size: 0.9em;
  padding-top: 2px;
  cursor: pointer;
  box-sizing: border-box;
`;
const Tooltip = styled.div`
  box-sizing: border-box;
  position: absolute;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
  z-index: 10;
  box-shadow: 0 0 10px black;
  min-width: 200px;
  transition: opacity 400ms ease-in-out, left 400ms ease-in-out, background-color 400ms ease-in-out;
  i {
    font-weight: bold;
    font-style: normal;
  }
  @media screen and (max-width: 750px) {
    left: calc(50% - 150px) !important;
    width: 300px !important;
    margin: auto;
  }
`;
const ResultContainer = styled.div`
  position: relative;
  margin-left: 30px;
  margin-top: 10px;
  width: 100%;
  height: 30px;
`;
const MedianBar = styled.div`
  width: 1px;
  left: calc(50% - 1px);
  height: 30px;
  background-color: black;
  position: absolute;
  pointer-events: none;
`;
class OptionResult extends LanguageComponent {  
  constructor() {
    super();
    this.state = {
      ...this.state,
      tooltipIndex: null
    };
  }
  render() {
    const gradient = tinygradient(['#ff0000', '#33dd33'])
    const colors = gradient.hsv(6).map(color => color.toHexString());
    const ranks = this.state.t.maju_ranks;
    return (
      <StyledOptionResult>
        <div style={{position: 'absolute', textAlign: 'left'}}>{this.props.rank + 1}.</div>
        <div style={{fontWeight: 'bold', marginLeft: 30, textAlign: 'left', width: 'calc(100% - 70px)'}}>{this.props.name}</div>

        <ResultContainer>
          <MedianBar />
          <Tooltip
            onClick={this.clickHandler.bind(this, this.state.tooltipIndex)}
            style={{
              left: formatRatio(this.props.ratios.reduce((memo, ratio, index) => {
                if (index < this.state.tooltipIndex) memo += ratio;
                return memo;
              }, 0)),
              backgroundColor: colors[this.state.tooltipIndex],
              width: formatRatio(this.props.ratios[this.state.tooltipIndex], 6),
              opacity: this.state.tooltipVisible ? 1 : 0,
              pointerEvents: this.state.tooltipVisible ? 'all' : 'none'
            }}
          >
            {formatRatio(this.props.ratios[this.state.tooltipIndex], 5)}
            {this.state.t.result_details[0]}
            <i>{this.props.name}</i>
            {this.state.t.result_details[1]}
            <i>{ranks[this.state.tooltipIndex]}</i>
          </Tooltip>
          {
            this.props.ratios.map((ratio, index) => 
              ratio ? <StyledRatio
                key={index}
                style={{
                  backgroundColor: colors[index],
                  border: `2px outset ${colors[index]}`,
                  width: `${ratio*100}%`,
                }}
                onClick={this.clickHandler.bind(this, index)}
              >
                {ratio ? formatRatio(ratio) : ''}
              </StyledRatio> : null
            )
          }
        </ResultContainer>
        <div style={{clear: 'both'}}></div>        
      </StyledOptionResult>
    );
  }

  clickHandler(index) {
    this.setState({ tooltipIndex: index, tooltipVisible: index === this.state.tooltipIndex ? !this.state.tooltipVisible : true })
  }
}

function formatRatio(ratio, precision = 4) {
  return `${String(ratio * 100).substr(0, precision)}%`;
}

export default OptionResult;
