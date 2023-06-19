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
    border-color: var(--color-grey-light);
    color: var(--color-grey-light);
    cursor: default;
    &:hover{
      background-color: var(--color-grey);
    }
  }

  &.bs-special{
    background-color: var(--color-purple);
    border-color: var(--color-cyan);
    
    &:hover{
      background-color: var(--color-pink);
    }
  }
`;

type ButtonStyle = 'normal' | 'special' | 'disabled';

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  buttonStyle?: ButtonStyle;
}

function Button({ children, onClick, disabled, buttonStyle = 'normal' }: Props) {
  const className = disabled ? 'disabled' : `bs-${buttonStyle}`;
  return (
    <StyledButton className={className} onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </StyledButton>
  );
}

export default Button;
