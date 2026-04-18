import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
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
    if (!text) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_APP_TMDB_V3_API_KEY}&query=${text}`
    );

    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* SEARCH BAR */}
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

      {/* DROPDOWN RESULTS */}
      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: 0,
            width: "350px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "black",
            border: "1px solid #333",
            zIndex: 9999,
            padding: "10px",
          }}
        >
          {results.map((movie) => (
            <div
              key={movie.id}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "50px", borderRadius: "4px" }}
                />
              )}
              <p style={{ color: "white", fontSize: "14px" }}>
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}