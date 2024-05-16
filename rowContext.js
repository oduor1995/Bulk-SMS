import React, { createContext, useState, useContext } from 'react';

// Create a context
const RowIdContext = createContext();

// Create a provider component
export const RowIdProvider = ({ children }) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  return (
    <RowIdContext.Provider value={{ selectedRowId, setSelectedRowId }}>
      {children}
    </RowIdContext.Provider>
  );
};

// Custom hook to consume the context
export const useRowId = () => useContext(RowIdContext);