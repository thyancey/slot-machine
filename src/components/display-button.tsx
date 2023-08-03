import styled from 'styled-components';

export const StyledButton = styled.button`
  font-family: var(--font-base);
  /* border-radius: 0.25rem; */

  padding: 0.5rem;
  
  font-size: 3rem;
  line-height: 4rem;

  /* background-color: transparent; */
  background-color: var(--co-button-secondary);
  border: .3rem dashed var(--co-button-primary);
  color: var(--co-button-primary);

  cursor: pointer;
`;

type ButtonStyle = 'normal' | 'special' | 'disabled';

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  buttonStyle?: ButtonStyle;
}

function DisplayButton({ children, onClick, disabled, buttonStyle = 'normal'}: Props) {
  const className = disabled ? 'disabled' : `bs-${buttonStyle}`;

  return (
    <StyledButton className={className} onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </StyledButton>
  );
}

export default DisplayButton;
