import React, { useState, useEffect } from 'react';
import './App.css'; 
import { movies$ } from './movies'; 

const MovieCard = ({ movie, onDelete }) => {
  const { id, title, category, likes, dislikes } = movie;
  const ratio = likes / (likes + dislikes) * 100;

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="movie-card">
      <h2 className="movie-title">{title}</h2>
      <p className="movie-category">{category}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${ratio}%` }}></div>
      </div>
      <p className="like-dislike-ratio">{`${likes} 👍 / ${dislikes} 👎`}</p>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
};

const App = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Utilisez la promesse movies$ pour récupérer les films
    movies$.then(moviesResponse => {
      setMovies(moviesResponse);
    }).catch(error => {
      console.error('Error fetching movies: ', error);
    });
  }, []);

  const handleDelete = (id) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
  };

  return (
    <div className="app">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default App;
