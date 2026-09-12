import React, { createContext, useReducer, useEffect } from 'react';

export const PinboardContext = createContext();

const initialState = {
  pinnedRepos: JSON.parse(localStorage.getItem('pinnedRepos')) || []
};

function pinboardReducer(state, action) {
  switch (action.type) {
    case 'PIN_REPO':
      if (state.pinnedRepos.find(repo => repo.id === action.payload.id)) {
        return state;
      }
      return { ...state, pinnedRepos: [...state.pinnedRepos, action.payload] };
    case 'UNPIN_REPO':
      return { ...state, pinnedRepos: state.pinnedRepos.filter(repo => repo.id !== action.payload) };
    default:
      return state;
  }
}

export function PinboardProvider({ children }) {
  const [state, dispatch] = useReducer(pinboardReducer, initialState);

  useEffect(() => {
    localStorage.setItem('pinnedRepos', JSON.stringify(state.pinnedRepos));
  }, [state.pinnedRepos]);

  return (
    <PinboardContext.Provider value={{ state, dispatch }}>
      {children}
    </PinboardContext.Provider>
  );
}
