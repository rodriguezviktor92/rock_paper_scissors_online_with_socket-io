/* eslint-disable react/prop-types */
import React from 'react';
import { Helmet } from 'react-helmet';
import previewImg from '../../assets/preview.png';

function HelmetImage() {
  return (
    <Helmet>
      <meta itemProp="image" content={previewImg} />
      <meta property="og:image" content={previewImg} />
      <meta name="twitter:image" content={previewImg} />
    </Helmet>
  );
}

export default HelmetImage;
