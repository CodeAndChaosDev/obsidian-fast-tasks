import { App, ButtonComponent, TextComponent, TFile, Modal, Notice, MarkdownView } from 'obsidian';
import { TaskData } from './types';
import { SidebarView } from 'SidebarView';

export class TaskManager {
  private listeners: (() => void)[] = [];
 
  constructor(private app: App, private sidebar?: SidebarView) {}

  setSidebar(sidebar: SidebarView) {
    this.sidebar = sidebar;
  }
  private refreshSidebar() {
    this.sidebar?.refreshView?.();
  }

  async insertTask(task: TaskData) {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;

    const content = await this.app.vault.read(file);
    const newTask = `- [ ] ${task.priority} ${task.description} @${task.time ?? ''} (${task.duration ?? ''}) ${
      task.tags?.join(' ') ?? ''
    }\n`;

    const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) return;

    // Insert task at current cursor line
    const cursor = editor.getCursor();
    const before = content.split('\n').slice(0, cursor.line);
    const after = content.split('\n').slice(cursor.line);

    const newContent = [...before, newTask.trim(), ...after].join('\n');
    await this.app.vault.modify(file, newContent);
    this.refreshSidebar();
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
  const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
  if (!editor) return;

  const cursorLine = editor.getCursor().line;
  const currentTask = tasks.find(t => t.lineNumber === cursorLine);
  if (!currentTask || currentTask.lineNumber === undefined) return;

  const currentIndex = currentTask.lineNumber;
  const targetIndex = currentIndex + direction;

  if (targetIndex < 0 || targetIndex >= lines.length) return;

  // Swap lines
  const temp = lines[currentIndex];
  lines[currentIndex] = lines[targetIndex];
  lines[targetIndex] = temp;

  await this.app.vault.modify(file, lines.join('\n'));

  // Update cursor to follow the moved task
  editor.setCursor({ line: targetIndex, ch: 0 });
   this.refreshSidebar(); 
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
    const newLine = line.match(/@[\d:]+/)
      ? line.replace(/@[\d:]+/, `@${newTime}`)
      : line.replace(/(\(.*?\))/, `@${newTime} $1`);

    editor.setLine(cursor, newLine);

    // ✅ Force disk write, then re-read the file to trigger sidebar update
    await this.app.vault.modify(file, editor.getValue());

    // ✅ Now force sidebar to re-read from the updated file
    await this.refreshSidebar();

    new Notice(`Rescheduled to ${newTime}`);
  });

  modal.open();
}

async togglePriority() {
  const context = await this.getTasksFromActiveFile();
  if (!context) return;

  const { tasks, lines, file } = context;

  // Get the editor and current cursor line
  const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
  if (!editor) return;

  const cursorLine = editor.getCursor().line;

  // Find the task on the current line
  const task = tasks.find(t => t.lineNumber === cursorLine);
  if (!task) return;

  const nextPriority: TaskData['priority'] =
    task.priority === '🔥 High' ? '⚠ Medium' :
    task.priority === '⚠ Medium' ? '💤 Low' : '🔥 High';

  const line = lines[cursorLine];
  lines[cursorLine] = line.replace(/(🔥 High|⚠ Medium|💤 Low)/, nextPriority);

  await this.app.vault.modify(file, lines.join('\n'));
  this.refreshSidebar(); 
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