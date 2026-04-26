import React, { useState, useEffect } from 'react';
import { useSakshiEyeStore } from '../../store/sakshieyestore';
import { SakshiEyeLiveWitness } from '../../components/sakshieye/SakshiEyeComponents';
import { ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const AIThreatDetections = () => {
  const { threatLevel, capturedFaces, autoRecordings, isMonitoring } = useSakshiEyeStore();
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, investigating: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = {
        id: Date.now(),
        type: ['Malware', 'Phishing', 'Ransomware', 'Spyware'][Math.floor(Math.random() * 4)],
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        source: Math.random() > 0.5 ? 'Email' : 'Website',
        timestamp: new Date(),
        status: 'Detected'
      };
      setDetections(prev => [newThreat, ...prev].slice(0, 10));
      setStats({
        total: detections.length + 1,
        blocked: detections.filter(d => d.status === 'Blocked').length,
        investigating: detections.filter(d => d.status === 'Investigating').length
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [detections]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ChartBarIcon className="w-8 h-8 text-purple-600" />
          AI Threat Detection System
        </h1>
        <p className="text-gray-600 mt-2">Real-time threat monitoring and automated response</p>
      </div>

      {/* SAKHI EYE Live Witness */}
      <SakshiEyeLiveWitness
        threatLevel={threatLevel}
        facesCount={capturedFaces.length}
        recordingsCount={autoRecordings.length}
        isMonitoring={isMonitoring}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
          <p className="text-4xl font-black text-purple-600">{stats.total}</p>
          <p className="text-gray-600 font-semibold mt-2">Total Threats</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
          <p className="text-4xl font-black text-green-600">{stats.blocked}</p>
          <p className="text-gray-600 font-semibold mt-2">Blocked</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-center">
          <p className="text-4xl font-black text-orange-600">{stats.investigating}</p>
          <p className="text-gray-600 font-semibold mt-2">Investigating</p>
        </div>
      </div>

      {/* Detections List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Detected Threats</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {detections.length > 0 ? (
            detections.map(threat => (
              <div key={threat.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-start gap-4 flex-1">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800">{threat.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{threat.source}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white`}
                    style={{ backgroundColor: getSeverityColor(threat.severity) }}>
                    {threat.severity}
                  </span>
                  <p className="text-xs text-gray-500">{threat.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No threats detected - Your system is safe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIThreatDetections;
