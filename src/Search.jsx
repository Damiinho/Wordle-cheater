import { Button, Popover, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./contexts/AppContext";
import CachedIcon from "@mui/icons-material/Cached";

const Search = () => {
  const {
    word,
    setWord,
    particularActiveLetters,
    activeLetters,
    setParticularActiveLetters,
  } = useContext(AppContext);
  const [finalWords, setFinalWords] = useState([]);
  const [randomWord, setRandomWord] = useState([]);
  const [randomNumber, setRandomNumber] = useState(0);
  const [possibleWords, setPossibleWords] = useState([]);
  const textFieldsRef = useRef([]);
  const url = `https://api.datamuse.com/words?sp=${
    word[0].length > 0 ? word[0] : "?"
  }${word[1].length > 0 ? word[1] : "?"}${word[2].length > 0 ? word[2] : "?"}${
    word[3].length > 0 ? word[3] : "?"
  }${word[4].length > 0 ? word[4] : "?"}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setFinalWords(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [word, url]);

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

  const checkLettersInWords = () => {
    let wordsArray = [];

    if (activeLetters.every((item) => item.active === true)) {
      wordsArray = [{ word: randomWord }];
      fetchRandomWord();
    } else {
      finalWords.forEach((object) => {
        let allLettersIsCorrect = true;

        for (let i = 0; i < object.word.length; i++) {
          let availableLetters = particularActiveLetters[i]
            .filter((obj) => obj.active)
            .map((obj) => obj.letter)
            .filter((letter) =>
              activeLetters.some((obj) => obj.active && obj.letter === letter)
            );

          if (word[i] === "") {
            if (!availableLetters.includes(object.word[i])) {
              allLettersIsCorrect = false;
              break;
            }
          }
        }

        if (allLettersIsCorrect) {
          wordsArray.push(object);
        }
      });
    }

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

  return (
    <div className="search">
      <div className="search-title">Enter known letters</div>
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
      <div className="search-button">
        <Button
          onClick={() => {
            checkLettersInWords();
            setRandomNumber(0);
          }}
          variant="contained"
          size="large"
        >
          Search
        </Button>
      </div>
      {possibleWords.length > 0 ? (
        <div className="search-word">
          <p>{possibleWords[randomNumber].word}</p>
          <Button
            onClick={() => {
              if (activeLetters.every((item) => item.active === true)) {
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
