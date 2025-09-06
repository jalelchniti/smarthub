import React from 'react';
import GoogleMapEmbed from './GoogleMapEmbed'; // Adjust the path as needed
import './GoogleMapEmbed.css'; // Import the CSS

const App: React.FC = () => {
  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.927527841475!2d10.17702587640448!3d36.79628796791918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3472cdcd2081%3A0x6e5339efe27057be!2s13%20Rue%20de%20Belgique%2C%20Tunis!5e0!3m2!1sfr!2stn!4v1756241843416!5m2!1sfr!2stn';

  return (
    <div>
      <GoogleMapEmbed
        mapSrc={mapSrc}
        title="Visit SmartHub in Tunis City Center"
        mapHeight="400px"
        ariaLabel="Map showing SmartHub at 13 Rue de Belgique, Tunis"
      />
    </div>
  );
};

export default App;