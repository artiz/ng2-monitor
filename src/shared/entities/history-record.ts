export class HistoryRecord {
  mem_free: number;
  mem_total: number;
  cpu_user?: number;
  cpu_nice?: number;
  cpu_sys?: number;
  cpu_idle?: number;
  cpu_irq?: number;
  ts: number;
}