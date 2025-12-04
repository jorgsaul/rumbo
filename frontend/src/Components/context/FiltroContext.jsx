import { createContext, useState, useContext } from "react";

const FiltroContext = createContext();

export const FiltroProvider = ({ children }) => {
  const [selectedEtiquetas, setSelectedEtiquetas] = useState({});
  const [filtroActivo, setFiltroActivo] = useState("todos");

  const handleCheckboxChange = (category_id, tagId) => {
    setSelectedEtiquetas((prev) => {
      const currentCategory = prev[category_id] || [];
      const isSelected = currentCategory.includes(tagId);

      if (isSelected) {
        const updatedCategory = currentCategory.filter((id) => id !== tagId);
        const newState = {
          ...prev,
          [category_id]: updatedCategory,
        };
        if (updatedCategory.length === 0) {
          delete newState[category_id];
        }
        return newState;
      } else {
        const newState = {
          ...prev,
          [category_id]: [...currentCategory, tagId],
        };
        return newState;
      }
    });
  };

  const obtenerIdsEtiquetas = () => {
    return Object.values(selectedEtiquetas).flat();
  };

  return (
    <FiltroContext.Provider
      value={{
        selectedEtiquetas,
        setSelectedEtiquetas,
        handleCheckboxChange,
        filtroActivo,
        setFiltroActivo,
        obtenerIdsEtiquetas,
      }}
    >
      {children}
    </FiltroContext.Provider>
  );
};

export const useFiltro = () => {
  const context = useContext(FiltroContext);
  if (!context) {
    throw new Error("useFiltro debe ser usado dentro de un FiltroProvider");
  }
  return context;
};
