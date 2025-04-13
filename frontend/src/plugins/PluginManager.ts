import { Plugin, CommandHandler } from './PluginTypes';

export class PluginManager {
  private plugins: Plugin[] = [];
  private commands: CommandHandler[] = [];

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
    
    // Register commands if available
    if (plugin.registerCommands) {
      this.commands.push(...plugin.registerCommands());
    }
    
    console.log(`Registered plugin: ${plugin.name} v${plugin.version}`);
  }

  unregisterPlugin(pluginId: string) {
    this.plugins = this.plugins.filter(p => p.id !== pluginId);
  }

  getPlugins(): Plugin[] {
    return [...this.plugins];
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.find(p => p.id === pluginId);
  }

  getCommands(): CommandHandler[] {
    return [...this.commands];
  }

  async initializeAll(config: any = {}) {
    await Promise.all(
      this.plugins.map(plugin => plugin.initialize(config))
    );
  }
}

export const pluginManager = new PluginManager();
