/**
 * Module Admin Panel
 * Allows administrators to enable/disable modules and see their impact
 */

import React, { useState } from 'react';
import ModuleManager, { MODULES, CLUB_CONFIG, PRICING_PACKAGES } from '../config/modules';

export default function ModuleAdminPanel() {
  const [config, setConfig] = useState(CLUB_CONFIG);
  const [showPricing, setShowPricing] = useState(false);

  const toggleModule = (moduleId: string) => {
    const newConfig = { ...config };
    const isCurrentlyEnabled = newConfig.modules[moduleId];
    
    if (isCurrentlyEnabled) {
      // Try to disable
      const success = ModuleManager.disableModule(moduleId);
      if (success) {
        newConfig.modules[moduleId] = false;
        setConfig(newConfig);
      }
    } else {
      // Try to enable
      const success = ModuleManager.enableModule(moduleId);
      if (success) {
        newConfig.modules[moduleId] = true;
        setConfig(newConfig);
      }
    }
  };

  const getModuleStatus = (moduleId: string) => {
    if (moduleId === 'core-website') return 'required';
    return config.modules[moduleId] ? 'enabled' : 'disabled';
  };

  const getDependentModules = (moduleId: string) => {
    return Object.values(MODULES).filter(module =>
      module.dependencies.includes(moduleId) && config.modules[module.id]
    );
  };

  const calculateCurrentPrice = () => {
    return Object.entries(config.modules)
      .filter(([_, enabled]) => enabled)
      .reduce((total, [moduleId]) => total + (MODULES[moduleId]?.price || 0), 0);
  };

  const getRecommendedPackage = () => {
    const enabledModules = Object.entries(config.modules)
      .filter(([_, enabled]) => enabled)
      .map(([moduleId]) => moduleId);

    for (const [packageName, packageConfig] of Object.entries(PRICING_PACKAGES)) {
      const allModulesIncluded = packageConfig.modules.every(moduleId => 
        enabledModules.includes(moduleId)
      );
      if (allModulesIncluded && enabledModules.length <= packageConfig.modules.length + 1) {
        return { name: packageName, ...packageConfig };
      }
    }
    return null;
  };

  return (
    <div className="module-admin-panel max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Module Management</h1>
        <p className="text-gray-600">Configure which functional modules are active for your club</p>
      </div>

      {/* Current Configuration Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat">
            <div className="text-2xl font-bold text-primary">
              {Object.values(config.modules).filter(Boolean).length}
            </div>
            <div className="text-sm text-gray-600">Active Modules</div>
          </div>
          <div className="stat">
            <div className="text-2xl font-bold text-green-600">
              £{calculateCurrentPrice().toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="stat">
            <div className="text-2xl font-bold text-blue-600">
              {config.plan.charAt(0).toUpperCase() + config.plan.slice(1)}
            </div>
            <div className="text-sm text-gray-600">Current Plan</div>
          </div>
        </div>
      </div>

      {/* Module Categories */}
      <div className="space-y-8">
        {['essential', 'functional', 'premium'].map((category) => {
          const categoryModules = Object.values(MODULES).filter(module => 
            module.category === category
          );

          return (
            <div key={category} className="category-section">
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {category} Modules
                {category === 'essential' && (
                  <span className="ml-2 text-sm text-gray-500">(Required)</span>
                )}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryModules.map((module) => {
                  const status = getModuleStatus(module.id);
                  const dependentModules = getDependentModules(module.id);
                  
                  return (
                    <div 
                      key={module.id}
                      className={`
                        module-card bg-white rounded-lg border-2 p-6 transition-all
                        ${status === 'enabled' 
                          ? 'border-green-200 bg-green-50' 
                          : status === 'required'
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {/* Module Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{module.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`
                              px-2 py-1 rounded text-xs font-medium
                              ${status === 'enabled' 
                                ? 'bg-green-100 text-green-800'
                                : status === 'required'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                              }
                            `}>
                              {status === 'required' ? 'Required' : status}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              £{module.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Toggle Switch */}
                        {status !== 'required' && (
                          <button
                            onClick={() => toggleModule(module.id)}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${status === 'enabled' 
                                ? 'bg-green-600' 
                                : 'bg-gray-200'
                              }
                            `}
                            disabled={status === 'required'}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${status === 'enabled' ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        )}
                      </div>

                      {/* Module Description */}
                      <p className="text-gray-600 text-sm mb-4">{module.description}</p>

                      {/* Module Details */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium">Pages:</span>
                          <span className="text-gray-600 ml-1">
                            {module.pages.length} pages
                          </span>
                        </div>
                        
                        {module.dependencies.length > 0 && (
                          <div>
                            <span className="font-medium">Requires:</span>
                            <span className="text-gray-600 ml-1">
                              {module.dependencies.map(depId => MODULES[depId]?.name).join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {dependentModules.length > 0 && (
                          <div>
                            <span className="font-medium">Used by:</span>
                            <span className="text-gray-600 ml-1">
                              {dependentModules.map(mod => mod.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Comparison */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Package Comparison</h2>
          <button
            onClick={() => setShowPricing(!showPricing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPricing ? 'Hide' : 'Show'} Pricing Packages
          </button>
        </div>

        {showPricing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PRICING_PACKAGES).map(([packageName, packageConfig]) => {
              const isCurrentConfig = packageConfig.modules.every(moduleId => 
                config.modules[moduleId]
              );
              
              return (
                <div 
                  key={packageName}
                  className={`
                    package-card bg-white rounded-lg border-2 p-6
                    ${isCurrentConfig 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200'
                    }
                  `}
                >
                  <h3 className="font-semibold text-lg mb-2">{packageConfig.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-4">
                    £{packageConfig.price.toLocaleString()}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{packageConfig.description}</p>
                  
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Includes:</div>
                    {packageConfig.modules.map(moduleId => (
                      <div key={moduleId} className="flex items-center space-x-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>{MODULES[moduleId]?.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isCurrentConfig && (
                    <div className="mt-4 p-2 bg-primary/10 rounded text-sm text-primary font-medium text-center">
                      Current Configuration
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Package */}
      {(() => {
        const recommended = getRecommendedPackage();
        if (recommended) {
          return (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Recommended Package</h3>
              <p className="text-blue-800">
                Your current configuration matches the <strong>{recommended.name}</strong> 
                {' '}(£{recommended.price.toLocaleString()}). 
                Consider this package for the best value.
              </p>
            </div>
          );
        }
        return null;
      })()}

      {/* Save Configuration */}
      <div className="mt-8 flex justify-end space-x-4">
        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
          Export Configuration
        </button>
        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}