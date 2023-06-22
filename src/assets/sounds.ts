const snd_beep1 = new URL('/public/assets/sounds/snd_beep.mp3', import.meta.url).href;
const snd_beep2 = new URL('/public/assets/sounds/snd_boop.mp3', import.meta.url).href;
const snd_thump1 = new URL('/public/assets/sounds/snd_thump.mp3', import.meta.url).href;
const snd_thump2 = new URL('/public/assets/sounds/snd_thump2.mp3', import.meta.url).href;
const snd_explosion = new URL('/public/assets/sounds/snd_explosion.mp3', import.meta.url).href;
const snd_alarm = new URL('/public/assets/sounds/snd_alarm.mp3', import.meta.url).href;

export default {
  beep: snd_beep1,
  boop: snd_beep2,
  thump1: snd_thump1,
  thump2: snd_thump2,
  explosion: snd_explosion,
  alarm: snd_alarm
}
