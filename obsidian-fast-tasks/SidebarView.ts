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

  const result = await this.manager.getTasksFromActiveFile();
  if (!result) {
    container.createEl('p', { text: 'No active file or tasks found.' });
    return;
  }

  for (const task of result.tasks) {
    const el = container.createEl('div', {
      text: `${task.priority} ${task.description} @${task.time ?? ''} (${task.duration ?? ''}) ${task.tags?.join(' ')}`,
    });
    el.classList.add('task-sidebar-item');
  }
}

  async onClose() {
    // Cleanup if needed
  }
}
