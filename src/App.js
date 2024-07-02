import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [additionalFreight, setAdditionalFreight] = useState('');
  const [outputLink, setOutputLink] = useState('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFreightChange = (e) => {
    setAdditionalFreight(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !additionalFreight) {
      alert('Please select a file and enter additional freight.');
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('additionalFreight', additionalFreight);

    try {
      const response = await axios.post('https://invoice-generator-backend-uock.onrender.com/uploads', formData, {
        responseType: 'json'
      });

      setOutputLink(response.data.outputFile);
      setInvoiceLink(response.data.invoiceFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Additional Freight or Discount"
          value={additionalFreight}
          onChange={handleFreightChange}
        />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
      {outputLink && (
        <div>
          <a href={outputLink} download>
            <button className="download-button">Download Output File</button>
          </a>
        </div>
      )}
      {invoiceLink && (
        <div>
          <a href={invoiceLink} download>
            <button className="download-button">Download Invoice File</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
