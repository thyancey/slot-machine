import styled from 'styled-components';

const ScWrapper = styled.footer`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: center;

  span{
    font-size: 2rem;
  }
`;

function Footer() {
  return (
    <ScWrapper>
      <span>{'Squirrel attacks for 1 damage!'}</span>
    </ScWrapper>
  );
}

export default Footer;
