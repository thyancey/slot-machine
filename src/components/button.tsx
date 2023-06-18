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
  color: var(--color-white);
  &:hover{
    background-color: var(--color-pink);
  }

  &.disabled{
    border-color: var(--color-purple);
    cursor: default;
    color: var(--color-grey-light);
    &:hover{
      background-color: var(--color-grey);
    }
  }
`;

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: Function;
  disabled?: Boolean;
}

function Button({ children, onClick, disabled }: Props) {
  return (
    <StyledButton className={disabled ? 'disabled' : ''} onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </StyledButton>
  );
}

export default Button;
