import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import treeviewData from '../data-bt/treeviewData.json';
import './CategoryList.css';

const CategoryList = ({ 
  title, 
  onCategoryChange, 
  maxProducts = Infinity, 
  readOnly = false, 
  categories: propCategories, 
  onShowModal 
}) => {
  const [categories, setCategories] = useState(() => {
    if (propCategories) return propCategories;
    
    const mapCategories = (items, parent = null, parentPath = []) => {
      if (!Array.isArray(items)) return [];
      
      return items.map(item => ({
        id: item.id,
        name: item.name,
        totalProducts: item.product_count || 0,
        selected: false,
        expanded: false,
        parent,
        parentPath: [...parentPath],
        subcategories: item.children 
          ? mapCategories(
              item.children, 
              item.name, 
              [...parentPath, { id: item.id, name: item.name, totalProducts: item.product_count || 0 }]
            ) 
          : []
      }));
    };

    return mapCategories(treeviewData.categories_tree);
  });

  useEffect(() => {
    if (propCategories) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  useEffect(() => {
    if (!readOnly && onCategoryChange) {
      const getVisibleCategories = (cats) => {
        const buildCategoryTree = (category) => {
          const state = getSelectionState(category);
          
          if (!state.selected && !state.indeterminate) {
            return null;
          }

          const result = {
            ...category,
            expanded: true,
            selected: state.selected,
            subcategories: []
          };

          if (category.subcategories?.length) {
            const visibleSubcategories = category.subcategories
              .map(buildCategoryTree)
              .filter(Boolean);

            if (visibleSubcategories.length > 0) {
              result.subcategories = visibleSubcategories;
            }
          }

          return result;
        };

        return cats.map(buildCategoryTree).filter(Boolean);
      };

      const visibleCategories = getVisibleCategories(categories);
      onCategoryChange(visibleCategories);
    }
  }, [categories, onCategoryChange, readOnly]);

  const calculateTotalSelected = (cats) => {
    return cats.reduce((total, category) => {
      if (!category) return total;
      
      if (!category.subcategories?.length && category.selected) {
        return total + category.totalProducts;
      }
      
      if (category.subcategories?.length > 0) {
        return total + calculateTotalSelected(category.subcategories);
      }
      
      return total;
    }, 0);
  };

  const getSelectionState = (category) => {
    if (!category.subcategories?.length) {
      return { selected: category.selected, indeterminate: false };
    }

    const childStates = category.subcategories.map(getSelectionState);
    const allSelected = childStates.every(state => state.selected);
    const anySelected = childStates.some(state => state.selected || state.indeterminate);
    
    return {
      selected: allSelected,
      indeterminate: !allSelected && anySelected
    };
  };

  const toggleCategory = (categoryPath) => {
    if (readOnly) return;

    setCategories(prevCategories => {
      const updateCategoryInTree = (categories, path) => {
        return categories.map(category => {
          if (path[0] === category.id) {
            if (path.length === 1) {
              const state = getSelectionState(category);
              const newSelected = !(state.selected || state.indeterminate);
              
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
                  selected: !category.selected
                };
              }

              return {
                ...category,
                selected: newSelected,
                expanded: category.expanded || newSelected,
                subcategories: updateSubcategories(category.subcategories)
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
        onShowModal?.();
        return prevCategories;
      }

      return updatedCategories;
    });
  };

  const toggleExpand = (categoryPath) => {
    setCategories(prevCategories => {
      const updateExpanded = (categories, path) => {
        return categories.map(category => {
          if (path[0] === category.id) {
            if (path.length === 1) {
              return { ...category, expanded: !category.expanded };
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

      return updateExpanded(prevCategories, categoryPath);
    });
  };

  const renderCategory = (category, path = []) => {
    if (!category) return null;

    const currentPath = [...path, category.id];
    const state = getSelectionState(category);

    return (
      <div key={`${category.id}-${path.length}`} className="category-group-bt">
        <CategoryItem
          name={category.name}
          totalProducts={category.totalProducts}
          selected={state.selected}
          isIndeterminate={state.indeterminate}
          hasSubcategories={category.subcategories?.length > 0}
          isExpanded={category.expanded}
          onToggle={() => toggleCategory(currentPath)}
          onExpand={() => toggleExpand(currentPath)}
          readOnly={readOnly}
          level={path.length}
        />
        
        {category.subcategories?.length > 0 && (readOnly || category.expanded) && (
          <div className="subcategories-bt">
            {category.subcategories.map(sub => 
              renderCategory(sub, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="category-list-bt">
      <h2>{title}</h2>
      <div className="categories-bt">
        {categories.map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default CategoryList;