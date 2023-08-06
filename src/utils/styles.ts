export const MixinBorders = (topColor: string, sideColor: string) => {
  return `
    border-top: var(--val-depth) solid var(${topColor});
    border-left: var(--val-depth) solid var(${sideColor});
    border-right: var(--val-depth) solid var(${sideColor});
    border-bottom: var(--val-depth) solid var(${topColor});
  `;
};