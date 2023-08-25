import styled from 'styled-components';

export const StyledButton = styled.button`
  border: var(--border-width-small) solid var(--color-button-primary);
  background-color: var(--color-button-secondary);
  font-family: var(--font-base);
  border-radius: 0.75rem;
  font-size: 1.5rem;
  padding: 0.5rem;

  cursor: pointer;
  color: var(--color-button-primary);
  /* &:hover{
    background-color: var(--color-button-primary);
  }

  &.disabled{
    border-color: var(--co-button-disabled-primary);
    color: var(--co-button-disabled-primary);
    cursor: default;
    &:hover{
      background-color: var(--co-button-disabled-secondary);
    }
  } */

  &.bs-special{
    background-color: var(--co-button-secondary);
    border-color: var(--co-button-primary);
    
    &:hover{
      background-color: var(--co-button-primary);
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
