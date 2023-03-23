import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from './components/AddMovie';

import "./App.css";

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMoviesHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("https://react-http-44ebf-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
            if (!res.ok) {
                throw new Error("Something went Wrong");
            }

            const data = await res.json();
            const loadedMovies=[];
            for(const key in data){
              loadedMovies.push({
                id:key,
                title:data[key].title,
                openingText:data[key].openingText,
                releaseDate:data[key].releaseDate
              })
            }

            setMovies(loadedMovies);
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);
    }, []);

    const addMovieHandler=async (movie) =>{
      const res = await fetch("https://react-http-44ebf-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",{
        method:'POST',
        body:JSON.stringify(movie),
        headers:{
          'Content-Type':'application/json'
        }
      });

      const data=res.json();
      console.log(data);
    }

    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler]);

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>
                {!isLoading && movies.length > 0 && (
                    <MoviesList movies={movies} />
                )}
                {!isLoading && error === null && movies.length === 0 && (
                    <p>No Movies</p>
                )}
                {isLoading && <p>Data is Loading ...</p>}
                {!isLoading && error && <p>{error}</p>}
            </section>
        </React.Fragment>
    );
}

export default App;
