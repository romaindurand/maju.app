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
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 340px) {
    width: 30px;
  }
`;

const StyledOptionVoteForm = styled.div`
  border-bottom: 2px solid darkgray;
  border-radius: 10px;
  padding-top: 5px;
  &:first-child {
    border-top: 1px solid lightgray;
  }
`;

const OptionName = styled.div`
  position: relative;
  font-size: 1em;
  float: none;
  text-align: left;
  padding: 5px;
  padding-left: 15px;
  width: auto;
  margin-bottom: 10px;
}
`;
const BoxesContainer = styled.div`
  margin-bottom: 10px;
  display: grid;
  overflow: hidden;
  grid-auto-rows: minmax(50px, auto);
  grid-template-columns: repeat(6 1fr);
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
