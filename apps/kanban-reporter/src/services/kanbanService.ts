export type KanbanService = {
  sendDashboard: () => Promise<void>;
  sendAbnormalCardStatuses: () => Promise<void>;
  sendWeeklySummary: () => Promise<void>;
};
