import { ReactNode, createContext, useState } from 'react';

const AppContext = createContext({} as AppContextType);
interface AppContextType {
  score: number;
  incrementScore: Function;
}

interface Props {
  children: ReactNode
}
const AppProvider = ({ children }: Props) => {
  const [score, setScore] = useState(0);

  const incrementScore = (increment: number = 0) => {
    setScore(prevScore => prevScore + increment);
  };

  return (
    <AppContext.Provider value={{ score, incrementScore } as AppContextType}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };