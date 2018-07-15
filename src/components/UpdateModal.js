import LanguageComponent from './LanguageComponent';
import React from 'react';
import styled from 'styled-components';

const StyledModal = styled.div`
  position: fixed;
  border-radius: 20px;
  top: 20%;
  left: 20px;
  /* height: 20%; */
  width: calc(100% - 150px);
  z-index: 1000;
  box-shadow: 10px 10px 100px black;
  padding: 50px;
  /* padding-top: 100px; */
  background-color: white;
  border: 5px outset lightgreen;
  text-align: center;
  cursor: pointer;
  h1 {
    color: green;
  }
`;
class UpdateModal extends LanguageComponent {
  constructor() {
    super();
    this.state = {
      ...this.state,
      visible: false
    };
  }
  componentDidMount() {
    window.addEventListener('UpdateAvailable', () => this.setState({ visible: true }));
  }
  render() {
    return this.state.visible ? (
      <StyledModal onClick={() => window.location.reload(true)}>
        <h1> New version is available! Please reload the page </h1>
      </StyledModal>
    ) : null;
  }
}

export default UpdateModal;
