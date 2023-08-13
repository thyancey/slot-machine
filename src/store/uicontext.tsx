import { ReactNode, SetStateAction, createContext, useCallback, useRef, useState } from 'react';

const UiContext = createContext({} as UiContextType);
interface UiContextType {
  playerText: string;
  setPlayerText: (text: SetStateAction<string>) => void;
}

interface Props {
  children: ReactNode;
}
const UiProvider = ({ children }: Props) => {
  const [playerText, setPlayerTextState] = useState<string>('');
  const timeoutRef = useRef<number | null>(null);

  const setPlayerText = useCallback((text: string) => {
    setPlayerTextState(text);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      setPlayerTextState('');
    }, 1000);
  }, [ setPlayerTextState ])

  return (
    <UiContext.Provider
      value={
        {
          playerText,
          setPlayerText
        } as UiContextType
      }
    >
      {children}
    </UiContext.Provider>
  );
};

export { UiProvider, UiContext };
