import styled from 'styled-components';
import { MixinBorders } from '../utils/styles';

export const StyledButton = styled.button`
  font-family: var(--font-base);
  /* border-radius: 0.25rem; */
  font-size: 1.5rem;
  line-height: 2rem;
  padding: 0.5rem;

  /* background-color: var(--co-player); */
  background-color: transparent;
  border: 1rem dashed var(--co-player);
  color: var(--color-white);
  
  ${MixinBorders('--co-player-bordertop', '--co-player-borderside')}

  cursor: pointer;
  &:hover{
    width: calc(100% - var(--val-depth));
    height: calc(100% - var(--val-depth));
  }

  /* &.disabled{
    cursor: default;
  } */

  &.bp-none{
    border: 0;
  }
  &.bp-lt{
    border-left: 0;
    border-top: 0;
  }
  &.bp-lm{
    border-left: 0;
  }
  &.bp-lb{
    border-bottom: 0;
    border-left: 0;
  }
  &.bp-ct{
    border-top: 0;
  }
  &.bp-cm{
  }
  &.bp-cb{
    border-bottom: 0;
  }
  &.bp-rt{
    border-right: 0;
    border-top: 0;
  }
  &.bp-rm{
    border-right: 0;
  }
  &.bp-rb{
    border-right: 0;
    border-bottom: 0;
  }
`;

type ButtonStyle = 'normal' | 'special' | 'disabled';
type ButtonPos = 'none' | 'lt' | 'lm' | 'lb' | 'ct' | 'cm' | 'cb' | 'rt' | 'rm' | 'rb';

interface Props {
  children: string | JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  buttonStyle?: ButtonStyle;
  buttonPos?: ButtonPos;
}

function DepthButton({ children, onClick, disabled, buttonStyle = 'normal', buttonPos = 'cm'}: Props) {
  let className = disabled ? 'disabled' : `bs-${buttonStyle}`;
  className += ` bp-${buttonPos}`

  return (
    <StyledButton className={className} onClick={(e) => !disabled && onClick && onClick(e)}>
      {children}
    </StyledButton>
  );
}

export default DepthButton;
