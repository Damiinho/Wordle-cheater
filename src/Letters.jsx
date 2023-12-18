import { useContext } from "react";
import { AppContext } from "./contexts/AppContext";
import { Button } from "@mui/material";

const Letters = () => {
  const { activeLetters, setActiveLetters, word, knownWOPlace } =
    useContext(AppContext);

  const handleClick = (letter) => {
    const newActiveLetters = [...activeLetters];
    const foundObject = newActiveLetters.find((item) => item.letter === letter);
    const isKnownLetter = knownWOPlace.some(
      (knownObj) => knownObj.value === letter
    );
    if (
      !(
        letter === word[0] ||
        letter === word[1] ||
        letter === word[2] ||
        letter === word[3] ||
        letter === word[4] ||
        isKnownLetter
      )
    ) {
      foundObject.active = !foundObject.active;
    }
    setActiveLetters(newActiveLetters);
  };

  return (
    <div className="letters">
      <div className="letters-title">Select letters to exclude</div>
      <div>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "q").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("q")}
        >
          q
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "w").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("w")}
        >
          w
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "e").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("e")}
        >
          e
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "r").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("r")}
        >
          r
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "t").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("t")}
        >
          t
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "y").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("y")}
        >
          y
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "u").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("u")}
        >
          u
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "i").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("i")}
        >
          i
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "o").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("o")}
        >
          o
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "p").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("p")}
        >
          p
        </Button>
      </div>
      <div>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "a").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("a")}
        >
          a
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "s").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("s")}
        >
          s
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "d").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("d")}
        >
          d
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "f").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("f")}
        >
          f
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "g").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("g")}
        >
          g
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "h").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("h")}
        >
          h
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "j").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("j")}
        >
          j
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "k").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("k")}
        >
          k
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "l").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("l")}
        >
          l
        </Button>
      </div>
      <div>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "z").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("z")}
        >
          z
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "x").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("x")}
        >
          x
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "c").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("c")}
        >
          c
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "v").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("v")}
        >
          v
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "b").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("b")}
        >
          b
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "n").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("n")}
        >
          n
        </Button>
        <Button
          className={`letter ${
            activeLetters.find((item) => item.letter === "m").active
              ? "active"
              : "inactive"
          }`}
          onClick={() => handleClick("m")}
        >
          m
        </Button>
      </div>
      <Button
        onClick={() => {
          const newActiveLetters = [...activeLetters];
          newActiveLetters.map((item) => (item.active = !item.active));
          setActiveLetters(newActiveLetters);
        }}
        variant="outlined"
        color="warning"
        size="small"
        className="invert"
      >
        invert selection
      </Button>
    </div>
  );
};

export default Letters;
