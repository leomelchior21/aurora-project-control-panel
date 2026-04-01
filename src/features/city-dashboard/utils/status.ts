import type { SystemStatus } from "../../../types/city";

export function getStatusColor(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "#FF3131";
    case "attention":
      return "#FFBF00";
    default:
      return "#3DDC84";
  }
}

export function getStatusLabel(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "Critical";
    case "attention":
      return "Attention";
    default:
      return "Stable";
  }
}
