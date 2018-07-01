import React, { Component } from 'react';
import tinygradient from 'tinygradient';
import styled from 'styled-components';

const StyledOptionResult = styled.div`
  width: calc(100% - 50px);
  margin-bottom: 10px;
  margin-left: 10px;
`;
class OptionResult extends Component {  
  render() {
    const gradient = tinygradient(['#ff0000', '#00ff00'])
    const colors = gradient.hsv(6).map(color => color.toHexString());
    return (
      <StyledOptionResult>
        <div style={{position: 'absolute', textAlign: 'left'}}>{this.props.rank + 1}.</div>
        <div style={{marginLeft: 30, textAlign: 'left', width: 'calc(100% - 70px)'}}>{this.props.name}</div>

        <div style={{
          position: 'relative',
          marginLeft: 30,
          marginTop: 10,
          width: '100%',
          height: 30
        }}>
          <div style={{width: 1, left: '50%', height: 30, backgroundColor: 'black', position: 'absolute'}}></div>
          {this.props.ratios.map((ratio, index) => {
            return (<div key={index} style={{
              backgroundColor: colors[index],
              width: `${ratio*100}%`,
              height: 25,
              float: 'left',
              fontSize: '0.8em',
              paddingTop: 5
            }}>{ratio ? String(ratio * 100).substr(0, 4) + '%' : ''}</div>)
          })}
        </div>
        <div style={{clear: 'both'}}></div>        
      </StyledOptionResult>
    );
  }
}

export default OptionResult;
