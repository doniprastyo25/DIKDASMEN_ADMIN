'use strict'
const utils = require('../utils');
const config = require('../../../config');
const sql = require('mssql');

const getList = async () => {
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventsList = await pool.request().query(sqlQueries.ListSekolah);
        return eventsList.recordset;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    getList
}