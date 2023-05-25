const QueryDB = require('../config/db_Config');

exports.getdataFromDb = () => {
  return QueryDB('SELECT * from pdf_table');
};

exports.getUsers = () => QueryDB('SELECT * from users');
exports.getCompInfo = () => QueryDB('SELECT * from compinfo');
