import React, { useState, useCallback } from 'react';
import Header from './components-bt/Header';
import CategoryList from './components-bt/CategoryList';
import Modal from './components-bt/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function CatalogContentBis() {
  const [stats, setStats] = useState({
    total: 1010,
    selected: 0,
    margin: 23
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('warning');

  const calculateStats = useCallback((categories) => {
    let selectedCount = 0;

    const countSelectedProducts = (cats) => {
      cats.forEach(cat => {
        if (!cat.subcategories?.length && cat.selected) {
          selectedCount += cat.totalProducts;
        }
        else if (cat.selected && cat.totalProducts) {
          selectedCount += cat.totalProducts;
        }
        else if (cat.subcategories?.length > 0) {
          countSelectedProducts(cat.subcategories);
        }
      });
    };

    countSelectedProducts(categories);

    setStats(prev => ({
      ...prev,
      selected: selectedCount
    }));
    
    setSelectedCategories(categories);
  }, []);

  const handleStatUpdate = () => {
    if (stats.selected === 0) {
      setModalType('empty');
      setShowModal(true);
      return;
    }
    setModalType('success');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="app-container-bt">
      <div className="content-wrapper-bt">
        <Header stats={stats} />
        <div className="main-content-bt">
          <div className="row-bt">
            <div className="col-md-6-bt">
              <div className="treeview-container-bt">
                <CategoryList 
                  title="Catalogue" 
                  onCategoryChange={calculateStats}
                  maxProducts={500}
                  readOnly={false}
                  onShowModal={() => {
                    setModalType('warning');
                    setShowModal(true);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6-bt">
              <div className="treeview-container-bt">
                <CategoryList 
                  title="Votre Catalogue" 
                  categories={selectedCategories}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-buttons-bt">
          <button className="btn-bt btn-secondary-bt" onClick={() => window.history.back()}>
            Retour
          </button>
          <button className="btn-bt btn-primary-bt" onClick={handleStatUpdate}>
            Valider
          </button>
        </div>
      </div>
      <Modal 
        show={showModal} 
        onClose={handleCloseModal}
        type={modalType}
      />
    </div>
  );
}

export default CatalogContentBis;
