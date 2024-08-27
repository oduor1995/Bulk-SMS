import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
export const RowIdContext = createContext();

// Create a provider component
export const RowIdProvider = ({ children }) => {
  const [selectedRowId, setSelectedRowId] = useState(1);
  const [selectedCampaignGroup, setSelectedCampaignGroup] = useState(1);
  const [senderNames, setSenderNames] = useState(1);


  const setSelectedRow = (id) => {
    setSelectedRowId(id); 
  };
  const setSender = (id) => {
    setSenderNames(id);
  };

  useEffect(()=>{
  }, [selectedRowId])

  return (
    <RowIdContext.Provider value={{ selectedRowId, setSelectedRow, selectedCampaignGroup,senderNames, setSender  }}>
      {children}
    </RowIdContext.Provider>
  );
};

// Custom hook to consume the context
export const useRowId = () => useContext(RowIdContext);
