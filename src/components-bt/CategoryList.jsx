import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem'; // 🛍️ Import du composant CategoryItem pour afficher chaque catégorie
import treeviewData from '../data-bt/treeviewData.json'; // 📄 Import des données initiales des catégories
import './CategoryList.css'; // 🎨 Import des styles du composant CategoryList

const CategoryList = ({ 
  title, 
  onCategoryChange, // 🔄 Fonction pour gérer la mise à jour des catégories
  maxProducts = Infinity, // 🔢 Limite du nombre de produits sélectionnables
  readOnly = false, // 👁️ Mode lecture seule (impossible de modifier)
  categories: propCategories, // 📂 Prop pour les catégories initiales
  onShowModal // ⚠️ Fonction pour afficher un modal si le nombre de produits est trop élevé
}) => {
  
  // 🗃️ Initialisation de l'état local des catégories
  const [categories, setCategories] = useState(() => {
    if (propCategories) return propCategories; // 📂 Si les catégories sont passées en prop, on les utilise

    // 🧩 Fonction pour transformer les données en une structure de catégories avec sous-catégories
    const mapCategories = (items, parent = null, parentPath = []) => {
      if (!Array.isArray(items)) return []; // 🚫 Si ce n'est pas un tableau, retourner un tableau vide

      return items.map(item => ({
        id: item.id,
        name: item.name,
        totalProducts: item.product_count || 0, // 🛒 Nombre de produits
        selected: false, // ❌ Catégorie non sélectionnée par défaut
        expanded: false, // ➡️ Catégorie repliée par défaut
        parent,
        parentPath: [...parentPath],
        subcategories: item.children 
          ? mapCategories(item.children, item.name, [...parentPath, { id: item.id, name: item.name, totalProducts: item.product_count || 0 }])
          : [] // 📂 Si la catégorie a des enfants, on les mappe également
      }));
    };

    return mapCategories(treeviewData.categories_tree); // 🌳 Mapping des données initiales des catégories
  });

  // 🧠 Si les catégories sont passées en prop, mettre à jour l'état local
  useEffect(() => {
    if (propCategories) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  // 🔄 Fonction pour envoyer les catégories visibles à l'extérieur du composant
  useEffect(() => {
    if (!readOnly && onCategoryChange) {
      // 📤 Fonction pour obtenir les catégories sélectionnées
      const getVisibleCategories = (cats) => {
        const buildCategoryTree = (category) => {
          const state = getSelectionState(category); // 🏷️ Récupère l'état de sélection de la catégorie
          
          if (!state.selected && !state.indeterminate) {
            return null; // ❌ Si la catégorie n'est pas sélectionnée et n'a pas d'état indéterminé, on ne la garde pas
          }

          const result = {
            ...category,
            expanded: true, // 🔽 On développe la catégorie
            selected: state.selected, // ✅ Sélectionnée ou non
            subcategories: []
          };

          if (category.subcategories?.length) {
            // 🔢 Si la catégorie a des sous-catégories, on les ajoute
            const visibleSubcategories = category.subcategories
              .map(buildCategoryTree)
              .filter(Boolean); // 🧐 Ne garder que celles qui sont sélectionnées ou indéterminées

            if (visibleSubcategories.length > 0) {
              result.subcategories = visibleSubcategories; // 📂 Ajouter les sous-catégories visibles
            }
          }

          return result;
        };

        return cats.map(buildCategoryTree).filter(Boolean); // 🌲 Récupère les catégories visibles
      };

      const visibleCategories = getVisibleCategories(categories);
      onCategoryChange(visibleCategories); // 📤 Envoie les catégories visibles à la fonction `onCategoryChange`
    }
  }, [categories, onCategoryChange, readOnly]);

  // 🧮 Fonction pour calculer le total des produits sélectionnés
  const calculateTotalSelected = (cats) => {
    return cats.reduce((total, category) => {
      if (!category) return total; // 🚫 Ignore les catégories non définies

      if (!category.subcategories?.length && category.selected) {
        return total + category.totalProducts; // 🛒 Si la catégorie est sélectionnée, ajoute son total
      }
      
      if (category.subcategories?.length > 0) {
        return total + calculateTotalSelected(category.subcategories); // 🔢 Additionne les produits des sous-catégories
      }

      return total;
    }, 0); // ✨ Initialiser le total à 0
  };

  // 🏷️ Fonction pour obtenir l'état de sélection d'une catégorie
  const getSelectionState = (category) => {
    if (!category.subcategories?.length) {
      return { selected: category.selected, indeterminate: false }; // ✅ Si pas de sous-catégories, juste sélectionnée ou non
    }

    // 🔄 Vérification des états des sous-catégories
    const childStates = category.subcategories.map(getSelectionState);
    const allSelected = childStates.every(state => state.selected); // ✅ Vérifie si toutes les sous-catégories sont sélectionnées
    const anySelected = childStates.some(state => state.selected || state.indeterminate); // 🟡 Vérifie si une sous-catégorie est sélectionnée ou indéterminée
    
    return {
      selected: allSelected, // ✅ Si toutes les sous-catégories sont sélectionnées
      indeterminate: !allSelected && anySelected // 🔲 Si certaines sous-catégories sont sélectionnées ou indéterminées
    };
  };

  // 🔄 Fonction pour gérer la sélection d'une catégorie
  const toggleCategory = (categoryPath) => {
    if (readOnly) return; // 🚫 Pas de changement en mode lecture seule

    setCategories(prevCategories => {
      // 🧩 Fonction pour mettre à jour la catégorie dans l'arbre des catégories
      const updateCategoryInTree = (categories, path) => {
        return categories.map(category => {
          if (path[0] === category.id) {
            if (path.length === 1) {
              const state = getSelectionState(category);
              const newSelected = !(state.selected || state.indeterminate); // 🔄 Inverse l'état de sélection
              
              // 🔽 Fonction pour mettre à jour les sous-catégories
              const updateSubcategories = (subcats) => {
                if (!subcats) return [];
                return subcats.map(sub => ({
                  ...sub,
                  selected: newSelected,
                  subcategories: updateSubcategories(sub.subcategories)
                }));
              };

              if (!category.subcategories?.length) {
                return {
                  ...category,
                  selected: !category.selected // ✅ Inverse la sélection de la catégorie
                };
              }

              return {
                ...category,
                selected: newSelected,
                expanded: category.expanded || newSelected, // 🔽 Si la catégorie est sélectionnée, l'étendre
                subcategories: updateSubcategories(category.subcategories) // 📂 Mettre à jour les sous-catégories
              };
            } else {
              return {
                ...category,
                subcategories: updateCategoryInTree(category.subcategories, path.slice(1))
              };
            }
          }
          return category;
        });
      };

      const updatedCategories = updateCategoryInTree(prevCategories, categoryPath);
      const newTotal = calculateTotalSelected(updatedCategories);

      if (newTotal > maxProducts) {
        onShowModal?.(); // ⚠️ Si le total dépasse la limite, afficher le modal
        return prevCategories; // 🚫 Ne pas mettre à jour les catégories si la limite est dépassée
      }

      return updatedCategories; // ✅ Retourne les catégories mises à jour
    });
  };

  // 🔄 Fonction pour gérer l'expansion des sous-catégories
  const toggleExpand = (categoryPath) => {
    setCategories(prevCategories => {
      const updateExpanded = (categories, path) => {
        return categories.map(category => {
          if (path[0] === category.id) {
            if (path.length === 1) {
              return { ...category, expanded: !category.expanded }; // 🔽 Inverse l'état d'expansion de la catégorie
            } else {
              return {
                ...category,
                subcategories: updateExpanded(category.subcategories, path.slice(1))
              };
            }
          }
          return category;
        });
      };

      return updateExpanded(prevCategories, categoryPath); // 🔄 Retourne les catégories avec l'expansion mise à jour
    });
  };

  // 🔄 Fonction pour rendre chaque catégorie
  const renderCategory = (category, path = []) => {
    if (!category) return null; // 🚫 Si la catégorie n'existe pas, ne rien rendre

    const currentPath = [...path, category.id];
    const state = getSelectionState(category); // 🏷️ Récupère l'état de sélection de la catégorie

    return (
      <div key={`${category.id}-${path.length}`} className="category-group-bt"> {/* 📦 Conteneur pour chaque catégorie */}
        <CategoryItem
          name={category.name}
          totalProducts={category.totalProducts}
          selected={state.selected}
          isIndeterminate={state.indeterminate}
          hasSubcategories={category.subcategories?.length > 0} // 📂 Vérifie si la catégorie a des sous-catégories
          isExpanded={category.expanded} // 🔽 Si la catégorie est développée
          onToggle={() => toggleCategory(currentPath)} // 🔄 Gère la sélection de la catégorie
          onExpand={() => toggleExpand(currentPath)} // 🔽 Gère l'expansion de la catégorie
          readOnly={readOnly} // 👁️ Mode lecture seule
          level={path.length} // 🔢 Niveau de profondeur dans l'arbre des catégories
        />
        
        {category.subcategories?.length > 0 && (readOnly || category.expanded) && (
          <div className="subcategories-bt"> {/* 📂 Sous-catégories */}
            {category.subcategories.map(sub => 
              renderCategory(sub, currentPath) // 🔄 Rend chaque sous-catégorie récursivement
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="category-list-bt">
      <h2>{title}</h2> {/* 📜 Titre de la liste */}
      <div className="categories-bt"> {/* 📦 Conteneur des catégories */}
        {categories.map(category => renderCategory(category))} {/* 🔄 Rendu de chaque catégorie */}
      </div>
    </div>
  );
};

export default CategoryList; // 🚀 Export du composant CategoryList
