import { useEffect } from "react";

const Search = () => {
  const url = "https://api.datamuse.com/words?sp=????ck";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Pusta tablica zależności oznacza, że useEffect uruchomi się tylko raz po zamontowaniu komponentu

  return (
    <div className="search">
      <p>Find correct word.</p>
    </div>
  );
};

export default Search;
