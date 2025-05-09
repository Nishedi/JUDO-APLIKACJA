// import React, { useEffect, useState } from "react";
// import styles from "./MultiSelectDropdown.module.css";



// const MultiSelectDropdown = ({options, selectedOptions, setSelectedOptions}) => {
// //   const [] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);

//   // Funkcja dodająca opcję do listy
//   const handleAddOption = (option) => {
//     setSelectedOptions((prevSelected) => [...prevSelected, {id: Date.now(), name: option.name}]);
//   };


//   // Funkcja usuwająca opcję z listy (pierwsze wystąpienie)
//   const handleRemoveOption = (optionId) => {
//     setSelectedOptions((prevSelected) => {
//       const index = prevSelected.indexOf(optionId);
//       if (index !== -1) {
//         // Usuwa pierwsze wystąpienie z listy
//         const newSelected = [...prevSelected];
//         newSelected.splice(index, 1);
//         return newSelected;
//       }
//       return prevSelected;
//     });
//   };

//   const moveUp = (index) => {
//     if (index > 0) {
//       const newSelected = [...selectedOptions];
//       const [movedItem] = newSelected.splice(index, 1); // Usuwamy element
//       newSelected.splice(index - 1, 0, movedItem); // Wstawiamy go w poprzednie miejsce
//       setSelectedOptions(newSelected);
//     }
//   };

//   // Funkcja zmieniająca kolejność (przesuwanie w dół)
//   const moveDown = (index) => {
//     if (index < selectedOptions.length - 1) {
//       const newSelected = [...selectedOptions];
//       const [movedItem] = newSelected.splice(index, 1); // Usuwamy element
//       newSelected.splice(index + 1, 0, movedItem); // Wstawiamy go w kolejne miejsce
//       setSelectedOptions(newSelected);
//     }
//   };

//   return (
//     <div
//       className={styles.dropdownContainer}
//       >
//       <div
//         onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
//         className={styles.dropdownHeader}
//       >
//         {selectedOptions.length === 0 ? (
//           <span className={styles.placeholder}>Wybierz ćwiczenia</span>
//         ) : (
//           <span>
//             {selectedOptions.map((optionId, index) => {
//               return (
//                 <span key={index} className={styles.selectedOption}>
//                    <div> 
//                   {optionId?.name}{" "}
                 
//                   <button
//                     className={styles.removeButton}
//                     onClick={(e) => {
//                       e.stopPropagation(); // Zapobiega zamknięciu dropdownu
//                       handleRemoveOption(optionId);
//                     }}
//                   >
//                     ✕
//                   </button>
//                   </div>
//                   <div>
//                   <button
//                       className={styles.moveButton}
//                       onClick={(e) => {moveUp(index);e.stopPropagation();}}
//                     >
//                       ↑
//                   </button>
//                   <button
//                     className={styles.moveButton}
//                     onClick={(e) => {moveDown(index);e.stopPropagation();}}
//                   >
//                     ↓
//                   </button>
//                   <br/>
//                   </div>
                 
//                 </span>
//               );
//             })}
//           </span>
//         )}
//       </div>
//       {isOpen && (
//         <div className={styles.dropdownMenu}>
//           <button
//             className={styles.confirmButton}
//             onClick={() => setIsOpen(false)}
//           >
//             Zamknij
//           </button>
//           {options.map((option) => (
            
//             <div 
//             onClick={() => handleAddOption(option)}
//             key={option.id} className={styles.dropdownItem}>
//               <span>{option.name}</span>
              
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiSelectDropdown;
import React, { useEffect, useState } from "react";
import styles from "./MultiSelectDropdown.module.css";

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddOption = (option) => {
    setSelectedOptions((prevSelected) => [...prevSelected, { id: Date.now(), name: option.name }]);
  };

  const handleRemoveOption = (optionId) => {
    setSelectedOptions((prevSelected) => {
      const index = prevSelected.indexOf(optionId);
      if (index !== -1) {
        const newSelected = [...prevSelected];
        newSelected.splice(index, 1);
        return newSelected;
      }
      return prevSelected;
    });
  };

  const moveUp = (index) => {
    if (index > 0) {
      const newSelected = [...selectedOptions];
      const [movedItem] = newSelected.splice(index, 1);
      newSelected.splice(index - 1, 0, movedItem);
      setSelectedOptions(newSelected);
    }
  };

  const moveDown = (index) => {
    if (index < selectedOptions.length - 1) {
      const newSelected = [...selectedOptions];
      const [movedItem] = newSelected.splice(index, 1);
      newSelected.splice(index + 1, 0, movedItem);
      setSelectedOptions(newSelected);
    }
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dropdownContainer}>
      <div
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
        className={styles.dropdownHeader}
      >
        {selectedOptions.length === 0 ? (
          <span className={styles.placeholder}>Wybierz ćwiczenia</span>
        ) : (
          <span>
            {selectedOptions.map((optionId, index) => (
              <span key={index} className={styles.selectedOption}>
                <div>
                  {optionId?.name}{" "}
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(optionId);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <button
                    className={styles.moveButton}
                    onClick={(e) => { moveUp(index); e.stopPropagation(); }}
                  >
                    ↑
                  </button>
                  <button
                    className={styles.moveButton}
                    onClick={(e) => { moveDown(index); e.stopPropagation(); }}
                  >
                    ↓
                  </button>
                  <br />
                </div>
              </span>
            ))}
          </span>
        )}
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <input
            type="text"
            placeholder="Szukaj ćwiczenia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button
            className={styles.confirmButton}
            onClick={() => setIsOpen(false)}
          >
            Zamknij
          </button>
          {filteredOptions.map((option) => (
            <div
              onClick={() => handleAddOption(option)}
              key={option.id}
              className={styles.dropdownItem}
            >
              <span>{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
