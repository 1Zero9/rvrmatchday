/**
 * 🎛️ MODULE MANAGER SYSTEM
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Handles loading, enabling, and managing all modules
 * Central system for the modular architecture
 */

import { 
  ModuleConfig, 
  ModuleManager, 
  ModuleRegistry, 
  ValidationResult,
  ModuleNavigation,
  QuickAction,
  NavigationItem
} from '../types/module-types';

// =====================================
// 🏗️ MODULE MANAGER CLASS
// =====================================

class ModuleManagerImpl implements ModuleManager {
  private registry: ModuleRegistry;
  private loadedModules: Map<string, any> = new Map();
  private cache: Map<string, any> = new Map();

  constructor() {
    this.registry = {
      modules: {},
      enabled: [],
      settings: {}
    };
    this.loadRegistry();
  }

  // =====================================
  // 📋 MODULE REGISTRY METHODS
  // =====================================

  private async loadRegistry(): Promise<void> {
    try {
      // Load core configuration
      const core = await import('../core');
      this.registry.modules['core-website'] = core.CORE_CONFIG;
      
      // Load available modules
      const availableModules = [
        'match-management',
        'user-management', 
        'admin-tools',
        'analytics'
      ];

      for (const moduleName of availableModules) {
        try {
          const moduleConfig = await this.loadModuleConfig(moduleName);
          if (moduleConfig) {
            this.registry.modules[moduleName] = moduleConfig;
          }
        } catch (error) {
          console.warn(`Failed to load module ${moduleName}:`, error);
        }
      }

      // Load enabled modules from environment or config
      this.registry.enabled = this.loadEnabledModules();
      
    } catch (error) {
      console.error('Failed to load module registry:', error);
    }
  }

  private async loadModuleConfig(name: string): Promise<ModuleConfig | null> {
    try {
      const module = await import(`../modules/${name}`);
      return module.default || module[`${name.toUpperCase().replace('-', '_')}_CONFIG`];
    } catch (error) {
      return null;
    }
  }

  private loadEnabledModules(): string[] {
    // Load from environment variable, config file, or database
    const enabledFromEnv = process.env.ENABLED_MODULES?.split(',') || [];
    const defaultEnabled = ['core-website']; // Core is always enabled
    
    return [...new Set([...defaultEnabled, ...enabledFromEnv])];
  }

  // =====================================
  // 🔍 QUERY METHODS
  // =====================================

  getInstalledModules(): string[] {
    return Object.keys(this.registry.modules);
  }

  getAvailableModules(): string[] {
    return Object.keys(this.registry.modules);
  }

  getModuleConfig(name: string): ModuleConfig | null {
    return this.registry.modules[name] || null;
  }

  isModuleEnabled(name: string): boolean {
    return this.registry.enabled.includes(name);
  }

  getEnabledModules(): ModuleConfig[] {
    return this.registry.enabled
      .map(name => this.registry.modules[name])
      .filter(Boolean);
  }

  // =====================================
  // 🔧 MODULE OPERATIONS
  // =====================================

  async installModule(name: string): Promise<boolean> {
    try {
      const config = await this.loadModuleConfig(name);
      if (!config) {
        throw new Error(`Module ${name} not found`);
      }

      // Check dependencies
      if (!this.checkDependencies(name)) {
        throw new Error(`Dependencies not met for module ${name}`);
      }

      // Add to registry
      this.registry.modules[name] = config;
      
      // Run install hook
      if (config.hooks?.onInstall) {
        await this.runHook(config.hooks.onInstall, config);
      }

      return true;
    } catch (error) {
      console.error(`Failed to install module ${name}:`, error);
      return false;
    }
  }

