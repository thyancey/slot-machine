import { ReactNode, SetStateAction, createContext, useCallback, useRef, useState } from 'react';

const UiContext = createContext({} as UiContextType);
interface UiContextType {
  playerText: string;
  setPlayerText: (text?: SetStateAction<string>, timeout?: number) => void;
  enemyText: string;
  setEnemyText: (text?: SetStateAction<string>, timeout?: number) => void;
}

interface Props {
  children: ReactNode;
}
const UiProvider = ({ children }: Props) => {
  const [playerText, setPlayerTextState] = useState<string>('');
  const [enemyText, setEnemyTextState] = useState<string>('');
  const timeoutRef = useRef<number | null>(null);

  const setPlayerText = useCallback(
    (text: string | undefined = '', timeout: number | undefined = 0) => {
      setPlayerTextState(text);
      console.log('setPlayerText', text, timeout);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (timeout > 0) {
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
          setPlayerTextState('');
        }, timeout);
      }
    },
    [setPlayerTextState]
  );

  const setEnemyText = useCallback(
    (text: string | undefined = '', timeout: number | undefined = 0) => {
      setEnemyTextState(text);
      console.log('setEnemyText', timeout);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (timeout > 0) {
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
          setEnemyTextState('');
        }, timeout);
      }
    },
    [setEnemyTextState]
  );

  return (
    <UiContext.Provider
      value={
        {
          playerText,
          setPlayerText,
          enemyText,
          setEnemyText,
        } as UiContextType
      }
    >
      {children}
    </UiContext.Provider>
  );
};

export { UiProvider, UiContext };
