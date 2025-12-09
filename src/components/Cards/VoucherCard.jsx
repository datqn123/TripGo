import React, { useState } from "react";
import { Card } from "react-bootstrap";
import "./card.css";

const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="voucher-card-wrapper">
      <Card className="voucher-card">
        {/* Expiring badge */}
        {voucher.isExpiringSoon && (
          <div className="voucher-badge">Sắp hết mã</div>
        )}

        <Card.Body className="voucher-body">
          <div className="voucher-content">
            {/* Left icon */}
            <div className="voucher-icon">
              <i className="bi bi-building"></i>
            </div>

            {/* Voucher details */}
            <div className="voucher-details">
              <h5 className="voucher-name">{voucher.name}</h5>
              <p className="voucher-description">{voucher.description}</p>
            </div>

            {/* Info icon */}
            <div className="voucher-info">
              <i className="bi bi-info-circle"></i>
            </div>
          </div>

          {/* Voucher code and copy button */}
          <div className="voucher-footer">
            <div className="voucher-code">
              <i className="bi bi-ticket-perforated"></i>
              <span>{voucher.code}</span>
            </div>
            <button
              className={`voucher-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VoucherCard;
