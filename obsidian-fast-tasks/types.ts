export interface TaskData {
  description: string;
  priority: '🔥 High' | '⚠ Medium' | '💤 Low';
  time?: string;        // e.g., "14:30"
  duration?: string;    // e.g., "30min"
  tags?: string[];      // e.g., ['#deepwork', '#writing']
  lineNumber?: number;  // used for reordering in file
}
