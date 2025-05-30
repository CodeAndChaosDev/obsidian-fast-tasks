import { App, TFile } from 'obsidian';
import { TaskData } from './types';

export class TaskManager {
  constructor(private app: App) {}

  async insertTask(task: TaskData) {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;

    const content = await this.app.vault.read(file);
    const newTask = `- [ ] ${task.priority} ${task.description} @${task.time ?? ''} (${task.duration ?? ''}) ${
      task.tags?.join(' ') ?? ''
    }\n`;

    await this.app.vault.modify(file, content + '\n' + newTask);
  }

  async moveTask(direction: number) {
    // Logic to move a task up or down by changing line order
  }

  async rescheduleTask() {
    // Prompt user and update time field on selected task line
  }

  async togglePriority() {
    // Cycle through priorities for selected task
  }
}