import React, { createContext, useReducer, useContext } from 'react';

// Crea el contexto
const AppContext = createContext();

// Hook para acceder al contexto
const useAppContext = () => {
  return useContext(AppContext);
};

// Define el estado inicial
const initialState = {
  name: '',
  Id: '',
  role: '',
  email: '',
  error: null,
};

// Define el reducer
const reducer = (state, action) => {
  console.log(action);

  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.value,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
      case 'SET_ROLE':
        return {
          ...state,
          role: action.value,
        };
    default:
      return state;
  }
};

// Exporta el contexto y el proveedor
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { UserProvider, useAppContext };
