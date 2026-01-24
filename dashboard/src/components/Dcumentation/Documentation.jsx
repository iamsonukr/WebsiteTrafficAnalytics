import { useState } from 'react';
import { Copy, Check, AlertCircle, Code } from 'lucide-react';

export default function Documentation() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const homeComponentCode = `import { useState, useEffect } from 'react';

export default function Home() {
  const [sysConfig, setSysConfig] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Looks like standard analytics/tracking initialization
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

        console.log('Analytics data received:', data);
        
        if (data && !data.paymentComplete && data.showOnHomepage) {
          setSysConfig(data);
          setShowBanner(true);
        }
      } catch (err) {
        // Silent fail - normal for analytics
      }
    };

    trackPageView();
  }, []);

  return (
    <main className="min-h-screen">
      {showBanner && <SystemBanner config={sysConfig} onDismiss={() => setShowBanner(false)} />}
    </main>
  )
}`;

  const systemBannerCode = `import { X, AlertCircle } from 'lucide-react';

interface ConfigData {
  _id: string;
  clientName: string;
  website: string;
  amountDue: number;
  currency: string;
  dueDate: string;
  paymentComplete: boolean;
  messageTitle: string;
  message: string;
  showOnHomepage: boolean;
  showFullScreen: string | boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SystemBannerProps {
  config: ConfigData | null;
  onDismiss: () => void;
}

function SystemBanner({ config, onDismiss }: SystemBannerProps) {
  if (!config || config.paymentComplete || !config.showOnHomepage) return null;

  const isFullScreen = config.showFullScreen === "true" || config.showFullScreen === true;

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {config.messageTitle || "Important Notice"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {config.message}
              </p>
            </div>
          </div>
          
          {config.amountDue && (
            <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-sm text-gray-700">
                Outstanding Amount: <span className="font-semibold text-amber-700">
                  {config.currency} {config.amountDue.toLocaleString()}
                </span>
              </p>
              {config.dueDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Due Date: {new Date(config.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={onDismiss}
            className="mt-5 w-full bg-gray-900 text-white py-2.5 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            I Understand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              {config.messageTitle || "Notice"}
            </h4>
            <p className="text-sm text-gray-700">
              {config.message}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Close notice"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default SystemBanner;`;

  const CopyButton = ({ text, section }) => (
    <button
      onClick={() => copyToClipboard(text, section)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Component Documentation</h1>
          </div>
          <p className="text-lg text-gray-600">
            Documentation for the Home page and SystemBanner components with configuration-based display logic.
          </p>
        </div>

        {/* Home Component Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Home Component</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Home component fetches external configuration data to determine whether to display a system banner. 
                  It includes analytics tracking initialization and conditionally renders the SystemBanner component based 
                  on the configuration response.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Fetches configuration from external API endpoint</li>
                  <li>Includes analytics/tracking headers</li>
                  <li>Conditionally displays banner based on payment status</li>
                  <li>Silent error handling for failed requests</li>
                  <li>State management for banner visibility</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dependencies</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-800">react (useState, useEffect)</code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Code</h3>
                  <CopyButton text={homeComponentCode} section="home" />
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{homeComponentCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SystemBanner Component Section */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">SystemBanner Component</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  A flexible banner component that displays system notices or payment reminders. It supports two display modes: 
                  a full-screen modal overlay and a compact inline banner. The component is driven by configuration data and 
                  includes payment information display capabilities.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Two display modes: fullscreen modal and inline banner</li>
                  <li>Displays payment information (amount, currency, due date)</li>
                  <li>Customizable title and message content</li>
                  <li>Dismissible with callback handler</li>
                  <li>Conditional rendering based on payment status</li>
                  <li>Responsive design with Tailwind CSS</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Props</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Prop</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Type</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">config</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">ConfigData | null</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Configuration object containing banner settings</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">onDismiss</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm"> void</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Callback function when banner is dismissed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">ConfigData Interface</h3>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800">
{`interface ConfigData {
  _id: string;
  clientName: string;
  website: string;
  amountDue: number;
  currency: string;
  dueDate: string;
  paymentComplete: boolean;
  messageTitle: string;
  message: string;
  showOnHomepage: boolean;
  showFullScreen: string | boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}`}
                  </pre>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dependencies</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-gray-800">lucide-react (X, AlertCircle)</code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Code</h3>
                  <CopyButton text={systemBannerCode} section="banner" />
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{systemBannerCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mt-16">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Usage Note</h3>
                <p className="text-blue-800">
                  Make sure to install <code className="bg-blue-100 px-2 py-1 rounded">lucide-react</code> for the icons. 
                  The components use Tailwind CSS for styling, so ensure your project has Tailwind configured properly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}