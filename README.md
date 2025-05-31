# 🧠 Obsidian TaskMaster Plugin

A fast and minimal task management plugin for [Obsidian](https://obsidian.md), built for power users.

🚀 Hotkeys, 🔼 task reordering, 🔔 time scheduling, 🕒 duration tracking, 🔖 tags, and 📚 full sidebar browsing.

---

## 📦 Features

- ⚡ **Quick Task Modal** — Create tasks in seconds with hotkeys
- 🔥 **Priorities** — High, Medium, Low icons
- 🕒 **Scheduling** — Add time and duration
- 🏷️ **Tags** — Organize your tasks with custom tags
- 🔃 **Reordering** — Move tasks up/down via keyboard
- 🗂️ **Sidebar** — Browse and filter tasks in a dedicated panel
- ⌨️ **Hotkeys** — Fast keyboard-driven workflow

---


## ⚙️ Installation

### 🛠 Manual

1. Clone this repository
2. Build the plugin:

```bash
npm install
npm run build
````

3. Copy the `main.js`, `manifest.json`, and `styles.css` (if used) from `/dist` to your Obsidian vault’s `.obsidian/plugins/taskmaster-plugin/` directory.

4. Enable the plugin in Obsidian settings.

---

## ⌨️ Hotkeys

| Action            | Shortcut      |
| ----------------- | ------------- |
| Create Task Modal | `Ctrl + T`    |
| Move Task Up      | `Ctrl + ↑`    |
| Move Task Down    | `Ctrl + ↓`    |
| Toggle Priority   | `ALT  + Q`    |
| Reschedule Task   | `Ctrl + R`    |
| Open Task Sidebar | Ribbon Button |

---

## ✅ Tasks Format

Tasks are saved as Obsidian markdown checkboxes:

```
- [ ] 🔥 Finish YouTube script @13:00 (30min) #deepwork #video
```

---

## 🧪 Status

**V0.2-alpha** — Actively under development. Expect bugs and edge cases. Feedback welcome!

---

## 🧑‍💻 License

[MIT License](LICENSE)

````

---

## ✅ `manual.md` (Usage Guide)

```markdown
# 🧠 Obsidian TaskMaster Plugin — User Manual

## 🪄 How to Use

### 1️⃣ Creating a Task

- Press `Ctrl + T` or use the command palette to open the Task Modal.
- Fill in:
  - Description
  - Priority (🔥 High, ⚠ Medium, 💤 Low)
  - Time (e.g., `14:30`)
  - Duration (e.g., `30min`)
  - Tags (comma-separated)

📥 Press **Add Task** — It will be appended to your current open note.

---

### 2️⃣ Reordering Tasks

Use the following hotkeys inside the note with the task selected:

- 🔼 `Ctrl + ↑` — Move task up
- 🔽 `Ctrl + ↓` — Move task down

---

### 3️⃣ Toggling Priorities

- Select a task in the editor
- Press `ALT + Q` to cycle through 🔥 → ⚠ → 💤 → 🔥

---

### 4️⃣ Rescheduling Tasks

- Select a task and press `Ctrl + R`
- You’ll be prompted to update the time string

---

### 5️⃣ Viewing Sidebar

- Click the ✅ ribbon icon
- The sidebar displays your task list (filtering in progress)

---

## ⌨️ Summary of Hotkeys

| Action              | Hotkey       |
|---------------------|--------------|
| Open Task Modal     | `Ctrl + T`   |
| Move Up             | `Ctrl + ↑`   |
| Move Down           | `Ctrl + ↓`   |
| Change Priority     | `Alt  + Q`   |
| Reschedule Time     | `Ctrl + R`   |
| Toggle Sidebar      | Ribbon icon  |

---

## ⚠ Limitations (v0.1-alpha)

- No cross-note task aggregation (yet)
- No tag-based filtering in sidebar (coming soon)
- Cannot yet delete or edit tasks inline

---

## 🚀 What's New in `0.1.4-alpha`

- 🔄 **Partial Live Sidebar Sync**: Sidebar updates when adding or editing tasks (edit mode only).
- ⚙️ **Preview Mode Support**: Rescheduling and toggling priority now work in Preview mode.
- 🛡️ **Safe View Handling**: Avoids duplicate view registration on plugin reloads.
- ✅ Fixed: `Toggle Priority` now targets the currently selected task line.


## 💬 Feedback

Open issues or suggestions on [GitHub](https://github.com/CodeAndChaosDev).
