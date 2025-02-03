import React, { useState, useCallback } from 'react';
import Header from './components-bt/Header';
import CategoryList from './components-bt/CategoryList';
import Modal from './components-bt/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // 📦 Import de Bootstrap
import './App.css'; // 🎨 Styles personnalisés

// 🛠 Fonction principale de l'app
function App() {
  // 💾 State des stats
  const [stats, setStats] = useState({
    total: 1010, // 📊 Total des produits
    selected: 0, // ✅ Produits sélectionnés
    margin: 23 // 💡 Marges ou autres stats (non utilisé ici)
  });

  // 📂 State des catégories sélectionnées
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 🕹️ State pour afficher ou non la modale
  const [showModal, setShowModal] = useState(false);

  // 🎯 Type de la modale (avertissement, succès, etc.)
  const [modalType, setModalType] = useState('warning');

  // 📈 Fonction pour calculer les stats à partir des catégories sélectionnées
  const calculateStats = useCallback((categories) => {
    let selectedCount = 0; // 🔢 Compteur des produits sélectionnés

    // 🔄 Fonction récursive pour compter les produits dans les sous-catégories
    const countSelectedProducts = (cats) => {
      cats.forEach(cat => {
        if (!cat.subcategories?.length && cat.selected) {
          selectedCount += cat.totalProducts; // ➕ Ajout des produits sélectionnés
        }
        else if (cat.selected && cat.totalProducts) {
          selectedCount += cat.totalProducts; // ➕ Ajout des produits
        }
        else if (cat.subcategories?.length > 0) {
          countSelectedProducts(cat.subcategories); // 🔁 Recurse dans les sous-catégories
        }
      });
    };

    countSelectedProducts(categories); // 💼 Calcul des produits sélectionnés

    setStats(prev => ({
      ...prev,
      selected: selectedCount // 📈 Mise à jour des stats
    }));
    
    setSelectedCategories(categories); // 📂 Mise à jour des catégories sélectionnées
  }, []); // 📌 useCallback pour ne pas redéfinir la fonction à chaque rendu

  // 🚨 Gestion de la modale au clic sur "Valider"
  const handleStatUpdate = () => {
    if (stats.selected === 0) {
      setModalType('empty'); // 😅 Pas de produits sélectionnés
      setShowModal(true); // 🖼️ Affichage de la modale
      return;
    }
    setModalType('success'); // 🎉 Produits validés
    setShowModal(true); // 🖼️ Affichage de la modale
  };

  // 🚪 Fermeture de la modale
  const handleCloseModal = () => {
    setShowModal(false); // 👋 Cache la modale
  };

  return (
    <div className="app-container-bt">
      {/* 🏠 Conteneur principal */}
      <div className="content-wrapper-bt">
        <Header stats={stats} /> {/* 👑 Header avec les stats */}
        <div className="main-content-bt">
          <div className="row-bt">
            {/* 🏷️ Première colonne avec le catalogue */}
            <div className="col-md-6-bt">
              <div className="treeview-container-bt">
                <CategoryList 
                  title="Catalogue" 
                  onCategoryChange={calculateStats} // 📝 Changement de catégorie
                  maxProducts={500} // 📦 Max produits affichés
                  readOnly={false} // ✏️ Liste modifiable
                  onShowModal={() => {
                    setModalType('warning'); // ⚠️ Avertissement si erreur
                    setShowModal(true); // 🖼️ Affichage de la modale
                  }}
                />
              </div>
            </div>
            {/* 📑 Deuxième colonne avec les catégories sélectionnées */}
            <div className="col-md-6-bt">
              <div className="treeview-container-bt">
                <CategoryList 
                  title="Votre Catalogue" 
                  categories={selectedCategories} // 📂 Catégories sélectionnées
                  readOnly={true} // 👁️ Liste en lecture seule
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-buttons-bt">
          {/* ⬅️ Bouton "Retour" (commenté) */}
          {/* <button className="btn-bt btn-secondary-bt" onClick={() => window.history.back()}>
            Retour
          </button> */}
          {/* ✅ Bouton "Valider" */}
          <button className="btn-bt btn-primary-bt" onClick={handleStatUpdate}>
            Valider
          </button>
        </div>
      </div>
      {/* 🖼️ Modale affichée selon l'état */}
      <Modal 
        show={showModal} // 🖼️ Si la modale est affichée
        onClose={handleCloseModal} // ❌ Fonction pour fermer la modale
        type={modalType} // 🎯 Type de la modale (avertissement, succès, etc.)
      />
    </div>
  );
}

export default App;
