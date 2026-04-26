import React, { useState, useEffect } from 'react';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Incident Report - Theft',
        reportId: 'RPT-2024-001',
        date: '2024-01-15',
        status: 'Approved',
        type: 'incident',
        description: 'Detailed report of theft incident at downtown location',
        attachments: 3,
        officer: 'Officer Smith',
        comments: 'Report reviewed and approved'
      },
      {
        id: 2,
        title: 'Cyber Crime Analysis',
        reportId: 'RPT-2024-002',
        date: '2024-01-14',
        status: 'Pending',
        type: 'analysis',
        description: 'Preliminary analysis of cyber crime evidence',
        attachments: 5,
        officer: 'Detective Williams',
        comments: 'Awaiting forensic analysis'
      },
      {
        id: 3,
        title: 'Witness Statement Summary',
        reportId: 'RPT-2024-003',
        date: '2024-01-13',
        status: 'Approved',
        type: 'statement',
        description: 'Summary of witness testimonies',
        attachments: 2,
        officer: 'Officer Davis',
        comments: 'Approved for case file'
      }
    ];
    setReports(mockReports);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredReports = filterType === 'all' ? reports : reports.filter(r => r.type === filterType);

  return (
    <div className="my-reports">
      <div className="page-header">
        <h2>My Reports</h2>
        <p>Access and manage all your submitted reports</p>
        <button className="new-report-btn">+ Create New Report</button>
      </div>

      <div className="filters">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Reports</option>
          <option value="incident">Incident Reports</option>
          <option value="analysis">Analysis Reports</option>
          <option value="statement">Statements</option>
        </select>
      </div>

      <div className="reports-list">
        {filteredReports.map(report => (
          <div key={report.id} className="report-card" onClick={() => setSelectedReport(report)}>
            <div className="report-header">
              <div className="report-title">{report.title}</div>
              <div className="report-status" style={{ backgroundColor: getStatusColor(report.status) }}>
                {report.status}
              </div>
            </div>
            <div className="report-meta">
              <span>ID: {report.reportId}</span>
              <span>Date: {report.date}</span>
              <span>Type: {report.type}</span>
              <span>Attachments: {report.attachments}</span>
            </div>
            <p className="report-description">{report.description}</p>
            <div className="report-footer">
              <span>Officer: {report.officer}</span>
              <button className="view-btn">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedReport(null)}>×</button>
            <h3>{selectedReport.title}</h3>
            <div className="report-details">
              <div><strong>Report ID:</strong> {selectedReport.reportId}</div>
              <div><strong>Date:</strong> {selectedReport.date}</div>
              <div><strong>Status:</strong> <span style={{ color: getStatusColor(selectedReport.status) }}>{selectedReport.status}</span></div>
              <div><strong>Type:</strong> {selectedReport.type}</div>
              <div><strong>Officer:</strong> {selectedReport.officer}</div>
              <div><strong>Description:</strong> {selectedReport.description}</div>
              <div><strong>Comments:</strong> {selectedReport.comments}</div>
              <div><strong>Attachments:</strong> {selectedReport.attachments} files</div>
            </div>
            <div className="modal-actions">
              <button className="download-btn">Download Report</button>
              <button className="print-btn">Print</button>
              <button className="share-btn">Share</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .my-reports {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .page-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
        }

        .page-header p {
          margin: 5px 0 0 0;
          color: #666;
        }

        .new-report-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .filters {
          margin-bottom: 30px;
        }

        .filters select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .reports-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .report-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .report-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }

        .report-status {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
        }

        .report-meta {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .report-description {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .view-btn {
          padding: 6px 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .report-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
        }

        .modal-close {
          float: right;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .report-details {
          margin: 20px 0;
        }

        .report-details div {
          margin-bottom: 10px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .download-btn, .print-btn, .share-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .download-btn { background: #28a745; color: white; }
        .print-btn { background: #007bff; color: white; }
        .share-btn { background: #6c757d; color: white; }
      `}</style>
    </div>
  );
};

export default MyReports;
