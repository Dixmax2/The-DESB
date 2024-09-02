// src/componentes/SearchResults.jsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/search-products`, {
          params: { query },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>Resultados de Búsqueda</h1>
      <p>Resultados para: {query}</p>
      <ul>
        {results.map((product) => (
          <li key={product.id}>
            <a href={`/proyect/${product.id}`}>{product.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
