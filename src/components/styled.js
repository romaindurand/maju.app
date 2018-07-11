import styled from 'styled-components';

const Card = styled.div`
  box-shadow: 0 0 5px darkgray;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 20px 5%;
  background-color: white;
  max-width: 600px;
  margin: auto;
  margin-top: 20px;
  transition: all 200ms ease-in-out;
  @media screen and (max-width: 700px) {
    max-width: 90%;
    padding: 20px 5%;
    margin-left: 10px;
    margin-right: 10px;
  }
`;

export default Card
