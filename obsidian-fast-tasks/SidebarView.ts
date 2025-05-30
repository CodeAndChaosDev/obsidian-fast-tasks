import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TaskManager } from './TaskManager';

export class SidebarView extends ItemView {
  constructor(leaf: WorkspaceLeaf, private manager: TaskManager) {
    super(leaf);
  }

  getViewType() {
    return 'taskmaster-sidebar';
  }

  getDisplayText() {
    return 'TaskMaster Sidebar';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h3', { text: 'Your Tasks' });

    // Later we will load and display tasks with filters
  }

  async onClose() {
    // Cleanup if needed
  }
}
