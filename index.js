'use strict';
import dotenv from 'dotenv';
dotenv.config();
import { updateUnivWithExcel } from './dataSet/univData.js';
import { updateMajorWithExcel } from './dataSet/majorData.js';

// -------------------- macro --------------------

//updateUnivWithExcel();
updateMajorWithExcel();