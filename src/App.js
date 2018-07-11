import React, { Component, Fragment } from 'react';
import logo from './logo.png';
import './App.css';
import HomeView from './components/HomeView';
import PollView from './components/PollView';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: white;
  height: 60px;
  box-shadow: 0 0 5px darkgray;
  border-bottom: 1px solid lightgray;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Fragment>
            <Header>
              <StyledLink to="/">
                <img src={logo} alt="Maju Poll Logo"/>
                <h1>maju</h1>
              </StyledLink>
            </Header>
            <div className="content">
              <Route exact path="/" component={HomeView} />
              <Route path="/:pollId" component={PollView} />
            </div>
          </Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
