import { Plugin } from 'obsidian';
import { TaskModal } from './TaskModal';
import { TaskManager } from './TaskManager';
import { SidebarView } from './SidebarView';

export default class TaskPlugin extends Plugin {
  async onload() {
    const manager = new TaskManager(this.app);

    // 🧠 Modal Trigger
    this.addCommand({
      id: 'open-task-modal',
      name: 'Create New Task',
      callback: () => new TaskModal(this.app, task => manager.insertTask(task)).open(),
      hotkeys: [{ modifiers: ['Mod'], key: 'T' }],
    });

    // 🔼 Move Task Up
    this.addCommand({
      id: 'move-task-up',
      name: 'Move Task Up',
      hotkeys: [{ modifiers: ['Mod'], key: 'ArrowUp' }],
      callback: () => manager.moveTask(-1),
    });

    // 🔽 Move Task Down
    this.addCommand({
      id: 'move-task-down',
      name: 'Move Task Down',
      hotkeys: [{ modifiers: ['Mod'], key: 'ArrowDown' }],
      callback: () => manager.moveTask(1),
    });

    // 🕒 Reschedule Task
    this.addCommand({
      id: 'reschedule-task',
      name: 'Reschedule Task',
      hotkeys: [{ modifiers: ['Mod'], key: 'R' }],
      callback: () => manager.rescheduleTask(),
    });

    // ⚡ Change Priority
    this.addCommand({
      id: 'toggle-priority',
      name: 'Toggle Task Priority',
      hotkeys: [{ modifiers: ['Mod'], key: 'P' }],
      callback: () => manager.togglePriority(),
    });

    // 📚 Sidebar View
    this.registerView('taskmaster-sidebar', leaf => new SidebarView(leaf, manager));
    this.addRibbonIcon('check-circle', 'Open Task Sidebar', () => {
      const rightLeaf = this.app.workspace.getRightLeaf(false);
      if (rightLeaf) {
        rightLeaf.setViewState({
          type: 'taskmaster-sidebar',
          active: true
        });
      }
    });
  }
}
