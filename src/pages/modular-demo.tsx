/**
 * Modular System Demo Page
 * Showcases the technical "Lego-like" architecture system
 * Demonstrates how functional components can be plugged in/out
 */

import React, { useState } from 'react';
import StandardLayout from '../components/StandardLayout';
import ModularNavigation, { ModuleStatusIndicator } from '../components/ModularNavigation';
import ModuleAdminPanel from '../components/ModuleAdminPanel';
import ModuleManager, { MODULES, CLUB_CONFIG, PRICING_PACKAGES } from '../config/modules';

export default function ModularDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'admin' | 'architecture'>('overview');

  const enabledModules = ModuleManager.getEnabledModules();
  const totalValue = ModuleManager.calculateTotalPrice();

  return (
    <StandardLayout
      title="Modular System Demo"
      description="Explore the Lego-like architecture that powers this platform"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                🧩 Modular System Demo
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Lego-like Architecture for Club Management
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold">{enabledModules.length}</div>
                  <div className="text-sm opacity-80">Active Modules</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold">£{totalValue.toLocaleString()}</div>
                  <div className="text-sm opacity-80">Total Value</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold">{CLUB_CONFIG.plan}</div>
                  <div className="text-sm opacity-80">Current Plan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex space-x-8">
              {[
                { id: 'overview', label: 'System Overview', icon: '🔍' },
                { id: 'admin', label: 'Module Admin', icon: '⚙️' },
                { id: 'architecture', label: 'Architecture', icon: '🏗️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* What is the Modular System */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4">🧩 What is the Modular System?</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6">
                    Our platform uses a revolutionary "Lego-like" architecture where functional 
                    components can be easily plugged in or removed. This allows clubs to purchase 
                    only the functionality they need, making it cost-effective and customizable.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">🏗️ How it Works</h3>
                      <ul className="text-blue-800 text-sm space-y-2">
                        <li>• Each feature is a self-contained module</li>
                        <li>• Modules can be enabled/disabled independently</li>
                        <li>• Dependencies are automatically managed</li>
                        <li>• Navigation adapts based on active modules</li>
                        <li>• Pricing is calculated per active module</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3">💰 Benefits</h3>
                      <ul className="text-green-800 text-sm space-y-2">
                        <li>• Pay only for features you use</li>
                        <li>• Easy upgrades and downgrades</li>
                        <li>• Faster site performance</li>
                        <li>• Reduced complexity for users</li>
                        <li>• White-label customization ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Active Modules */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">⚡ Currently Active Modules</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enabledModules.map((module) => (
                    <div 
                      key={module.id}
                      className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-green-900">{module.name}</h3>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mb-4">{module.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">{module.pages.length} pages</span>
                        <span className="font-semibold text-green-900">
                          £{module.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Packages */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">📦 Available Packages</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(PRICING_PACKAGES).map(([packageId, packageConfig]) => {
                    const isCurrentPlan = CLUB_CONFIG.plan === packageId;
                    
                    return (
                      <div 
                        key={packageId}
                        className={`
                          rounded-lg p-6 border-2 transition-all
                          ${isCurrentPlan 
                            ? 'border-primary bg-primary/5 ring-4 ring-primary/20' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        {isCurrentPlan && (
                          <div className="bg-primary text-white text-center text-sm font-medium py-2 rounded mb-4">
                            CURRENT PLAN
                          </div>
                        )}
                        
                        <h3 className="text-xl font-bold mb-2">{packageConfig.name}</h3>
                        <div className="text-3xl font-bold text-primary mb-4">
                          £{packageConfig.price.toLocaleString()}
                        </div>
                        <p className="text-gray-600 text-sm mb-6">{packageConfig.description}</p>
                        
                        <div className="space-y-2">
                          <div className="font-medium text-sm mb-3">Includes:</div>
                          {packageConfig.modules.map(moduleId => (
                            <div key={moduleId} className="flex items-center space-x-2 text-sm">
                              <span className="text-green-600">✓</span>
                              <span>{MODULES[moduleId]?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module Status Component */}
              <ModuleStatusIndicator />
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">⚙️ Module Administration</h2>
                <p className="text-gray-600">
                  Configure which modules are active for your club. Dependencies are automatically managed.
                </p>
              </div>
              <ModuleAdminPanel />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-8">
              {/* Architecture Overview */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">🏗️ System Architecture</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">📁 File Structure</h3>
                    <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                      <div>📂 src/</div>
                      <div>&nbsp;&nbsp;📂 config/</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;📄 modules.ts</div>
                      <div>&nbsp;&nbsp;📂 components/</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;📄 ModularNavigation.tsx</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;📄 ModuleAdminPanel.tsx</div>
                      <div>&nbsp;&nbsp;📂 pages/</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;📄 [module-pages].tsx</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">⚙️ Core Components</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <div className="font-medium text-blue-900">ModuleManager</div>
                        <div className="text-blue-700 text-sm">Central module control system</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                        <div className="font-medium text-green-900">ModularNavigation</div>
                        <div className="text-green-700 text-sm">Dynamic navigation based on modules</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <div className="font-medium text-purple-900">withModuleAccess</div>
                        <div className="text-purple-700 text-sm">Page protection HOC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module Dependencies */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">🔗 Module Dependencies</h2>
                <div className="space-y-6">
                  {Object.values(MODULES).map((module) => {
                    const dependsOn = module.dependencies;
                    const dependents = Object.values(MODULES).filter(m => 
                      m.dependencies.includes(module.id)
                    );
                    
                    return (
                      <div key={module.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{module.name}</h3>
                          <span className={`
                            px-3 py-1 rounded text-sm font-medium
                            ${ModuleManager.isModuleEnabled(module.id)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            {ModuleManager.isModuleEnabled(module.id) ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Depends On:</h4>
                            {dependsOn.length > 0 ? (
                              <div className="space-y-1">
                                {dependsOn.map(depId => (
                                  <div key={depId} className="flex items-center space-x-2 text-sm">
                                    <span className="text-blue-600">←</span>
                                    <span>{MODULES[depId]?.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">No dependencies</div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Required By:</h4>
                            {dependents.length > 0 ? (
                              <div className="space-y-1">
                                {dependents.map(dep => (
                                  <div key={dep.id} className="flex items-center space-x-2 text-sm">
                                    <span className="text-green-600">→</span>
                                    <span>{dep.name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">No dependents</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Implementation Guide */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">🔧 Implementation Guide</h2>
                <div className="prose max-w-none">
                  <h3>Adding a New Module</h3>
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm mb-4">
                    <div className="text-green-600">// 1. Define module in modules.ts</div>
                    <div>'new-feature': {'{'}</div>
                    <div>&nbsp;&nbsp;id: 'new-feature',</div>
                    <div>&nbsp;&nbsp;name: 'New Feature',</div>
                    <div>&nbsp;&nbsp;description: 'Description...',</div>
                    <div>&nbsp;&nbsp;enabled: false,</div>
                    <div>&nbsp;&nbsp;pages: ['/new-feature'],</div>
                    <div>&nbsp;&nbsp;price: 500,</div>
                    <div>&nbsp;&nbsp;category: 'functional',</div>
                    <div>&nbsp;&nbsp;dependencies: ['core-website']</div>
                    <div>{'}'}</div>
                  </div>
                  
                  <h3>Protecting a Page</h3>
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm mb-4">
                    <div className="text-green-600">// Wrap component with access control</div>
                    <div>export default withModuleAccess('module-id')(MyComponent);</div>
                  </div>
                  
                  <h3>Checking Module Status</h3>
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                    <div className="text-green-600">// Check if module is enabled</div>
                    <div>const isEnabled = ModuleManager.isModuleEnabled('module-id');</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StandardLayout>
  );
}