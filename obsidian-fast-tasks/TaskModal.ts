import { App, Modal, Setting, TextComponent } from 'obsidian';
import { TaskData } from './types';

export class TaskModal extends Modal {
  private onSubmit: (task: TaskData) => void;

  private description = '';
  private priority: TaskData['priority'] = '⚠ Medium';
  private time = '';
  private duration = '';
  private tags: string[] = [];

  constructor(app: App, onSubmit: (task: TaskData) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'New Task' });

    // Description
    new Setting(contentEl)
      .setName('Description')
      .addText((text: TextComponent) =>
        text.onChange(value => {
          this.description = value;
        }));

    // Priority
    new Setting(contentEl)
      .setName('Priority')
      .addDropdown(dropdown =>
        dropdown
          .addOption('🔥 High', '🔥 High')
          .addOption('⚠ Medium', '⚠ Medium')
          .addOption('💤 Low', '💤 Low')
          .setValue(this.priority)
          .onChange(value => {
            this.priority = value as TaskData['priority'];
          }));

    // Time
    new Setting(contentEl)
      .setName('Time (HH:MM)')
      .addText(text =>
        text.setPlaceholder('14:30').onChange(value => {
          this.time = value;
        }));

    // Duration
    new Setting(contentEl)
      .setName('Estimated Duration')
      .addText(text =>
        text.setPlaceholder('30min').onChange(value => {
          this.duration = value;
        }));

    // Tags
    new Setting(contentEl)
      .setName('Tags (comma-separated)')
      .addText(text =>
        text.setPlaceholder('#work, #deep')
          .onChange(value => {
            this.tags = value
              .split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0);
          }));

    // Submit button
    new Setting(contentEl)
      .addButton(btn =>
        btn
          .setButtonText('Add Task')
          .setCta()
          .onClick(() => {
            this.onSubmit({
              description: this.description,
              priority: this.priority,
              time: this.time,
              duration: this.duration,
              tags: this.tags
            });
            this.close();
          }));
  }

  onClose() {
    this.contentEl.empty();
  }
}
