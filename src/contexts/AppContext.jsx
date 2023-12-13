import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLetters, setActiveLetters] = useState([{letter: "q", active: true }, 
  {letter: "w", active: true},
  {letter: "e", active: true},
  {letter: "r", active: true},
  {letter: "t", active: true},
  {letter: "y", active: true},
  {letter: "u", active: true},
  {letter: "i", active: true},
  {letter: "o", active: true},
  {letter: "p", active: true},
  {letter: "a", active: true},
  {letter: "s", active: true},
  {letter: "d", active: true},
  {letter: "f", active: true},
  {letter: "g", active: true},
  {letter: "h", active: true},
  {letter: "j", active: true},
  {letter: "k", active: true},
  {letter: "l", active: true},
  {letter: "z", active: true},
  {letter: "x", active: true},
  {letter: "c", active: true},
  {letter: "v", active: true},
  {letter: "b", active: true},
  {letter: "n", active: true},
  {letter: "m", active: true}]
  ) 
  
  
  const providerValue = {
    windowWidth,activeLetters, setActiveLetters
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
