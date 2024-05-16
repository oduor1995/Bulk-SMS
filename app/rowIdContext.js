import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
export const RowIdContext = createContext();

// Create a provider component
export const RowIdProvider = ({ children }) => {
  const [selectedRowId, setSelectedRowId] = useState(1);

  const setSelectedRow = (id) => {
    setSelectedRowId(id); 
  };

  useEffect(()=>{
  }, [selectedRowId])

  return (
    <RowIdContext.Provider value={{ selectedRowId, setSelectedRow }}>
      {children}
    </RowIdContext.Provider>
  );
};

// Custom hook to consume the context
export const useRowId = () => useContext(RowIdContext);
