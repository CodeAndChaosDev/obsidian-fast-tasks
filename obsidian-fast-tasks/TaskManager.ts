import { App, ButtonComponent, TextComponent, TFile, Modal, Notice } from 'obsidian';
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
  async getTasksFromActiveFile(): Promise<{ tasks: TaskData[]; lines: string[]; file: TFile } | null> {
    const file = this.app.workspace.getActiveFile();
    if (!file) return null;

    const content = await this.app.vault.read(file);
    const lines = content.split('\n');

    const tasks: TaskData[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('- [ ]')) {
        const match = line.match(/- \[ \] (🔥 High|⚠ Medium|💤 Low)?\s?(.*?)\s?@(\d{1,2}:\d{2})?\s?\((.*?)\)?\s?(.*)?/);
        if (match) {
          const [, priority, description, time, duration, tags] = match;
          tasks.push({
            priority: (priority as TaskData['priority']) ?? '⚠ Medium',
            description: description.trim(),
            time: time ?? '',
            duration: duration ?? '',
            tags: tags ? tags.split(' ').filter(Boolean) : [],
            lineNumber: index,
          });
        }
      }
    });

    return { tasks, lines, file };
  }


  async moveTask(direction: number) {
  const context = await this.getTasksFromActiveFile();
  if (!context) return;

  const { tasks, lines, file } = context;

  // Find selected task: for now, move the first task as example
  const index = tasks[0]?.lineNumber;
  if (index === undefined) return;

  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= lines.length) return;

  // Swap lines
  const temp = lines[index];
  lines[index] = lines[newIndex];
  lines[newIndex] = temp;

  await this.app.vault.modify(file, lines.join('\n'));
}


   async rescheduleTask() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;

    const editor = this.app.workspace.activeEditor?.editor;
    if (!editor) return;

    const cursor = editor.getCursor().line;
    const line = editor.getLine(cursor);

    if (!line.match(/- \[ \]/)) {
      new Notice('Not a task line');
      return;
    }

    const modal = new TimeInputModal(this.app, async (newTime: string) => {
      const newLine = line.replace(/@[\d:]+/, `@${newTime}`);
      editor.setLine(cursor, newLine);
      new Notice(`Rescheduled to ${newTime}`);
    });

    modal.open();
  }

async togglePriority() {
  const context = await this.getTasksFromActiveFile();
  if (!context) return;

  const { tasks, lines, file } = context;
  const task = tasks[0]; // again, simple logic

  const nextPriority: TaskData['priority'] =
    task.priority === '🔥 High' ? '⚠ Medium' :
    task.priority === '⚠ Medium' ? '💤 Low' : '🔥 High';

  const line = lines[task.lineNumber!];
  lines[task.lineNumber!] = line.replace(/(🔥 High|⚠ Medium|💤 Low)/, nextPriority);

  await this.app.vault.modify(file, lines.join('\n'));
}
}


class TimeInputModal extends Modal {
  constructor(app: App, private onSubmit: (time: string) => void) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'New Time (HH:MM)' });

    const input = new TextComponent(contentEl);
    input.inputEl.style.width = '100%';
    input.setPlaceholder('14:30');

    new ButtonComponent(contentEl)
      .setButtonText('Save')
      .setCta()
      .onClick(() => {
        const time = input.getValue().trim();
        if (!time.match(/^\d{1,2}:\d{2}$/)) {
          new Notice('Invalid time format');
          return;
        }
        this.onSubmit(time);
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}