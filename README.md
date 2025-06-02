# 🧠 Obsidian TaskMaster Plugin

A fast and minimal task management plugin for [Obsidian](https://obsidian.md), built for power users.

🚀 Hotkeys, 🔼 task reordering, 🔔 time scheduling, 🕒 duration tracking, 🔖 tags, and 📚 full sidebar browsing.

---

## 📦 Features

* ⚡ **Quick Task Modal** — Create tasks in seconds with hotkeys
* 🔥 **Priorities** — High, Medium, Low icons with toggle support
* 🕒 **Scheduling** — Add time (`@13:00`) and duration (`(30min)`)
* 🏷️ **Tags** — Organize your tasks with custom tags
* 🔃 **Reordering** — Move tasks up/down via keyboard
* 🗂️ **Sidebar** — Browse and auto-refresh task panel
* ⌨️ **Hotkeys** — Fast keyboard-driven workflow
* 🧠 **Smart Parsing** — Automatically parses tasks with `@time`, priorities, and durations
* 🔄 **Live Sync** — Tasks update in real-time inside the auto-updated sidebar

---

## ⚙️ Installation

### 🛠 Manual

1. Clone this repository
2. Build the plugin:

```bash
npm install
npm run build
```

3. Copy `main.js`, `manifest.json`, and `styles.css` (if used) from `/dist` to your Obsidian vault’s `.obsidian/plugins/taskmaster-plugin/` directory.
4. Enable the plugin in Obsidian settings.

---

## ⌨️ Hotkeys

| Action            | Shortcut      |
| ----------------- | ------------- |
| Create Task Modal | `Ctrl + T`    |
| Move Task Up      | `Ctrl + ↑`    |
| Move Task Down    | `Ctrl + ↓`    |
| Toggle Priority   | `Alt + Q`     |
| Reschedule Task   | `Ctrl + R`    |
| Open Sidebar      | Ribbon Button |

---

## ✅ Tasks Format

Tasks are saved as standard Obsidian markdown checkboxes:

```md
- [ ] 🔥 Finish YouTube script @13:00 (30min) #deepwork #video
```

---

## 🚀 What's New in `0.1.5-alpha`

### ✨ Features

* ✅ **Real-Time Sidebar Sync**: Editing tasks in the modal now updates the sidebar automatically — no refresh required.
* ✅ **Task Priority Icons**: High (🔥), Medium (⚠️), and Low (💤) priority icons rendered inline.
* ✅ **Parsing Improvements**: Enhanced time and duration parsing (e.g., `@15:00`, `(30min)`).

### 🐞 Fixes

* 🧼 Fixed stale tasks appearing in auto-updated view
* 🔄 Checkbox states now sync after modal edits
* 🧠 More reliable parsing of task metadata

### ⚠️ Known Issues

* ❌ `(30min)` is stripped from the task after modal refresh
* ❌ Minor mismatches between static and auto-updated view rendering

---

## 🧪 Status

**v0.1.5-alpha** — Actively under development. Bugs may exist. Feedback welcome!

---

## 🛠️ Changelog

See [`patch-notes/`](./patch-notes) for all release logs.

* `0.1.5-alpha`: Real-time task sync, improved parsing, priority icons
* `0.1.4-alpha`: Preview mode support, partial sidebar sync

---

## 🧑‍💻 License

[MIT License](LICENSE)


