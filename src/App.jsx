import "./App.scss";
import Search from "./Search";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import Letters from "./Letters";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, styled, toolbarClasses } from "@mui/material";

function App() {
  const InfoTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${toolbarClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      border: "1px solid #dadde9",
    },
  }));

  return (
    <>
      <header>
        <h1>Wordle cheater</h1>
        <div className="header-logo">
          <CropSquareIcon fontSize="large" />
          <DisabledByDefaultRoundedIcon color="warning" fontSize="large" />
          <CropSquareIcon fontSize="large" />
          <CheckBoxIcon color="success" fontSize="large" />
          <CropSquareIcon fontSize="large" />
        </div>
      </header>
      <main>
        <InfoTooltip
          title={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                fontSize: 11,
              }}
            >
              <p>
                <u>
                  <b>{"Short instrucions:"}</b>
                </u>
              </p>
              <p>
                0. If you don&apos;t know any letter, just click
                &quot;search&quot;, you will get a random word :)
              </p>
              <p>1. Enter the letters whose position you know.</p>
              <p>2. Exclude letters that are definitely not in the word.</p>
              <p>
                3. You can also exclude letters that are definitely not in a
                specific position
              </p>
              <p>
                <b>4. Search!</b>
              </p>
            </div>
          }
        >
          <div className="info">
            <InfoIcon fontSize="large" style={{ color: "#727272" }} />{" "}
          </div>
        </InfoTooltip>

        <Search />
        <Letters />
      </main>
    </>
  );
}

export default App;
