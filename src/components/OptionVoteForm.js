import React from 'react';
import { withRouter } from 'react-router-dom';
import tinygradient from 'tinygradient';
import styled from 'styled-components';
import LanguageComponent from './LanguageComponent';

const Box = styled.div`
  color: black;
  height: 30px;
  width: 45px;
  cursor: pointer;
  margin: auto;
  border: 1px solid lightgray;
  padding-top: 15px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: width 400ms ease-in-out, font-size 400ms ease-in-out, color 400ms ease-in-out;
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
  font-weight: bold;
}
`;
const BoxesContainer = styled.div`
  margin-bottom: 10px;
  display: grid;
  overflow: hidden;
  grid-auto-rows: minmax(50px, auto);
  grid-template-columns: repeat(6 1fr);
`;

class OptionVoteForm extends LanguageComponent {
  constructor(props) {
    super()
    this.updateSelectedValue = props.updateSelectedValue
    this.state = {
      ...this.state,
      name: props.name,
      selectedValue: props.selectedValue
    }
  }

  render() {
    const gradient = tinygradient(['#ff0000', '#33dd33']);
    const boxes = gradient.hsv(6).map((color, index) => {
      return (
        <Box
          key={index}
          title={ this.state.t.maju_ranks[index].toString() }
          style={{
            width: this.props.selectedValue === index ? '60px' : null,
            fontSize: this.props.selectedValue === index ? '0.7em' : '0.6em',
            fontWeight: this.props.selectedValue === index ? 'bold' : 'normal',
            backgroundColor: this.props.selectedValue === index ? color.toHexString(): color.lighten(40).toHexString(),
            gridColumn: index + 1,
            fontWeight: this.props.selectedValue === index ? 'bold': '',
            boxShadow: this.props.selectedValue === index ? `0 0 10px ${color.toHexString()}`: ''
          }}
          onClick={() => this.props.updateSelectedValue(this.state.name, index)}>
          { this.state.t.maju_ranks[index].toString() }
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
