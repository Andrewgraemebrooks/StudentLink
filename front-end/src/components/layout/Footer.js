import React from 'react';

const Footer = () => {
  return (
    <div className='bg-dark text-white footer-copyright text-center py-3'>
      Copyright © {new Date().getFullYear()} StudentLink
    </div>
  );
};

export default Footer;
