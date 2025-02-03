import React from 'react';
import { BsCheckCircleFill, BsCircle, BsChevronDown, BsChevronRight, BsDashCircleFill } from 'react-icons/bs';
import './CategoryItem.css';

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
  isIndeterminate = false
}) => {
  const renderCheckbox = () => {
    if (readOnly) return null;
    if (isIndeterminate) return <BsDashCircleFill className="icon-bt indeterminate-bt" />;
    return selected ? <BsCheckCircleFill className="icon-bt check-bt" /> : <BsCircle className="icon-bt" />;
  };

  const shouldShowProductCount = () => {
    if (!readOnly) return true;
    return selected && !hasSubcategories;
  };

  return (
    <div 
      className={`category-item-bt level-${level}-bt ${selected ? 'selected-bt' : ''} ${isIndeterminate ? 'indeterminate-bt' : ''} ${readOnly ? 'readonly-bt' : ''}`}
      onClick={(e) => {
        if (!readOnly) {
          e.stopPropagation();
          onToggle();
        }
      }}
    >
      <div className="category-content-bt">
        {hasSubcategories && (
          <button 
            className="expand-btn-bt" 
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            {isExpanded ? <BsChevronDown /> : <BsChevronRight />}
          </button>
        )}
        {!hasSubcategories && <div style={{ width: '28px' }} />}
        {renderCheckbox()}
        <span className="category-name-bt">{name}</span>
        {shouldShowProductCount() && totalProducts > 0 && (
          <span className="products-count-bt">{totalProducts} produits</span>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;