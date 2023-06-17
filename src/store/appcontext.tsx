import { ReactNode, createContext, useState } from 'react';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  incrementScore: Function;
  selectedItemKey: string;
  setSelectedItemKey: Function;
}

interface Props {
  children: ReactNode
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);
  const [selectedItemKey, setSelectedItemKey] = useState('');

  const incrementScore = (increment: number = 0) => {
    setScore(prevScore => prevScore + increment);
  };

  return (
    <AppContext.Provider value={{ score, incrementScore, selectedItemKey, setSelectedItemKey } as AppContextType}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };