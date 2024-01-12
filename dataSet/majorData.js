'use strict';
import dotenv from 'dotenv';
dotenv.config();

import config from '../config/config.js';
import { pool } from '../lib/connect.js';
import { consoleBar, timeLog } from '../config/common.js';

import xlsx from 'xlsx';

const updateMajorWithExcel = async () => {
  const majorFile = xlsx.readFile('./lib/majorList.xls');

  const sheetName = majorFile.SheetNames[0];
  const sheet = majorFile.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet);

  data.forEach((entry) => {
    if (entry['학위과정명'] == '학사' && entry['학교구분명'] == '대학교' && entry['학과상태명'] != '폐과'){
      console.log(entry['학교명'], entry['학과명']);
      writeUnivInfoFromMajorList(entry['학교명']);
    }
  });

};

const readUnivNameFromList = async (universityName) => {
  const query = 'SELECT universityId FROM university WHERE universityName = ?;';

  const results = {};
  results.result = true;
  results.error = [];

  try {
    const connection = await pool.getConnection(async conn => conn);
    try{
      const [rows, fields] = await connection.query(query, universityName);
      console.log(rows);
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
  timeLog('read univ info // '+JSON.stringify(results));

};

const writeUnivInfoFromMajorList = async (universityName) => {
  const query = 'INSERT IGNORE INTO university(universityName) VALUES (?);';
  
  const results = {};
  results.result = true;
  results.error = [];
  results.universityName = universityName;

  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows, fields] = await connection.query(query, universityName);
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
  timeLog('write univ info via Major List // '+JSON.stringify(results));
};

//const writeMajorInfo = async ()

export { updateMajorWithExcel };