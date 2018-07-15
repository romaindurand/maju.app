import React, { Fragment } from 'react';
import LanguageComponent from './components/LanguageComponent';
import logo from './logo.png';
import './App.css';
import HomeView from './components/HomeView';
import PollView from './components/PollView';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import cookie from 'react-cookies';

const Header = styled.header`
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: white;
  height: 60px;
  box-shadow: 0 0 5px darkgray;
  border-bottom: 1px solid lightgray;

  img {
    position: relative;
    top: 10px;
    left: 10px;
    height: 40px;
    float: left;
  }
  h1 {
    display: inline-block;
    font-size: 30px;
    margin-top: 7px;
    margin-left: 15px;
  }
`;

const StyledFlagList = styled.div`
  float: right;
  margin: 20px;
`;

const Flag = styled.div`
  /* padding: 5px; */
  border: 1px solid lightgray;
  float: left;
  cursor: pointer;
  img {
    height: 20px;
    top: 0;
    left: 0;
  }
`;
const Content = styled.div`
  margin-top: 70px;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
`

class App extends LanguageComponent {
  constructor({match}) {
    super()
    this.state = {
      ...this.state,
      languageAlert: false,
      languages: ['en-US', 'fr-FR']
    }
  }
  render() {
    const FlagList = <StyledFlagList>{
      this.state.languages
        .filter(language => language !== this.state.language)
        .map(language =>
          <Flag key={language} onClick={() => {
            cookie.save('language', language)
            window.dispatchEvent(new Event('LanguageChange'));
          }}>
            <img src={`${language}.svg`} alt={language}/>
          </Flag>
        )
    }</StyledFlagList>
    return (
      <div className="App">
        <BrowserRouter>
          <Fragment>
            <Header>
              <StyledLink to="/">
                <img src={logo} alt="Maju Poll Logo"/>
                <h1>maju</h1>
              </StyledLink>
              {FlagList}
            </Header>
            <Content>
              <Route exact path="/" component={HomeView}/>
              <Route path="/:pollId" component={PollView} />
            </Content>
          </Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
