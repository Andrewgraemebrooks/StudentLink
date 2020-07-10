import React from 'react';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='bg-dark text-white footer-copyright text-center py-3'>
        <div className='container'>
          Copyright © {new Date().getFullYear()} StudentLink
        </div>
      </div>
    </div>
  );
};

export default Footer;
