import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import tinygradient from 'tinygradient';
import styled from 'styled-components';

const Box = styled.div`
  height: 30px;
  width: 45px;
  cursor: pointer;
  margin: auto;
  border: 1px solid lightgray;
  font-size: 10px;
  padding-top: 15px;
  border-radius: 3px;
`;

const StyledOptionVoteForm = styled.div`
  background-color: lightgray;
  border-top: 1px solid white;
  border-bottom: 1px solid darkgray;
  border-radius: 3px;
`;

const OptionName = styled.div`
  float: left;
  width: 100px;
  position: relative;
  top: 15px;
  font-size: 0.8em;
  @media screen and (max-width: 450px) {
    float: none;
    width: auto;
    position: unset;
    padding: 5px;
    font-size: 1em;
    border-bottom: 1px solid darkgray;
    margin-bottom: 10px;
  }
}
`;
const BoxesContainer = styled.div`
  display: grid;
  grid-auto-rows: minmax(50px, auto);
  grid-template-columns: repeat(6; 1fr);
`;

class OptionVoteForm extends Component {
  constructor(props) {
    super()
    this.updateSelectedValue = props.updateSelectedValue
    this.state = {
      name: props.name,
      selectedValue: props.selectedValue
    }
  }

  render() {
    const gradient = tinygradient(['#ff0000', '#00ff00'])
    const boxes = gradient.hsv(6).map((color, index) => {
      return (
        <Box
          key={index}
          style={{
            backgroundColor: this.props.selectedValue === index ? color.toHexString(): color.lighten(40).toHexString(),
            gridColumn: index + 1,
            color: this.props.selectedValue === index ? 'white' : 'black',
            textShadow: this.props.selectedValue === index ? '0 0 5px black' : '',
            fontWeight: this.props.selectedValue === index ? 'bold': '',
            boxShadow: this.props.selectedValue === index ? `0 0 10px ${color.toHexString()}`: ''
          }}
          onClick={() => this.props.updateSelectedValue(this.state.name, index)}>
          { ['Reject', 'Bad', 'Poor', 'Fair', 'Good', 'Excellent'][index].toString() }
        </Box>
      )}
    )
    return (
      <StyledOptionVoteForm key={this.state.name}>
        <OptionName>{this.state.name}</OptionName>
        <BoxesContainer>{boxes}</BoxesContainer>
      </StyledOptionVoteForm>
    );
  }
}

export default withRouter(OptionVoteForm);
