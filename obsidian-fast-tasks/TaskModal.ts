import { App, Modal, Notice, Setting, TextComponent } from 'obsidian';
import { TaskData } from './types';

export class TaskModal extends Modal {
  private onSubmit: (task: TaskData) => void;

  private description = '';
  private priority: TaskData['priority'] = '⚠ Medium';
  private time = '';
  private duration = '';
  private tags: string[] = [];

  private inputs: TextComponent[] = [];

  constructor(app: App, onSubmit: (task: TaskData) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'New Task' });
    
    let inputIndex = 0;

    // Description
    const descInput = new Setting(contentEl)
      .setName('Description')
      .addText((text: TextComponent) => {
        this.inputs.push(text);
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, 0));
        text.inputEl.focus();
        text.onChange(value => {
          this.description = value;
        });
      });

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
      .addText(text => {
        this.inputs.push(text);
        text.setPlaceholder('2230 → 22:30');
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, 1));
        text.onChange(value => {
          this.time = this.formatTime(value);
        });
      });

    // Duration
    new Setting(contentEl)
      .setName('Estimated Duration')
      .addText(text => {
        this.inputs.push(text);
        text.setPlaceholder('20 → 20min');
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, 2));
        text.onChange(value => {
          this.duration = this.formatDuration(value);
        });
      });

    // Tags
    new Setting(contentEl)
      .setName('Tags (comma-separated)')
      .addText(text => {
        this.inputs.push(text);
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, 3));
        text.setPlaceholder('#work, #deep').onChange(value => {
          this.tags = value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        });
      });

    // Submit Button
    new Setting(contentEl)
      .addButton(btn =>
        btn
          .setButtonText('Add Task')
          .setCta()
          .onClick(() => {
            this.submitTask();
          }));
  }

  private formatTime(value: string): string {
    const raw = value.replace(/\D/g, '');
    if (raw.length === 4) return `${raw.slice(0, 2)}:${raw.slice(2)}`;
    if (raw.length === 3) return `0${raw[0]}:${raw.slice(1)}`;
    return value;
  }

  private formatDuration(value: string): string {
    const raw = value.replace(/\D/g, '');
    if (raw.length === 0) return '';
    if (raw.includes('h') || raw.includes('min')) return value;
    return `${raw}min`;
  }

  private handleKey(e: KeyboardEvent, index: number) {
  if (e.key === 'Enter' && index === this.inputs.length - 1) {
    e.preventDefault();
    this.submitTask();
    return;
  }

  if (e.key === 'Tab' || (e.ctrlKey && e.key === 'ArrowDown')) {
    e.preventDefault();
    const next = this.inputs[index + 1];
    next?.inputEl.focus();
  }

  if (e.shiftKey && e.key === 'Tab' || (e.ctrlKey && e.key === 'ArrowUp')) {
    e.preventDefault();
    const prev = this.inputs[index - 1];
    prev?.inputEl.focus();
  }
}

  private submitTask() {
    if (!this.description.trim()) {
      new Notice('Task description is required');
      return;
    }
    this.onSubmit({
      description: this.description,
      priority: this.priority,
      time: this.time,
      duration: this.duration,
      tags: this.tags
    });
    this.close();
  }

  onClose() {
    this.contentEl.empty();
  }
}
