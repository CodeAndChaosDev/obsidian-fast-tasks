import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TaskManager } from './TaskManager';
import { TaskData } from './types';

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
    await this.renderTasks('Your Tasks');
  }

  async onClose() {}

  async refreshView() {
    await this.renderTasks('Your Tasks (Auto-updated)');
  }

  private async renderTasks(header: string) {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h3', { text: header });

    const result = await this.manager.getTasksFromActiveFile();
    if (!result || result.tasks.length === 0) {
      container.createEl('p', { text: 'No active file or tasks found.' });
      return;
    }

    const groupedByTag = this.groupTasksByFirstTag(result.tasks);

    for (const [tag, tasks] of groupedByTag.entries()) {
      const tagHeader = container.createEl('h4', { text: tag });
      tagHeader.classList.add('task-tag-header');

      for (const task of tasks) {
        const el = container.createEl('div', {
          text: `${task.priority} ${task.description} @${task.time ?? ''} (${task.duration ?? ''}) ${task.tags?.join(' ')}`,
        });
        el.classList.add('task-sidebar-item');
      }
    }
  }

  private groupTasksByFirstTag(tasks: TaskData[]): Map<string, TaskData[]> {
    const grouped = new Map<string, TaskData[]>();

    for (const task of tasks) {
      const tag = task.tags?.[0] ?? '(No Tag)';
      if (!grouped.has(tag)) {
        grouped.set(tag, []);
      }
      grouped.get(tag)!.push(task);
    }

    return grouped;
  }
}
