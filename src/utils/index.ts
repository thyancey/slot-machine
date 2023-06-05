export type MinMaxTouple = [min: number, max: number];
export const randInRange = (range: MinMaxTouple, isIndexes = false) => {
  const val = Math.random() * (range[1] - range[0]) + range[0];
  return isIndexes ? Math.floor(val) : val;
};
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

export type EasingFunction = 'linear' | 'easeInOutQuad' | 'easeInOutBounce'
export const getEasing = (perc: number, easingFunc: EasingFunction) => {
  switch(easingFunc){
    case 'linear': return easeLinear(perc);
    case 'easeInOutQuad': return easeInOutQuad(perc);
    default: return easeLinear(perc);
  }
}
const easeLinear = (t: number) => t;
const easeInOutQuad = (t: number) => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}