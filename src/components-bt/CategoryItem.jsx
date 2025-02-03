import React from 'react';
import { BsCheckCircleFill, BsCircle, BsChevronDown, BsChevronRight, BsDashCircleFill } from 'react-icons/bs'; // 📦 Import des icônes Bootstrap
import './CategoryItem.css'; // 🎨 Styles de l'élément catégorie

const CategoryItem = ({ 
  name, 
  totalProducts, 
  selected, 
  hasSubcategories,
  isExpanded,
  onToggle,
  onExpand,
  readOnly,
  level = 0,
  isIndeterminate = false // ⚠️ État indéterminé (ex : case à cocher partiellement sélectionnée)
}) => {

  // 🖱️ Rendu de la case à cocher en fonction des conditions
  const renderCheckbox = () => {
    if (readOnly) return null; // 🚫 Si en lecture seule, on ne montre pas la case à cocher
    if (isIndeterminate) return <BsDashCircleFill className="icon-bt indeterminate-bt" />; // 🔲 Case indéterminée
    return selected ? <BsCheckCircleFill className="icon-bt check-bt" /> : <BsCircle className="icon-bt" />; // ✅ Case cochée ou vide
  };

  // 📊 Détermine si on doit afficher le nombre de produits
  const shouldShowProductCount = () => {
    if (!readOnly) return true; // 📈 Toujours afficher le nombre de produits si ce n'est pas en lecture seule
    return selected && !hasSubcategories; // 👀 Afficher le nombre de produits si sélectionné et sans sous-catégories
  };

  return (
    <div 
      className={`category-item-bt level-${level}-bt ${selected ? 'selected-bt' : ''} ${isIndeterminate ? 'indeterminate-bt' : ''} ${readOnly ? 'readonly-bt' : ''}`} // 🏷️ Classes dynamiques en fonction des états
      onClick={(e) => {
        if (!readOnly) { // 🚫 En lecture seule, on n'interagit pas
          e.stopPropagation(); // 🛑 Empêche la propagation de l'événement
          onToggle(); // 🔄 Change l'état de sélection
        }
      }}
    >
      <div className="category-content-bt"> {/* 📝 Contenu de la catégorie */}
        {hasSubcategories && ( // 📁 Si la catégorie a des sous-catégories
          <button 
            className="expand-btn-bt" 
            onClick={(e) => {
              e.stopPropagation(); // 🚫 Empêche la propagation du clic
              onExpand(); // 🔽 Développe ou réduit les sous-catégories
            }}
          >
            {isExpanded ? <BsChevronDown /> : <BsChevronRight />} {/* ⬇️ ou ➡️ selon si les sous-catégories sont ouvertes */}
          </button>
        )}
        {!hasSubcategories && <div style={{ width: '28px' }} />} {/* ⬛ Si pas de sous-catégories, on espace l'élément */}

        {renderCheckbox()} {/* ✅ Affichage de la case à cocher */}
        <span className="category-name-bt">{name}</span> {/* 🏷️ Nom de la catégorie */}
        
        {shouldShowProductCount() && totalProducts > 0 && ( // 📊 Affiche le nombre de produits si applicable
          <span className="products-count-bt">{totalProducts} produits</span> // 🛍️ Nombre de produits
        )}
      </div>
    </div>
  );
};

export default CategoryItem; // 🚀 Export du composant
