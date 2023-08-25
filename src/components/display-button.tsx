import styled from 'styled-components';

export const StyledButton = styled.button`
  font-family: var(--font-base);
  /* border-radius: 0.25rem; */

  padding: 0.5rem;

  font-size: 3rem;
  line-height: 4rem;

  /* background-color: transparent; */
  background-color: var(--co-button-secondary);
  border: 0.3rem dashed var(--co-button-primary);
  color: var(--co-button-primary);


  &.enabled {
    cursor: pointer;
    
    &:hover {
      background-color: var(--co-button-primary);
      border: 0.3rem dashed var(--co-button-secondary);
      color: var(--co-button-secondary);
    }
  }

  &.disabled {
    border: 0.3rem dashed var(--color-grey-dark);
    color: var(--color-grey-dark);
  }

  &.bs-white {
    background-color: var(--color-white);
    color: var(--color-grey);
  }
`;

type ButtonStyle = 'normal' | 'special' | 'disabled' | 'white';

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  disabled?: boolean;
  buttonStyle?: ButtonStyle;
}

function DisplayButton({ children, onClick, disabled, buttonStyle = 'normal', onMouseEnter }: Props) {
  const className = disabled ? 'disabled' : `enabled bs-${buttonStyle}`;

  return (
    <StyledButton
      className={className}
      onClick={(e) => !disabled && onClick && onClick(e)}
      onMouseEnter={(e) => !disabled && onMouseEnter && onMouseEnter(e)}
    >
      {children}
    </StyledButton>
  );
}

export default DisplayButton;
