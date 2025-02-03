import React from 'react';
import treeviewData from '../data-bt/treeviewData.json';
import './Header.css';

const Header = ({ stats }) => {
  return (
    <div className="dashboard-header-bt">
      <div className="pack-info-bt">
        Votre Pack Découverte : 500 produits à choisir
      </div>
      <div className="stats-container-bt">
        <div className="stat-card-bt">
          <h6>Total produits</h6>
          <div className="stat-content-bt">
            <span className="value-bt">{treeviewData.total_count.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="stat-card-bt">
          <h6>Total de produits sélectionnés</h6>
          <div className="stat-content-bt">
            <span className="label-bt">Sélectionnés</span>
            <span className="value-bt accent-bt">{stats.selected.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="stat-card-bt accent-bg-bt">
          <h6>Marge globale</h6>
          <div className="stat-content-bt">
            <span className="label-bt">Par défaut</span>
            <span className="value-bt">{stats.margin} %</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;