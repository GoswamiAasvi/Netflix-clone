import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

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
  color: "white",
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
  const navigate = useNavigate();

  const searchMovies = async (text: string) => {
    if (!text) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_APP_TMDB_V3_API_KEY}&query=${text}`
      );

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 🔍 SEARCH BAR */}
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
          onBlur={() => {
            setTimeout(() => {
              if (!document.activeElement?.closest("#search-results")) {
                setIsFocused(false);
              }
            }, 200);
          }}
        />
      </Search>

      {/* 🎬 SEARCH RESULTS */}
      {results.length > 0 && isFocused && (
        <div
          id="search-results"
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            width: "400px",
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
              onClick={() => {
                navigate(`/watch/${movie.id}`);
                setResults([]);
                setQuery("");
              }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/50x75?text=No+Image"
                }
                alt={movie.title}
                style={{ width: "50px" }}
              />
              <p style={{ color: "white", margin: 0 }}>
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}