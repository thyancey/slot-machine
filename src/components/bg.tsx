import styled from 'styled-components';

const ScBg = styled.div`
  position: absolute;
  background-color: var(--co-bg-secondary);
  color: var(--co-bg-primary);

  inset: calc(-1 * var(--val-reel-height));
  font-size: var(--val-reel-height);
  font-family: var(--font-8bit2);
  line-height: 10rem;
  z-index: -2;
  letter-spacing: -3rem;
  transform: rotate(-20deg);
  top: -50%;
  opacity: 1;

  transition: background-color .5s ease-out, color .3s linear;

  .lit-up & {
    background-color: var(--co-bg-secondary-lit);
    color: var(--co-bg-primary-lit);
  }
`;

function Layout() {
  const bgText = Array(100).fill('S L O T S');
  return (
    <ScBg>
      <p>{bgText.join(' ! ')}</p>
    </ScBg>
  );
}

export default Layout;
