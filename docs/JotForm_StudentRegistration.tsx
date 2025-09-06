
// JotForm Student Registration Component
// Copy this code to create a JotForm registration component in your React app

import { useEffect } from 'react';

const StudentRegistrationForm = () => {
  useEffect(() => {
    // Load JotForm embed handler
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.onload = () => {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler("iframe[id='JotFormIFrame-252484973344567']", "https://form.jotform.com/");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full">
      <iframe
        id="JotFormIFrame-252484973344567"
        title="Inscription Etudiant"
        onLoad={() => window.parent.scrollTo(0,0)}
        allowTransparency="true"
        allow="geolocation; microphone; camera; fullscreen; payment"
        src="https://form.jotform.com/252484973344567"
        frameBorder="0"
        style={{
          minWidth: '100%',
          maxWidth: '100%',
          height: '539px',
          border: 'none'
        }}
        scrolling="no"
      />
    </div>
  );
};

export default StudentRegistrationForm;

/* 
Usage in your React app:
import StudentRegistrationForm from './components/StudentRegistrationForm';

<StudentRegistrationForm />
*/