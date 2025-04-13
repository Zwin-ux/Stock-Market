import React from 'react';
import { Dialog, Tab } from '@headlessui/react';

export default function PluginManager({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="plugin-manager">
        <Tab.Group>
          <Tab.List>
            <Tab>Installed</Tab>
            <Tab>Marketplace</Tab>
            <Tab>Settings</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>{/* Plugin cards */}</Tab.Panel>
            <Tab.Panel>{/* Search + install */}</Tab.Panel>
            <Tab.Panel>{/* API keys etc */}</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Dialog>
  );
}
