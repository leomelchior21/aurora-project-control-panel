import type { SystemStatus } from "../../../types/city";

export function getStatusColor(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "#FF3131";
    case "attention":
      return "#FFBF00";
    default:
      return "#8D98A8";
  }
}

export function getStatusLabel(status: SystemStatus) {
  switch (status) {
    case "critical":
      return "Crítico";
    case "attention":
      return "Atenção";
    default:
      return "Estável";
  }
}
