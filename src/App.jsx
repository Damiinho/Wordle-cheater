import "./App.scss";
import Search from "./Search";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import Letters from "./Letters";
function App() {
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
        <Search />
        <Letters />
      </main>
    </>
  );
}

export default App;
