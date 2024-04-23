import React, { useState, useEffect } from 'react';
import './App.css'; // Assurez-vous d'avoir un fichier CSS pour styliser les cartes
import { movies$ } from './movies'; // Importez la promesse movies$ depuis le fichier movies.js

const MovieCard = ({ movie, onDelete, onToggleLike }) => {
  const { id, title, category, likes, dislikes, liked } = movie;
  const ratio = likes / (likes + dislikes) * 100;

  const handleDelete = () => {
    onDelete(id);
  };

  const handleToggle = () => {
    onToggleLike(id);
  };

  return (
    <div className="movie-card">
      <h2 className="movie-title">{title}</h2>
      <p className="movie-category">{category}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${ratio}%` }}></div>
      </div>
      <p className="like-dislike-ratio">{`${likes} 👍 / ${dislikes} 👎`}</p>
      <button onClick={handleToggle}>{liked ? "Je n'aime pas" : "J'aime"}</button>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(4);

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

  const handleToggleLike = (id) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, liked: !movie.liked } : movie
      )
    );
  };

  const handleChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Retour à la première page lors du changement de catégorie
  };

  const handleChangePerPage = (e) => {
    setMoviesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Retour à la première page lorsque le nombre d'éléments par page change
  };

  // Filtrer les films en fonction de la catégorie sélectionnée
  const filteredMovies = selectedCategory === 'Toutes' ? movies : movies.filter(movie => movie.category === selectedCategory);

  // Index du dernier film de la page actuelle
  const indexOfLastMovie = currentPage * moviesPerPage;
  // Index du premier film de la page actuelle
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  // Liste des films pour la page actuelle
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Fonction pour changer la page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand">Catégories</div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <select className="form-select" value={selectedCategory} onChange={handleChangeCategory}>
                  <option value="Toutes">Toutes</option>
                  {[...new Set(movies.map(movie => movie.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </li>
            </ul>
            <div className="d-flex">
              <div className="mx-3">Éléments par page :</div>
              <div>
                <select className="form-select" value={moviesPerPage} onChange={handleChangePerPage}>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {}
      <div className="app">
        {currentMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} onToggleLike={handleToggleLike} />
        ))}
      </div>

      {}
      <div className="pagination">
        <button className="btn btn-secondary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Précédent</button>
        <button className="btn btn-secondary" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastMovie >= filteredMovies.length}>Suivant</button>
      </div>
    </div>
  );
};

export default App;
