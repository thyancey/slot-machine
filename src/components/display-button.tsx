import styled from 'styled-components';

export const StyledButton = styled.button`
  font-family: var(--font-base);
  /* border-radius: 0.25rem; */
  font-size: 1.5rem;
  line-height: 2rem;
  padding: 0.5rem;

  background-color: transparent;
  border: .3rem dashed var(--color-pink);
  color: var(--color-white);

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
