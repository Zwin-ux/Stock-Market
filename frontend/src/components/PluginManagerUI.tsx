import React, { useState, useEffect } from 'react';
import { pluginManager } from '../plugins';

type PluginConfig = {
  [pluginId: string]: {
    enabled: boolean;
    config: any;
  };
};

export default function PluginManagerUI() {
  const [plugins, setPlugins] = useState(pluginManager.getPlugins());
  const [config, setConfig] = useState<PluginConfig>({});
  
  useEffect(() => {
    // Load saved config
    const savedConfig = localStorage.getItem('pluginConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    // Initialize all plugins
    pluginManager.initializeAll();
  }, []);

  const togglePlugin = (pluginId: string) => {
    const newConfig = {
      ...config,
      [pluginId]: {
        ...config[pluginId],
        enabled: !(config[pluginId]?.enabled ?? true)
      }
    };
    setConfig(newConfig);
    localStorage.setItem('pluginConfig', JSON.stringify(newConfig));
  };

  return (
    <div className="plugin-manager">
      <h3>Plugin Manager</h3>
      <div className="plugin-list">
        {plugins.map(plugin => (
          <div key={plugin.id} className="plugin-item">
            <div className="plugin-header">
              <h4>{plugin.name}</h4>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={config[plugin.id]?.enabled ?? true}
                  onChange={() => togglePlugin(plugin.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <p className="plugin-desc">{plugin.description}</p>
            <div className="plugin-meta">
              <span>v{plugin.version}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
