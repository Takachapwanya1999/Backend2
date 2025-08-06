import { createContext, useState } from 'react';

const initialState = {
  places: [],
  setPlaces: () => {},
  loading: false,
  setLoading: () => {},
};

export const PlaceContext = createContext(initialState);

export const PlaceProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const allPlaces = {
    places,
    setPlaces,
    loading,
    setLoading,
  };

  return (
    <PlaceContext.Provider value={allPlaces}>{children}</PlaceContext.Provider>
  );
};