  async uninstallModule(name: string): Promise<boolean> {
    try {
      const config = this.registry.modules[name];
      if (!config) {
        return true; // Already uninstalled
      }

      // Check if other modules depend on this one
      const dependents = this.findDependentModules(name);
      if (dependents.length > 0) {
        throw new Error(`Cannot uninstall ${name}: required by ${dependents.join(', ')}`);
      }

      // Disable first
      await this.disableModule(name);

      // Run uninstall hook
      if (config.hooks?.onUninstall) {
        await this.runHook(config.hooks.onUninstall, config);
      }

      // Remove from registry
      delete this.registry.modules[name];
      this.loadedModules.delete(name);
      this.cache.clear();

      return true;
    } catch (error) {
      console.error(`Failed to uninstall module ${name}:`, error);
      return false;
    }
  }

  async enableModule(name: string): Promise<boolean> {
    try {
      if (this.isModuleEnabled(name)) {
        return true; // Already enabled
      }

      if (!this.registry.modules[name]) {
        throw new Error(`Module ${name} not installed`);
      }

      if (!this.checkDependencies(name)) {
        throw new Error(`Dependencies not met for module ${name}`);
      }

      this.registry.enabled.push(name);
      this.cache.clear(); // Clear navigation cache
      
      return true;
    } catch (error) {
      console.error(`Failed to enable module ${name}:`, error);
      return false;
    }
  }

  async disableModule(name: string): Promise<boolean> {
    try {
      if (name === 'core-website') {
        throw new Error('Cannot disable core module');
      }

      const dependents = this.findDependentModules(name);
      if (dependents.length > 0) {
        throw new Error(`Cannot disable ${name}: required by ${dependents.join(', ')}`);
      }

      this.registry.enabled = this.registry.enabled.filter(m => m !== name);
      this.loadedModules.delete(name);
      this.cache.clear();
      
      return true;
    } catch (error) {
      console.error(`Failed to disable module ${name}:`, error);
      return false;
    }
  }

  // =====================================
  // 📦 MODULE LOADING
  // =====================================

  async loadModule(name: string): Promise<any> {
    if (this.loadedModules.has(name)) {
      return this.loadedModules.get(name);
    }

    if (!this.isModuleEnabled(name)) {
      throw new Error(`Module ${name} is not enabled`);
    }

    try {
      const module = await import(`../modules/${name}`);
      this.loadedModules.set(name, module);
      return module;
    } catch (error) {
      console.error(`Failed to load module ${name}:`, error);
      return null;
    }
  }

  // =====================================
  // 🔗 DEPENDENCY MANAGEMENT
  // =====================================

  checkDependencies(name: string): boolean {
    const config = this.registry.modules[name];
    if (!config) return false;

    // Check required dependencies
    for (const dep of config.dependencies) {
      if (!this.isModuleEnabled(dep)) {
        return false;
      }
    }

    return true;
  }

  private findDependentModules(name: string): string[] {
    const dependents: string[] = [];
    
    for (const [moduleName, config] of Object.entries(this.registry.modules)) {
      if (config.dependencies.includes(name) && this.isModuleEnabled(moduleName)) {
        dependents.push(moduleName);
      }
    }
    
    return dependents;
  }

  // =====================================
  // 🧩 NAVIGATION INTEGRATION
  // =====================================

  getModuleNavigation(): ModuleNavigation {
    const cacheKey = 'module-navigation';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const items: NavigationItem[] = [];
    const quickActions: QuickAction[] = [];
    const userActions: QuickAction[] = [];

    for (const moduleName of this.registry.enabled) {
      const config = this.registry.modules[moduleName];
      if (!config) continue;

      // Add navigation items
      items.push(...config.navigation);
      
      // Add quick actions
      if (config.quickActions) {
        quickActions.push(...config.quickActions);
      }
    }

    // Sort by priority
    items.sort((a, b) => a.priority - b.priority);

    const navigation = { items, quickActions, userActions };
    this.cache.set(cacheKey, navigation);
    
    return navigation;
  }

  getModulePages(): Record<string, any> {
    const pages: Record<string, any> = {};
    
    for (const moduleName of this.registry.enabled) {
      const config = this.registry.modules[moduleName];
      if (!config) continue;

      for (const page of config.pages) {
        pages[page.path] = {
          ...page,
          module: moduleName
        };
      }
    }
    
    return pages;
  }

