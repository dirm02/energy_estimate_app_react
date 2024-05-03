import React from 'react';
import './GeneratorCard.css';

const HeightOptions = [
  {
    label: "10",
    value: 20,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "80",
    value: 80,
  },
  {
    label: "100",
    value: 100,
  },
];

function WindTurbineCard({ 
  hubHeight, bladeLength, airDensity, turbineEfficiency,
  handleSubmit, handleHubheightInputChange, handleBladelengthInputChange, handleAirdensityInputChange, handleEfficiencyInputChange
}) {
  return (
    <div className="generator-card">
      <div className="generator-main">
        <div className="generator-icon">
          <img src={`/generatorIcons/wind-turbine.png`} alt="Wind Turbine" />
        </div>
        <div className="temperature">Wind turbine parameters</div>
      </div>
      <div className="generator-details">        
          <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className="generator-detail-item">
                <p className='label'>Hub Height(m): </p>
                <select value={hubHeight} onChange={handleHubheightInputChange}>
                {HeightOptions.map((option, idx) => (
                  <option key={idx} value={option.value}>{option.label}</option>
                ))}
              </select>
              </div>
              <div className="generator-detail-item">
                <p className='label'>Blade Length(m): </p>
                <input type="text" id="radius" name="radius" placeholder="Enter the blade length" value={bladeLength} onChange={handleBladelengthInputChange} required />
              </div>
            </div>
            <div className='row'>
              <div className="generator-detail-item">
                <p className='label'>Air Density(kg/m^3): </p>
                <input type="text" id="air_density" name="air_density" placeholder="Enter the air density" value={airDensity} onChange={handleAirdensityInputChange} required />
              </div>
              <div className="generator-detail-item">
                <p className='label'>Generator Efficiency(%): </p>
                <input type="text" id="efficiency" name="efficiency" placeholder="Enter the generator efficiency"value={turbineEfficiency} onChange={handleEfficiencyInputChange} required />
              </div>
            </div>
            <div style={{display: 'inline-block'}}>
              <button className="btn-estimation" type="submit">Wind Energy Estimation from this wind turbine</button>
            </div>
          </form>
        {/* ... other details */}
      </div>
    </div>
  );
}

export default WindTurbineCard;