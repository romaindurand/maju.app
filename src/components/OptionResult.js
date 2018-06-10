import React, { Component } from 'react';
import tinygradient from 'tinygradient';
import styled from 'styled-components';

const StyledOptionResult = styled.div`
  width: 500px;
  margin-bottom: 20px;
`;
class OptionResult extends Component {  
  render() {
    const gradient = tinygradient(['#ff0000', '#00ff00'])
    const colors = gradient.hsv(6).map(color => color.toHexString());
    return (
      <StyledOptionResult>
        <div style={{width: '100px', float: 'left'}}>{this.props.name}</div>
        <div style={{float: 'left', position: 'relative'}}>
          <div style={{width: '1px', left: '150px', height: '30px', backgroundColor: 'black', position: 'absolute'}}></div>
          {this.props.ratios.map((ratio, index) => {
            return (<div key={index} style={{
              backgroundColor: colors[index],
              width: `${300 * ratio}px`,
              height: '25px',
              float: 'left',
              fontSize: '0.8em',
              paddingTop: '5px'
            }}>{ratio ? String(ratio * 100).substr(0, 4) + '%' : ''}</div>)
          })}
        </div>
        <div style={{clear: 'both'}}></div>        
      </StyledOptionResult>
    );
  }
}

export default OptionResult;