  // =====================================
  // ✅ VALIDATION
  // =====================================

  validateModule(name: string): ValidationResult {
    const config = this.registry.modules[name];
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config) {
      errors.push(`Module ${name} not found`);
      return { isValid: false, errors, warnings, score: 0 };
    }

    // Check required fields
    if (!config.name) errors.push('Module name is required');
    if (!config.version) errors.push('Module version is required');
    if (!config.description) errors.push('Module description is required');

    // Check dependencies
    for (const dep of config.dependencies) {
      if (!this.registry.modules[dep]) {
        errors.push(`Dependency ${dep} not found`);
      }
    }

    // Check navigation items
    for (const nav of config.navigation) {
      if (!nav.href || !nav.label) {
        warnings.push('Navigation item missing href or label');
      }
    }

    // Check pages
    for (const page of config.pages) {
      if (!page.path || !page.name) {
        warnings.push('Page missing path or name');
      }
    }

    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score
    };
  }

  // =====================================
  // ⚙️ CONFIGURATION
  // =====================================

  async updateModuleConfig(name: string, updates: Partial<ModuleConfig>): Promise<boolean> {
    try {
      const config = this.registry.modules[name];
      if (!config) {
        throw new Error(`Module ${name} not found`);
      }

      // Merge updates
      this.registry.modules[name] = { ...config, ...updates };
      
      // Clear cache
      this.cache.clear();
      
      // Run config change hook
      if (config.hooks?.onConfigChange) {
        await this.runHook(config.hooks.onConfigChange, this.registry.modules[name]);
      }

      return true;
    } catch (error) {
      console.error(`Failed to update config for ${name}:`, error);
      return false;
    }
  }

  // =====================================
  // 🪝 HOOKS SYSTEM
  // =====================================

  private async runHook(hookName: string, config: ModuleConfig): Promise<void> {
    try {
      // In a real implementation, this would execute the named function
      console.log(`Running hook ${hookName} for module ${config.name}`);
      // await moduleHooks[hookName](config);
    } catch (error) {
      console.error(`Hook ${hookName} failed:`, error);
    }
  }

  // =====================================
  // 🔍 DEBUGGING & MONITORING
  // =====================================

  getSystemInfo() {
    return {
      totalModules: Object.keys(this.registry.modules).length,
      enabledModules: this.registry.enabled.length,
      loadedModules: this.loadedModules.size,
      cacheSize: this.cache.size,
      modules: Object.entries(this.registry.modules).map(([name, config]) => ({
        name,
        version: config.version,
        enabled: this.isModuleEnabled(name),
        loaded: this.loadedModules.has(name)
      }))
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  async refreshRegistry(): Promise<void> {
    this.cache.clear();
    this.loadedModules.clear();
    await this.loadRegistry();
  }
}

// =====================================
// 🌟 SINGLETON INSTANCE
// =====================================

const moduleManager = new ModuleManagerImpl();

// =====================================
// 🎯 CONVENIENCE FUNCTIONS
// =====================================

export const getModuleManager = (): ModuleManager => moduleManager;

export const isModuleEnabled = (name: string): boolean => 
  moduleManager.isModuleEnabled(name);

export const getEnabledModules = (): ModuleConfig[] => 
  moduleManager.getEnabledModules();

export const getModuleNavigation = (): ModuleNavigation => 
  moduleManager.getModuleNavigation();

export const getModulePages = (): Record<string, any> => 
  moduleManager.getModulePages();

export const loadModule = async (name: string): Promise<any> => 
  moduleManager.loadModule(name);

// =====================================
// 🧪 TESTING UTILITIES
// =====================================

export const __testing__ = {
  clearRegistry: () => {
    (moduleManager as any).registry = { modules: {}, enabled: [], settings: {} };
    (moduleManager as any).loadedModules.clear();
    (moduleManager as any).cache.clear();
  },
  
  addTestModule: (name: string, config: ModuleConfig) => {
    (moduleManager as any).registry.modules[name] = config;
  }
};

export default moduleManager;