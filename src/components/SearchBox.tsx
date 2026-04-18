import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    width: 0,
    transition: "0.3s",
    "&:focus": {
      width: "200px",
    },
  },
}));

export default function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchMovies = async (text: string) => {
    if (!text) return;

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_APP_TMDB_V3_API_KEY}&query=${text}`
    );

    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div>
      <Search
        style={
          isFocused
            ? { border: "1px solid white", backgroundColor: "black" }
            : {}
        }
      >
        <SearchIconWrapper
          onClick={() => {
            searchInputRef.current?.focus();
            searchMovies(query);
          }}
        >
          <SearchIcon />
        </SearchIconWrapper>

        <StyledInputBase
          inputRef={searchInputRef}
          placeholder="Search movies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchMovies(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Search>

      {/* RESULTS */}
      {results.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            backgroundColor: "black",
            padding: "10px",
          }}
        >
          {results.map((movie) => (
            <div key={movie.id} style={{ margin: "10px" }}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <p style={{ color: "white" }}>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}