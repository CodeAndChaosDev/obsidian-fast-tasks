import { Plugin } from 'obsidian';
import { TaskModal } from './TaskModal';
import { TaskManager } from './TaskManager';
import { SidebarView } from './SidebarView';

export default class TaskPlugin extends Plugin {
  private manager: TaskManager;
  private sidebar: SidebarView | null = null;

  async onload() {
    this.manager = new TaskManager(this.app);
    const anyApp = this.app as any;
    if (!anyApp.viewRegistry?.views?.['taskmaster-sidebar']) {
  this.registerView('taskmaster-sidebar', (leaf) => {
        const view = new SidebarView(leaf, this.manager);
        this.sidebar = view;
        this.manager.setSidebar(view); // <- inject it here
        return view;
      });    }


    // ✅ Register Sidebar View
   

    
    // ✅ Ribbon Icon to open Sidebar
    this.addRibbonIcon('check-circle', 'Open Task Sidebar', () => {
      this.activateView();
      
    });

    // ✅ Modal: Create New Task
    this.addCommand({
      id: 'open-task-modal',
      name: 'Create New Task',
      hotkeys: [{ modifiers: ['Mod'], key: 'q' }], // Ctrl+Q or Cmd+Q
      callback: () => new TaskModal(this.app, task => this.manager.insertTask(task)).open(),
    });

    // 🔼 Move Task Up
    this.addCommand({
      id: 'move-task-up',
      name: 'Move Task Up',
      hotkeys: [{ modifiers: ['Mod'], key: 'ArrowUp' }],
      callback: () => this.manager.moveTask(-1),
    });

    // 🔽 Move Task Down
    this.addCommand({
      id: 'move-task-down',
      name: 'Move Task Down',
      hotkeys: [{ modifiers: ['Mod'], key: 'ArrowDown' }],
      callback: () => this.manager.moveTask(1),
    });

    // 🕒 Reschedule Task
    this.addCommand({
      id: 'reschedule-task',
      name: 'Reschedule Task',
      hotkeys: [{ modifiers: ['Mod'], key: 'r' }],
      callback: () => this.manager.rescheduleTask(),
    });

    // ⚡ Toggle Priority
    this.addCommand({
      id: 'toggle-priority',
      name: 'Toggle Task Priority',
      hotkeys: [{ modifiers: ['Mod'], key: 'p' }],
      callback: () => this.manager.togglePriority(),
    });
    

  }

  async activateView() {
    const rightLeaf = this.app.workspace.getRightLeaf(false);
    if (rightLeaf) {
      await rightLeaf.setViewState({
        type: 'taskmaster-sidebar',
        active: true,
      });
      this.app.workspace.revealLeaf(rightLeaf);
    }
  }

  onunload() {
    this.app.workspace.detachLeavesOfType('taskmaster-sidebar');
    const anyApp = this.app as any;
      if (anyApp.viewRegistry?.views?.['taskmaster-sidebar']) {
        delete anyApp.viewRegistry.views['taskmaster-sidebar'];
      }
  }


  
}
