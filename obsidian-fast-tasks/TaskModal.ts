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

  private handlePriorityHotkey = (e: KeyboardEvent) => {
    const isInsideModal = this.modalEl.contains(document.activeElement);
    const isPriorityKey = e.ctrlKey && e.key.toLowerCase() === 'p';

    if (isInsideModal && isPriorityKey) {
      e.preventDefault();

      const priorities: TaskData['priority'][] = ['🔥 High', '⚠ Medium', '💤 Low'];
      const currentIndex = priorities.indexOf(this.priority);
      const nextPriority = priorities[(currentIndex + 1) % priorities.length];
      this.priority = nextPriority;

      const priorityInput = this.inputs.find(input => input.inputEl.disabled);
      priorityInput?.setValue?.(nextPriority);
    }
  };

  constructor(app: App, onSubmit: (task: TaskData) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'New Task' });

    let indexCounter = 0;

    // Description
    new Setting(contentEl)
      .setName('Description')
      .addText((text: TextComponent) => {
        const i = indexCounter++;
        this.inputs.push(text);
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, i));
        text.inputEl.focus();
        text.onChange(value => {
          this.description = value;
        });
      });

new Setting(contentEl)
  .setName('Priority')
  .setDesc('Press Ctrl + P or click to cycle')
  .addText(text => {
    const i = indexCounter++;
    text.setValue(this.priority);
    text.inputEl.readOnly = true;
    text.inputEl.style.cursor = 'pointer';

    // Make focusable and navigable
    this.inputs.push(text);
    text.inputEl.addEventListener('keydown', e => this.handleKey(e, i));

    // Allow click to cycle as well
    text.inputEl.addEventListener('click', () => {
      const priorities: TaskData['priority'][] = ['🔥 High', '⚠ Medium', '💤 Low'];
      const currentIndex = priorities.indexOf(this.priority);
      const nextPriority = priorities[(currentIndex + 1) % priorities.length];
      this.priority = nextPriority;
      text.setValue(nextPriority);
    });
  });

      
    document.addEventListener('keydown', this.handlePriorityHotkey);

    // Time
    new Setting(contentEl)
      .setName('Time (HH:MM)')
      .addText(text => {
        const i = indexCounter++;
        this.inputs.push(text);
        text.setPlaceholder('2230 → 22:30');
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, i));
        text.onChange(value => {
          this.time = this.formatTime(value);
        });
      });

    // Duration
    new Setting(contentEl)
      .setName('Estimated Duration')
      .addText(text => {
        const i = indexCounter++;
        this.inputs.push(text);
        text.setPlaceholder('20 → 20min');
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, i));
        text.onChange(value => {
          this.duration = this.formatDuration(value);
        });
      });

    // Tags
    new Setting(contentEl)
      .setName('Tags (comma-separated)')
      .addText(text => {
        const i = indexCounter++;
        this.inputs.push(text);
        text.inputEl.addEventListener('keydown', e => this.handleKey(e, i));
        text.setPlaceholder('#work, #deep').onChange(value => {
          this.tags = value
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
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

    if ((e.shiftKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'ArrowUp')) {
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
    document.removeEventListener('keydown', this.handlePriorityHotkey);
  }
}
