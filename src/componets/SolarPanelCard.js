import React from 'react';
import './GeneratorCard.css';


function SolarPanelCard({ 
  panelArea, panelEfficiency,
  handleSubmit, handlePanelAreaInputChange, handleEfficiencyInputChange
}) {
  return (
    <div className="generator-card">
      <div className="generator-main">
        <div className="generator-icon">
          <img src={`/generatorIcons/solar-panel.png`} alt="Solar Panel" />
        </div>
        <div className="temperature">Solar Panel parameters</div>
      </div>
      <div className="generator-details">
          <form onSubmit={handleSubmit}>        
            <div className='row'>
              <div className="generator-detail-item">
                <p className='label'>Panle Area(m^2): </p>
                <input type="text" id="panel_area" name="panel_area" placeholder="Enter the panel area" value={panelArea} onChange={handlePanelAreaInputChange} required />
              </div>
              <div className="generator-detail-item">
                <p className='label'>Panel Efficiency(%): </p>
                <input type="text" id="solar_eff" name="solar_eff" placeholder="Enter the panel efficiency"value={panelEfficiency} onChange={handleEfficiencyInputChange} required />
              </div>
            </div>
            <div style={{display: 'inline-block'}}>
              <button className="btn-estimation" type="submit">Solar Energy Estimation from this solar panel</button>
            </div>            
          </form>
        {/* ... other details */}
      </div>
    </div>
  );
}

export default SolarPanelCard;