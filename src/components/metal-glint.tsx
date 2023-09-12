import styled, { css } from 'styled-components';

type GlintTheme = 'gold' | 'silver' | 'player' | 'enemy' | 'ui' | 'green' | 'blue';

const getMetalColors = (theme?: GlintTheme) => {
  /* --co-metal: var(--co-player); */
  /* --co-metal: hsla(var(--hsl-white), 0); //hide, only show the glint */
  /* --co-metal: hsla(var(--hsl-yellow), 1); //hide, only show the glint */

  switch (theme) {
    case 'gold':
      return css`
        --co-metal: var(--color-yellow-light);
        --co-glint: var(--color-yellow-dark);
      `;
    case 'silver':
      return css`
        --co-metal: var(--color-white-light);
        --co-glint: var(--color-white);
      `;
    case 'green':
      return css`
        --co-metal: var(--color-green);
        --co-glint: var(--color-green-light);
      `;
    case 'blue':
      return css`
        --co-metal: var(--color-blue-dark);
        --co-glint: var(--color-blue-light);
      `;
    case 'player':
      return css`
        --co-metal: var(--co-player);
        --co-glint: var(--co-player-highlight);
      `;
    case 'enemy':
      return css`
        --co-metal: var(--co-enemy-bordertop);
        --co-glint: var(--co-enemy-highlight);
      `;
    case 'ui':
      return css`
        --co-metal: var(--color-yellow-light);
        --co-glint: var(--color-yellow-dark);
      `;
    default:
      return css`
        --co-metal: var(--co-player);
        --co-glint: var(--co-player-highlight);
      `;
  }
};

interface ScWrapperProps {
  $glintTheme?: GlintTheme;
  $activated?: boolean;
}
export const ScGlintWrapper = styled.div<ScWrapperProps>`
  position: absolute;
  inset: 0;
  z-index: -1;

  ${(p) => getMetalColors(p.$glintTheme)};

  background: var(--co-metal);
  background: linear-gradient(
    355deg,
    var(--co-metal) 0%,

    var(--co-metal) 15%,
    var(--co-glint) 17%,
    var(--co-glint) 25%,
    var(--co-metal) 35%,

    var(--co-metal) 55%,
    var(--co-glint) 60%,
    var(--co-glint) 70%,
    var(--co-metal) 80%,

    var(--co-metal) 100%
  );

  background-size: 100% 200%;
  background-repeat: repeat;
  transition: background-size .5s ease-in-out;

  @keyframes gradient-intermittent {
    0% {
      background-position: 50% -100%;
    }
    40% {
      background-position: 50% -100%;
    }
    60% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% 100%;
    }
  }
  @keyframes gradient-wrap {
    0% {
      background-position: 0% -100%;
    }
    100% {
      background-position: 0% 100%;
    }
  }

  /* background: radial-gradient(var(--co-metal), var(--co-glint)); */
  /* animation: gradient2 5s ease-in-out infinite; */
  animation: gradient-wrap 30s linear infinite;
`;

interface Props {
  glintTheme?: GlintTheme;
  activated?: boolean;
}
export const MetalGlint = ({ glintTheme, activated = false }: Props) => {
  return <ScGlintWrapper $glintTheme={glintTheme} $activated={activated}/>;
};

export default MetalGlint;
