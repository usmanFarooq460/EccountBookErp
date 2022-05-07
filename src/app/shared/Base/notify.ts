import notify from "devextreme/ui/notify";

export function notification(message: string, type: string, width: number) {
  notify({ message: message, width: width, position: { my: "right top", at: "right top", of: ".container-fluid" } }, type);
}
export function notificationTimer(message: string, type: string, displayTime: number, width: number) {
  notify({ message: message, displayTime: displayTime, width: width, position: { my: "right top", at: "right top", of: ".container-fluid" } }, type);
}
