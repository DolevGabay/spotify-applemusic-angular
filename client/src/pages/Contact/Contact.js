import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [popupMessage, setPopupMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8888/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message to the user
        setPopupMessage('Email sent successfully');
        // Optionally, you can reset the form after successful submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        // Handle error, e.g., show an error message to the user
        setPopupMessage('Error sending email');
      }
    } catch (error) {
      console.error('Error sending email', error);
      setPopupMessage('Error sending email');
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
  };

  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={handlePopupClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Contact;
