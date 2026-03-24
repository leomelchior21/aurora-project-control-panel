import type { SystemStatus } from "../../../types/city";

export function getStatusColor(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "#ff6b6b";
    case "attention":
      return "#f7b84b";
    default:
      return "#53d48a";
  }
}

export function getStatusLabel(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "Critical";
    case "attention":
      return "Attention";
    default:
      return "Nominal";
  }
}
