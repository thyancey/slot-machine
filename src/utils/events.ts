// based off of
// https://www.falldowngoboone.com/blog/talk-to-your-react-components-with-custom-events/

function on(eventType: string, listener: (event: CustomEvent) => void) {
  // @ts-ignore
  document.addEventListener(eventType, listener);
}

function off(eventType: string, listener: (event: CustomEvent) => void) {
  // @ts-ignore
  document.removeEventListener(eventType, listener);
}

function once(eventType: string, listener: (event: CustomEvent) => void) {
  on(eventType, handleEventOnce);

  function handleEventOnce(event: CustomEvent) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}

function trigger(eventType: string, data: unknown = {}) {
  console.log('a');
  const event = new CustomEvent(eventType, { detail: data });
  console.log('b');
  document.dispatchEvent(event);
}

export { on, once, off, trigger };