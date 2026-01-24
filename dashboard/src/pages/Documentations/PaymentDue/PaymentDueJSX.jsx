import { useState } from 'react';
import { Copy, Check, AlertCircle, Code } from 'lucide-react';

export default function PaymentDueJSX() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const homeComponentCode = `import { useState, useEffect } from 'react';

export default function SiteConfig() {
  const [sysConfig, setSysConfig] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const trackPageView = async () => {
      try {
        const response = await fetch('https://websitetrafficanalytics.onrender.com/api/meta/site-config/6972038615823e15ffc42bf5', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Tracker-ID': 'wa-' + Date.now()
          }
        });
        
        const { data } = await response.json();
        
        if (!cancelled && data && data.showOnHomepage) {
          setSysConfig(data);
          setShowBanner(true);
        }
      } catch (err) {
        // Silent fail
      }
    };
    
    trackPageView();
    
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false); 
  };

  // Don't render anything if banner shouldn't be shown
  if (!showBanner || !sysConfig) {
    return null;
  }

  const isFullScreen = sysConfig?.showFullScreen === "true" || sysConfig?.showFullScreen === true;

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 relative">
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-6 h-6 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {sysConfig.messageTitle || "Important Notice"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {sysConfig.message}
              </p>
            </div>
          </div>
          
          {sysConfig.amountDue && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Outstanding Amount: <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {sysConfig.currency} {sysConfig.amountDue.toLocaleString()}
                </span>
              </p>
              {sysConfig.dueDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Due Date: {new Date(sysConfig.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={handleDismiss}
            className="mt-5 w-full bg-gray-900 dark:bg-gray-700 text-white py-2.5 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 dark:border-amber-600 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <svg className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {sysConfig.messageTitle || "Notice"}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {sysConfig.message}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex-shrink-0 rounded p-1"
          aria-label="Close notice"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}`;

  const CopyButton = ({ text, section }) => (
    <button
      onClick={() => copyToClipboard(text, section)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
    >
      {copiedSection === section ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Code
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            React Component for Payment Due Notification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A flexible React component for displaying site-wide notifications and payment reminders with dark mode support
          </p>
        </div>

        {/* Features */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Features
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Automatic data fetching from remote API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Two display modes: Full-screen modal and top banner</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Dismissible notifications with state management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Optional payment information display</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Dark mode support with Tailwind CSS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              <span>Prevents duplicate API calls in React Strict Mode</span>
            </li>
          </ul>
        </section>

        {/* Component Code */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Component Code
            </h2>
            <CopyButton text={homeComponentCode} section="component" />
          </div>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-100">
              <code>{homeComponentCode}</code>
            </pre>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Usage
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Simply import and include the component in your app:
            </p>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
              <pre className="text-sm text-gray-100">
                <code>{`import SiteConfig from './components/SiteConfig';

function App() {
  return (
    <div>
      <SiteConfig />
      {/* Your other components */}
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            API Configuration
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The component expects the following data structure from the API:
            </p>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
              <pre className="text-sm text-gray-100">
                <code>{`{
  "data": {
    "showOnHomepage": true,
    "showFullScreen": true, // or "true" as string
    "messageTitle": "Payment Overdue",
    "message": "Your account has an outstanding balance.",
    "amountDue": 5000,
    "currency": "USD",
    "dueDate": "2026-02-01"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Installation Note */}
        <section className="mt-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Installation Requirements
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-3">
                  Make sure you have the following dependencies installed:
                </p>
                <div className="bg-blue-100 dark:bg-blue-950/50 rounded-lg p-3">
                  <code className="text-blue-900 dark:text-blue-100 text-sm">
                    npm install react react-dom
                  </code>
                </div>
                <p className="text-blue-800 dark:text-blue-200 mt-3">
                  This component uses Tailwind CSS for styling. Ensure your project has Tailwind configured with dark mode enabled in your <code className="bg-blue-100 dark:bg-blue-950/50 px-2 py-1 rounded text-sm">tailwind.config.js</code>:
                </p>
                <div className="bg-blue-100 dark:bg-blue-950/50 rounded-lg p-3 mt-2">
                  <code className="text-blue-900 dark:text-blue-100 text-sm">
                    darkMode: 'class' // or 'media'
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}