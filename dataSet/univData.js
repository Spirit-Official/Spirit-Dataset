'use strict';
import dotenv from 'dotenv';
dotenv.config();

import config from '../config/config.js';
import { pool } from '../lib/connect.js';
import { consoleBar, timeLog } from '../config/common.js';

import xlsx from 'xlsx';

const updateUnivWithExcel = async () => {
  const univFile = xlsx.readFile('./lib/univList.xls');

  const sheetName = univFile.SheetNames[0];
  const sheet = univFile.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach((entry) => {
    if (entry['학교상태'] != '폐교' && entry['학제'] != '일반대학원' && entry['학제'] != '전문대학원' && entry['학제'] != '특수대학원') {
      console.log(entry['학교명'], entry['본분교']);
      writeUnivInfo(entry['학교명'], entry['본분교']);
    }
  });

};


const writeUnivInfo = async (universityName, universityBranch) => {
  const query = 'INSERT INTO university(universityName, universityBranch) VALUES (?,?);'
  const queryData = [universityName, universityBranch];

  const results = {};
  results.result = true;
  results.error = [];
  results.univName = universityName;
  results.univBranch = universityBranch;

  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows, fields] = await connection.query(query, queryData);
    } catch (err) {
      results.result = false;
      results.error.push('Query Error : ' + err.message);
    }
    connection.release();
  } catch (err) {
    results.result = false;
    results.error.push('DB Error : ' + err.message);
  }
  consoleBar();
  timeLog('write univ info // '+JSON.stringify(results));
};

export { updateUnivWithExcel };



