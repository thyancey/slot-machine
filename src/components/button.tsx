import styled from 'styled-components';

export const StyledButton = styled.button`
  border: var(--border-width-small) solid var(--color-pink);
  background-color: var(--color-grey);
  font-family: var(--font-base);
  border-radius: 0.75rem;
  font-size: 1.5rem;
  line-height: 2rem;
  padding: 0.5rem;

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
  return <StyledButton onClick={(e) => onClick && onClick(e)}>{children}</StyledButton>;
}

export default Button;
