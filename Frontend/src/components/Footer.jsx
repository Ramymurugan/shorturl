import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      padding: '24px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(11, 15, 25, 0.9)',
      color: '#6b7280',
      fontSize: '0.8125rem',
      width: '100%',
      marginTop: 'auto'
    }}>
      <p>&copy; {new Date().getFullYear()} SmartLink URL Shortener. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
