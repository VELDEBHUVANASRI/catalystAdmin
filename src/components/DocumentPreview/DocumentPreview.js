import React, { useEffect, useState } from 'react';
import { FiX, FiDownload, FiLoader } from 'react-icons/fi';
import { buildDataUrl } from '../../lib/vendorDocs';
import './DocumentPreview.css';

const DocumentPreview = ({ document, title, onClose, onDownload }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!document) {
      setError('No document provided');
      setLoading(false);
      return;
    }

    const url = buildDataUrl(document);
    if (!url) {
      setError('Invalid document format');
      setLoading(false);
      return;
    }

    setUrl(url);
    setLoading(false);
  }, [document]);

  const handlePreviewLoad = () => {
    setLoading(false);
  };

  const handlePreviewError = () => {
    setError('Failed to load document preview');
    setLoading(false);
  };

  const isImage = url?.match(/^data:image\/|^https?:.*\.(png|jpe?g|gif|webp|avif)$/i);
  const isPDF = url?.match(/^data:application\/pdf|^https?:.*\.pdf$/i);

  return (
    <div className="document-preview-overlay" onClick={onClose}>
      <div className="document-preview-container" onClick={e => e.stopPropagation()}>
        <div className="document-preview-header">
          <h3 className="document-preview-title">{title}</h3>
          <button className="document-preview-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="document-preview-content">
          {loading && (
            <div className="document-preview-loading">
              <FiLoader size={24} className="document-preview-loading-spinner" />
              <span>Loading document preview...</span>
            </div>
          )}

          {error && (
            <div className="document-preview-error">
              {error}
            </div>
          )}

          {!loading && !error && url && (
            <>
              {isImage && (
                <img 
                  src={url}
                  alt={title}
                  onLoad={handlePreviewLoad}
                  onError={handlePreviewError}
                />
              )}
              {isPDF && (
                <iframe
                  src={url}
                  title={title}
                  onLoad={handlePreviewLoad}
                  onError={handlePreviewError}
                />
              )}
              {!isImage && !isPDF && (
                <div className="document-preview-error">
                  Preview not available for this file type
                </div>
              )}
            </>
          )}
        </div>

        <div className="document-preview-actions">
          <button 
            className="document-preview-button secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="document-preview-button primary"
            onClick={onDownload}
            disabled={!url}
          >
            <FiDownload size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;