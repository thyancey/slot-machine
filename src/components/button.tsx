import styled from 'styled-components';

const ScWrapper = styled.button`
  border: var(--border-width) solid var(--color-pink);
  background-color: var(--color-grey);
  font-family: var(--font-base);
  border-radius: 0.75rem;
  font-size: 2rem;
  line-height: 2rem;
  padding: 0.5rem;
  padding-bottom: 0.7rem;

  cursor: pointer;
  &:hover {
    background-color: var(--color-pink);
  }
`;

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: Function;
}

function Button({ children, onClick }: Props) {
  return <ScWrapper onClick={(e) => onClick && onClick(e)}>{children}</ScWrapper>;
}

export default Button;
