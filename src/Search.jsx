import { Button, Popover, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./contexts/AppContext";
import CachedIcon from "@mui/icons-material/Cached";
import loadingIMG from "./img/ZZ5H.gif";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const Search = () => {
  const {
    word,
    setWord,
    particularActiveLetters,
    activeLetters,
    setActiveLetters,
    setParticularActiveLetters,
    windowWidth,
    knownWOPlace,
    setKnownWOPlace,
  } = useContext(AppContext);
  const [finalWords, setFinalWords] = useState([]);
  const [randomWord, setRandomWord] = useState([]);
  const [reqRandomWord, setReqRandomWord] = useState(true);
  const [randomNumber, setRandomNumber] = useState(0);
  const [possibleWords, setPossibleWords] = useState([]);
  const textFieldsRef = useRef([]);
  const [waitForSearch, setWaitForSearch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const alphabet = [
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
      ];

      let fullResult = [];
      if (word[0].length > 0) {
        const url = `https://api.datamuse.com/words?sp=${word[0]}${
          word[1].length > 0 ? word[1] : "?"
        }${word[2].length > 0 ? word[2] : "?"}${
          word[3].length > 0 ? word[3] : "?"
        }${word[4].length > 0 ? word[4] : "?"}`;

        try {
          const response = await fetch(url);
          const result = await response.json();
          fullResult = [...fullResult, ...result];
        } catch (error) {
          console.error(error);
        }
      } else {
        setWaitForSearch(true);
        for (let i = 0; i < alphabet.length; i++) {
          const url = `https://api.datamuse.com/words?sp=${alphabet[i]}${
            word[1].length > 0 ? word[1] : "?"
          }${word[2].length > 0 ? word[2] : "?"}${
            word[3].length > 0 ? word[3] : "?"
          }${word[4].length > 0 ? word[4] : "?"}&max=30`;

          try {
            const response = await fetch(url);
            const result = await response.json();
            fullResult = [...fullResult, ...result];
          } catch (error) {
            console.error(error);
          }
        }
      }
      setWaitForSearch(false);
      setFinalWords(fullResult);
    };

    fetchData();
  }, [word]);

  const fetchRandomWord = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?length=5"
      );
      const result = await response.json();
      setRandomWord(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  useEffect(() => {
    if (
      activeLetters.every((item) => item.active === true) &&
      particularActiveLetters[0].every((item) => item.active === true) &&
      particularActiveLetters[1].every((item) => item.active === true) &&
      particularActiveLetters[2].every((item) => item.active === true) &&
      particularActiveLetters[3].every((item) => item.active === true) &&
      particularActiveLetters[4].every((item) => item.active === true) &&
      word[0] === "" &&
      word[1] === "" &&
      word[2] === "" &&
      word[3] === "" &&
      word[4] === ""
    ) {
      setReqRandomWord(true);
    } else setReqRandomWord(false);
  }, [activeLetters, particularActiveLetters, word]);

  const checkLettersInWords = () => {
    let wordsArray = [];
    if (reqRandomWord && knownWOPlace.length === 0) {
      wordsArray = [{ word: randomWord }];
      fetchRandomWord();
    } else {
      finalWords.forEach((object) => {
        let allLettersIsCorrect = true;
        if (object.word.length > 5) {
          allLettersIsCorrect = false;
          return null;
        } else {
          const knownValues = knownWOPlace.map((knownObj) => knownObj.value);

          if (!knownValues.every((value) => object.word.includes(value))) {
            allLettersIsCorrect = false;
          } else {
            for (let i = 0; i < object.word.length; i++) {
              let availableLetters = particularActiveLetters[i]
                .filter((obj) => obj.active)
                .map((obj) => obj.letter)
                .filter((letter) =>
                  activeLetters.some(
                    (obj) => obj.active && obj.letter === letter
                  )
                );

              if (word[i] === "") {
                if (!availableLetters.includes(object.word[i])) {
                  allLettersIsCorrect = false;
                  break;
                }
              }
            }
          }
        }

        if (allLettersIsCorrect) {
          wordsArray.push(object);
        }
      });
    }
    setRandomNumber(Math.floor(Math.random() * wordsArray.length));

    setPossibleWords(wordsArray);
  };

  const handleTextFieldChange = (index, e) => {
    const newWord = [...word];

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      newWord[index] = "";
      setWord(newWord);

      textFieldsRef.current[index - 1].focus();
    } else {
      if (!(e.target.value.length > 1)) {
        newWord[index] = e.target.value;
      } else {
        newWord[index] = e.nativeEvent.data;
      }
      setWord(newWord);

      if (index < textFieldsRef.current.length - 1) {
        textFieldsRef.current[index + 1].focus();
      }
    }
  };

  const handleTextFieldKeyDown = (index, event) => {
    if (event.key === "Backspace" && word[index]) {
      setWord((prevWord) => {
        const newWord = [...prevWord];
        newWord[index] = "";
        return newWord;
      });
      textFieldsRef.current[index].focus();
    } else if (event.key === "Backspace" && index > 0 && !word[index]) {
      setWord((prevWord) => {
        const newWord = [...prevWord];
        newWord[index - 1] = "";
        return newWord;
      });
      textFieldsRef.current[index - 1].focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      textFieldsRef.current[index - 1].focus();
    } else if (event.key === "ArrowRight" && index < word.length - 1) {
      textFieldsRef.current[index + 1].focus();
    }
  };
  const [anchorEls, setAnchorEls] = useState(Array(word.length).fill(null));

  const handleClickPopover = (event, index) => {
    setAnchorEls((prevAnchorEls) => {
      const newAnchorEls = [...prevAnchorEls];
      newAnchorEls[index] = event.currentTarget;
      return newAnchorEls;
    });
  };

  const handleClosePopover = () => {
    setAnchorEls(Array(word.length).fill(null));
  };
  const id = open ? "simple-popover" : undefined;
  const handleClick = (letter, index) => {
    const newParticularActiveLetters = [...particularActiveLetters];
    const clickedLetter = newParticularActiveLetters[index].find(
      (item) => item.letter === letter
    );

    if (activeLetters.find((item) => item.letter === letter).active === false) {
      return null;
    } else {
      clickedLetter.active = !clickedLetter.active;
    }
    setParticularActiveLetters(newParticularActiveLetters);
  };
  const options = [
    { value: "q", label: "q" },
    { value: "w", label: "w" },
    { value: "e", label: "e" },
    { value: "r", label: "r" },
    { value: "t", label: "t" },
    { value: "y", label: "y" },
    { value: "u", label: "u" },
    { value: "i", label: "i" },
    { value: "o", label: "o" },
    { value: "p", label: "p" },
    { value: "a", label: "a" },
    { value: "s", label: "s" },
    { value: "d", label: "d" },
    { value: "f", label: "f" },
    { value: "g", label: "g" },
    { value: "h", label: "h" },
    { value: "j", label: "j" },
    { value: "k", label: "k" },
    { value: "l", label: "l" },
    { value: "z", label: "z" },
    { value: "x", label: "x" },
    { value: "c", label: "c" },
    { value: "v", label: "v" },
    { value: "b", label: "b" },
    { value: "n", label: "n" },
    { value: "m", label: "m" },
  ];

  const animatedComponents = makeAnimated();
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#242424",
      color: "white",
      width: 295,
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: "#242424", // Kolor opcji
      color: "white", // Kolor tekstu opcji
      width: 30,
      ":hover": {
        backgroundColor: "#606060",
        color: "white",
        cursor: "pointer",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#c2a65a", // Kolor tła dla wybranych opcji
      display: "flex",
      justifyContent: "space-between",
      width: 35,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white", // Kolor tekstu dla etykiety wybranej opcji
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white", // Kolor tekstu dla przycisku usuwania wybranej opcji
      width: 20,
      ":hover": {
        backgroundColor: "#981315", // Kolor tła przycisku usuwania po najechaniu myszą
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "white", // Kolor tekstu dla pola wejściowego
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#242424", // Kolor tła dla menu rozwijanego
    }),
    menuList: (provided) => ({
      ...provided,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }),
  };

  const handleSelect = (items) => {
    if (knownWOPlace.length < 5 || items.length < knownWOPlace.length) {
      setKnownWOPlace(items);
      const newActiveLetters = activeLetters.map((letterObj) => {
        const isKnownLetter = items.some(
          (knownObj) => knownObj.value === letterObj.letter
        );
        return {
          ...letterObj,
          active: isKnownLetter ? true : letterObj.active,
        };
      });

      setActiveLetters(newActiveLetters);
    }
  };
  const handleReset = () => {
    setWord(["", "", "", "", ""]);
    setKnownWOPlace([]);
    const newActiveLetters = [...activeLetters];
    newActiveLetters.map((item) => (item.active = true));
    setActiveLetters(newActiveLetters);
    const newParticularActiveLetters = [...particularActiveLetters];
    newParticularActiveLetters.map((table) => {
      table.map((letter) => (letter.active = true));
    });
    setParticularActiveLetters(newParticularActiveLetters);
  };

  return (
    <div className="search">
      <div className="search-title">
        <span>Enter known letters</span>
        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: windowWidth > 490 ? 13 : 11,
          }}
          onClick={handleReset}
          variant="outlined"
          color="error"
          size="small"
        >
          reset
        </Button>
      </div>
      <div className="search-text">
        {word.map((letter, index) => {
          return (
            <div key={index} className="search-text__block">
              <TextField
                value={letter}
                inputRef={(el) => {
                  textFieldsRef.current[index] = el;
                }}
                onChange={(e) => handleTextFieldChange(index, e)}
                onKeyDown={(e) => handleTextFieldKeyDown(index, e)}
              />
              <button onClick={(e) => handleClickPopover(e, index)}>
                specific exclude
              </button>
              <Popover
                id={id}
                open={Boolean(anchorEls[index])}
                anchorEl={anchorEls[index]}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "transparent",
                    borderRadius: 1,
                  },
                }}
              >
                <div className="fly-letters">
                  <div>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "q")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "q"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("q", index)}
                    >
                      q
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "w")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "w"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("w", index)}
                    >
                      w
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "e")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "e"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("e", index)}
                    >
                      e
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "r")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "r"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("r", index)}
                    >
                      r
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "t")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "t"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("t", index)}
                    >
                      t
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "y")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "y"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("y", index)}
                    >
                      y
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "u")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "u"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("u", index)}
                    >
                      u
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "i")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "i"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("i", index)}
                    >
                      i
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "o")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "o"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("o", index)}
                    >
                      o
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "p")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "p"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("p", index)}
                    >
                      p
                    </button>
                  </div>
                  <div>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "a")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "a"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("a", index)}
                    >
                      a
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "s")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "s"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("s", index)}
                    >
                      s
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "d")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "d"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("d", index)}
                    >
                      d
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "f")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "f"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("f", index)}
                    >
                      f
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "g")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "g"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("g", index)}
                    >
                      g
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "h")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "h"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("h", index)}
                    >
                      h
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "j")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "j"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("j", index)}
                    >
                      j
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "k")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "k"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("k", index)}
                    >
                      k
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "l")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "l"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("l", index)}
                    >
                      l
                    </button>
                  </div>
                  <div>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "z")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "z"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("z", index)}
                    >
                      z
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "x")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "x"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("x", index)}
                    >
                      x
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "c")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "c"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("c", index)}
                    >
                      c
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "v")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "v"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("v", index)}
                    >
                      v
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "b")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "b"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("b", index)}
                    >
                      b
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "n")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "n"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("n", index)}
                    >
                      n
                    </button>
                    <button
                      className={`letter ${
                        activeLetters.find((item) => item.letter === "m")
                          .active === false
                          ? "inactive"
                          : particularActiveLetters[index].find(
                              (item) => item.letter === "m"
                            ).active === false
                          ? "inactive"
                          : "active"
                      }`}
                      onClick={() => handleClick("m", index)}
                    >
                      m
                    </button>
                  </div>
                </div>
              </Popover>
            </div>
          );
        })}
      </div>
      <Select
        styles={customStyles}
        components={animatedComponents}
        options={options}
        isMulti
        placeholder="Pick known letters without place"
        value={knownWOPlace}
        onChange={(items) => handleSelect(items)}
      />
      <div className="search-button">
        <Button
          onClick={() => {
            if (!waitForSearch) {
              setRandomNumber(0);
              checkLettersInWords();
            }
          }}
          variant="contained"
          size="large"
        >
          {waitForSearch ? (
            <img style={{ maxWidth: 30 }} src={loadingIMG} alt="" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
      {possibleWords.length > 0 ? (
        <div className="search-word">
          <p>{possibleWords[randomNumber].word}</p>
          <Button
            onClick={() => {
              if (reqRandomWord) {
                checkLettersInWords();
              } else {
                setRandomNumber(
                  Math.floor(Math.random() * possibleWords.length)
                );
              }
            }}
            variant="outlined"
            size="medium"
          >
            <CachedIcon />
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Search;
