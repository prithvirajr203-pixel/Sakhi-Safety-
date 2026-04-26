import React, { useState, useEffect } from 'react';

const AICrimePredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = () => {
    setTimeout(() => {
      setPredictions([
        { area: 'Downtown', crime: 'Theft', probability: 85, timeframe: 'Next 24h', confidence: 78 },
        { area: 'Suburb', crime: 'Burglary', probability: 62, timeframe: 'Next 48h', confidence: 71 },
        { area: 'Business District', crime: 'Fraud', probability: 73, timeframe: 'Next 12h', confidence: 82 },
        { area: 'Residential Area', crime: 'Vandalism', probability: 45, timeframe: 'Next 24h', confidence: 65 }
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="ai-crime-predictions">
      <div className="predictions-header">
        <h2>AI Crime Predictions</h2>
        <p>Predictive analytics for crime prevention</p>
      </div>

      {loading ? (
        <div className="loading">Analyzing crime patterns...</div>
      ) : (
        <div className="predictions-grid">
          {predictions.map((pred, i) => (
            <div key={i} className="prediction-card">
              <div className="prediction-area">{pred.area}</div>
              <div className="prediction-crime">{pred.crime}</div>
              <div className="prediction-probability">
                <div className="probability-bar">
                  <div className="probability-fill" style={{ width: `${pred.probability}%`, backgroundColor: pred.probability > 70 ? '#dc3545' : '#ffc107' }} />
                </div>
                <div className="probability-value">{pred.probability}% probability</div>
              </div>
              <div className="prediction-details">
                <div>Timeframe: {pred.timeframe}</div>
                <div>Confidence: {pred.confidence}%</div>
              </div>
              <div className="prediction-action">
                <button className="btn-alert">Increase Patrol</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .ai-crime-predictions { padding: 20px; background: #f8f9fa; min-height: 100vh; }
        .predictions-header { margin-bottom: 30px; }
        .predictions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .prediction-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .prediction-area { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .prediction-crime { color: #dc3545; font-weight: bold; margin-bottom: 15px; }
        .probability-bar { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; margin: 10px 0; }
        .probability-fill { height: 100%; transition: width 0.3s ease; }
        .prediction-details { margin: 15px 0; color: #666; font-size: 14px; }
        .btn-alert { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AICrimePredictions;
