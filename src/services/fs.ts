/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-underscore-dangle */
import * as fs from 'fs';

import { createObjectCsvWriter } from 'csv-writer';
import { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { ObjectMap } from 'csv-writer/src/lib/lang/object';
import { RegForm } from '../models';

const GS_REGISTRATION_FILE_PREFIX = 'gs-registration';

let csvWriter: CsvWriter<ObjectMap<any>>;

export enum OsTypes {
  Windows = 1,
  Mac = 2,
  Linux = 3,
  Other = 4,
}

// export function getOs(): OsTypes {

//     const os = process.
//     // const os = window.navigator.platform;
//     if (os.startsWith("Win")) {
//         osType = OsTypes.Windows;
//     }
//     else if (os.startsWith("Mac")) {
//         osType = OsTypes.Mac;
//     }
//     else if (os.startsWith("Linux")) {
//         osType = OsTypes.Linux;
//     }
//     else {
//         osType = OsTypes.Other;
//     }
//     return osType;
// }

let osType: OsTypes;

function getOs() {
  if (osType) {
    return osType;
  }

  const p = process.platform;
  osType = OsTypes.Other;
  if (p === 'darwin') {
    osType = OsTypes.Mac;
  }
  if (p === 'win32') {
    osType = OsTypes.Windows;
  }

  if (p === 'linux') {
    osType = OsTypes.Linux;
  }
  return osType;
}

function getSlash(): string {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _osType: OsTypes = getOs();
  const isWinOS: boolean = _osType === OsTypes.Windows;

  const slash = isWinOS ? '\\' : '/';
  return slash;
}

function getFileName(): string {
  const LOCATION = `csv${getSlash()}`;

  const fileName = `${GS_REGISTRATION_FILE_PREFIX}_${Date.now().toString()}`;
  return `${LOCATION}${fileName}`;
}

const csvDir = 'csv';

const initDirectory = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

function createCsvWrite(path: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  csvWriter = createObjectCsvWriter({
    path: `${path}.csv`,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'year', title: 'Last Year Sat' },
      { id: 'phone', title: 'Phone' },
      { id: 'email', title: 'Email' },
      { id: 'date', title: 'Date Filled' },
      { id: 'time', title: 'Time Filled' },
      { id: 'host', title: 'Host' },
    ],

  });
}

function getLogDirectory(dir: string) {
  initDirectory(dir);
  return `${dir}/`;
}

function writeLog(data: string) {
  fs.writeFileSync(
    `${getLogDirectory('log')}registration_error.log`,
    `${(new Date()).toLocaleString()}_${data}\n`,
    { flag: 'a' },
  );
}

export function writeToCSV(list: RegForm) {
  if (!csvWriter) {
    initDirectory(csvDir);
    createCsvWrite(getFileName());
  }

  csvWriter
    .writeRecords([list])
    .then(() => {
      console.log('The CSV file was written successfully');
    })
    .catch((err) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      writeLog(err);
      // eslint-disable-next-line no-alert
      alert('Oops, something went wrong, please notify Ido Ayal 0507407368');
    });
}
