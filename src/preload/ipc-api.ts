import { RegForm } from '_/models';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

/** Notify main the renderer is ready. */
function rendererReady() {
  ipcRenderer.send('renderer-ready');
}

async function exportToCSV(data: RegForm):Promise<any> {
  ipcRenderer.invoke('exportToCsv', data);
}
export default { rendererReady, exportToCSV };
