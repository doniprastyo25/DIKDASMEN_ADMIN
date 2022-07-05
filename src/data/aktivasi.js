'use strict'
const date = require('date-and-time');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const config = require('../../config');
const sql = require('mssql');
const axios = require('axios');


const submit = async (kodesekolah, kodeaktivasi, kodereq) => {
    console.log(kodesekolah, kodeaktivasi);
    const timestamp = date.format(new Date(),'YYYYMMDDHHmmss');
        const invalid_req = {status: 401, response: {status: "no", msg: "invalid request"}};
        if (kodereq !== "sakumu_aktivasi") {
            return invalid_req;
        }else{
            try {
                let pool = await sql.connect(config.sql);
                const sqlQueries = await utils.loadSqlQueries('events');
                // console.log(sqlQueries);
                const event = await pool.request()
                                    .input('KodeSekolah', sql.NVarChar, kodesekolah)
                                    .input('KodeAktivasi', sql.NVarChar, kodeaktivasi)
                                    .query(sqlQueries.Aktivasi);
                                    // console.log(event);
                if (event.recordset.length > 0) {
                    const jwttoken = jwt.sign({id: `${kodesekolah}`}, "secrettYudyJjbHBsla"+timestamp);
                    const msg = "aktivasi berhasil, silakan login!"
                    const data = {
                        key: "tYudyJjbHBsla",
                        token: jwttoken,
                        lastsync: timestamp
                    }
                    // console.log(jwttoken);
                    updatetoken(jwttoken, kodesekolah, kodeaktivasi)
                    return {status: 200, response: {status: "ok", msg, data, timestamp}}
                }else{
                    const err_msg = "aktivasi gagal, kode sekolah & kode aktivasi tidak sesuai";
                    return {status: 401, response: {status: "no", msg: err_msg}};
                }
            } catch (error) {
                console.log(error);
            }
        }
}

const updatetoken = async (tken, kodesekolah, kodeaktivasi) => {
    console.log(tken);
    console.log(kodesekolah);
    console.log(kodeaktivasi);
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList  = await pool.request()
                                    .input('jwttoken', sql.NVarChar, tken)
                                    .input('kodesekolah', sql.NVarChar, kodesekolah)
                                    .input('kodeaktivasi', sql.NVarChar, kodeaktivasi)
                                    .query(sqlQueries.Updatetoken)

        return eventList.recordset
        // console.log(eventList.recordset);
    } catch (error) {
        console.log(error);
    }
}

const cekLaporan = async (appsekolah) => {
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                    .input('appsekolah', sql.NVarChar, appsekolah)
                                    .query(sqlQueries.GetAllLaporan);
        // console.log(eventList.recordset.length);
        if (eventList.recordset.length > 0) {
            await pool.request()
                        .input('appsekolah', sql.NVarChar, appsekolah)
                        .query(sqlQueries.DeleteLaporan);
        }
    } catch (error) {
        
    }
}

const cekSinkron = async (appsekolah) => {
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                            .input('appsekolah', sql.NVarChar, appsekolah)
                            .query(sqlQueries.GetAllLaporan);
        if (eventList.recordset.length > 0) {
            return ({status:`ok`, msg:`data ${appsekolah} sudah tersinkron`})
        }else{
            return ({status:`no`, msg:`data ${appsekolah} belum tersinkron silahkan sinkron ulang`})
        }
    } catch (error) {
        console.log(error);
    }
}

const addlaporan = async(sub, kd, kategori, dess, total, totalRp, appsekolah) => {
    // console.log(idsek, namasekolah, filepdf);
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                .input('sub', sql.Int, sub)
                                .input('kd', sql.Int, kd)
                                .input('kategori', sql.Int, kategori)
                                .input('dess', sql.Text, dess)
                                .input('total', sql.Int, total)
                                .input('totalRp', sql.Text, totalRp)
                                .input('appsekolah', sql.NVarChar, appsekolah)
                                .query(sqlQueries.AddLaporan);
        // console.log(eventList.recordset);
    } catch (error) {
        console.log(error);
    }
}

const cekToken = async (cektok) => {
    console.log(cektok);
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('events');
        const eventsList = await pool.request()
                                    .input('Token', sql.NVarChar, cektok)
                                    .query(sqlQueries.Cektoken);
        // return eventsList.recordset;
        const ada = eventsList.recordset;
        // console.log(eventsList.recordset);
        if (ada.length == 1) {
            const succ_msg = "ada token"
            return {status: 200, data: {status:"ok", msg: succ_msg}}
        } else {
            const err_msg = "token tidak ada";
            return {status: 401, data: {status: "no", msg: err_msg}}
        }
        // console.log(ada.length);
    } catch (error) {
        
    }
    // callback({status:true})
}

const cekSekolah = async (id, namasekolah, kodesekolah, kodeaktivasi, token, callback) => {
    // console.log(id);
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                    .input('id', sql.NChar, id)
                                    .input('namasekolah', sql.NVarChar, namasekolah)
                                    .input('kodesekolah', sql.NVarChar, kodesekolah)
                                    .input('kodeaktivasi', sql.NVarChar, kodeaktivasi)
                                    .input('token', sql.NVarChar, token)
                                    .query(sqlQueries.cekSekolah);
        callback({data: eventList.recordset})
        // console.log(eventList.recordset);
    } catch (error) {
        console.log(error);
    }
}

const getList = async (namasekolah) => {
    console.log(namasekolah);
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventsList = await pool.request()
                                    .input('NamaSekolah', sql.NVarChar, namasekolah)
                                    .query(sqlQueries.ListSekolahID);
        // console.log(sqlQueries);
        return eventsList.recordset;
        // console.log(eventsList.recordset);
    } catch (error) {
        return error.message;
    }
}

const getLaporan = async (kodesekolah, callback) => {
    try {
        // console.log(kodesekolah);
        axios({
            method:'get',
            // url:'http://localhost:3123/API/cekLaporan',
            // url:'http://192.168.151.31:3123/API/cekLaporan',
            url:`http://467a0269edbd.sn.mynetname.net:80/API/laporankas?kodesekolah=${kodesekolah}`,
        }).then(function(response) {
            // console.log(response.data);
            const row = response.data
            return callback({status: 'ok', data: row})
        })
    } catch (error) {
        console.log(error);
    }
}

// CRUD SEKOLAH

const addSekolah = async (id, namasekolah, kodesekolah, kodeaktivasi) => {
    try {
        const token = ''
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                .input('id', sql.NChar, id)
                                .input('namasekolah', sql.NVarChar, namasekolah)
                                .input('kodesekolah', sql.NVarChar, kodesekolah)
                                .input('kodeaktivasi', sql.NVarChar, kodeaktivasi)
                                .input('token', sql.NVarChar, token)
                                .query(sqlQueries.AddSekolah)
        return eventList.recordset
    } catch (error) {
        console.log(error);
    }
}

const getListAll = async (callback) => {
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/APIlist',
            // url:'http://localhost:3123/API/cekLaporan',
            // url:'http://192.168.151.31:3123/API/cekLaporan',
            url:'http://467a0269edbd.sn.mynetname.net:80/APIlist',
        }).then(function(response) {
            // console.log(response.data.data);
            const row = response.data.data
            return callback({row: row})
        })
    } catch (error) {
        console.log(error);
    }
}

const getunsync = async (callback) => {
    try {
        axios({
            method:'get',
            url:'http://localhost:3123/API/sudahsinkron',
        }).then(function(response) {
            return callback(response.data);
        })
    } catch (error) {
        console.log(error);
    }
}

const getUpdateSekolah = async (id, callback)=>{
    console.log(id);
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                    .input('id', sql.NChar, id)
                                    .query(sqlQueries.Selectseditsekolah)
        // console.log(eventList.recordset);
        callback({row: eventList.recordset})
    } catch (error) {
        console.log(error);
    }
}

const updatesekolah = async (id, namasekolah, kodeaktivasi, callback) => {
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                            .input('idsekolah', sql.NChar, id)
                            .input('namasekolah', sql.NVarChar, namasekolah)
                            .input('kodeaktivasi', sql.NVarChar, kodeaktivasi)
                            .query(sqlQueries.UpdateSekolah)
        console.log(eventList.recordset);
        return callback({status:'ok', msg:'data terupdate'})
    } catch (error) {
        console.log(error);
    }
}

const delSekolah = async (id) => {
    try {
        let pool = await sql.connect(config.sql);
        let sqlQueries = await utils.loadSqlQueries('events');
        const eventList = await pool.request()
                                    .input('id', sql.NChar, id)
                                    .query(sqlQueries.DeleteSekolah)
        return eventList.recordset
    } catch (error) {
        console.log(error);
    }
}

const getlistallperiod = async(callback) => {
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/API/getlaporanperiod',
            url:'http://467a0269edbd.sn.mynetname.net:80/API/getlaporanperiod',
        }).then(function(response){
            if (response.data.status == 200) {
                // console.log(response.data.data.row[0].periode);
                const listper = []
                for (let i = 0; i < response.data.data.row.length; i++) {
                    const per =response.data.data.row[i].periode
                    const per1 =per.substring(0, 8);
                    const per1tahun = per1.substring(0, 4)
                    const per1bulan = per1.substring(4, 6)
                    const per1tanggal = per1.substring(6, 8)
                    const per2 =per.substring(9, 17)
                    const per2tahun = per2.substring(0, 4)
                    const per2bulan = per2.substring(4, 6)
                    const per2tanggal = per2.substring(6, 8)
                    const periode2 = per2bulan+"/"+per2tanggal+"/"+per2tahun
                    const periode1 = per1bulan+"/"+per1tanggal+"/"+per1tahun
                    const cperiode1 = date.format(new Date(periode1), 'DD/MMMM/YYYY')
                    const cperiode2 = date.format(new Date(periode2), 'DD/MMMM/YYYY')
                    const all = cperiode1+"-"+cperiode2
                    listper.push({
                        periode:all,
                        realperiod:per
                    })
                }
                // console.log(listper);
                return callback(listper)
            } else {
                return callback({status:500, msg:'error line 326'})   
            }
        })
    } catch (error) {
        return callback({status:500, msg:'error line 330'})
    }
}

const getsekolahbyperiod = async(periode, callback) => {
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/API/getsekolahperiod',
            url:'http://467a0269edbd.sn.mynetname.net:80/API/getsekolahperiod',
            data: {
                periode:periode
            }
        }).then(function(response) {
            // console.log(response.data);
            const listdata = []
            if (response.data.status == 200) {
                for (let i = 0; i < response.data.data.length; i++) {
                    listdata.push({
                        appsekolah:response.data.data[i].appsekolah,
                        Namasekolah:response.data.data[i].NamaSekolah,
                        periode: response.data.data[i].periode
                    })                    
                }
                return callback(listdata)
            } else {
                return callback('data error')
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const GetDetailSinkronPeriod = async(appsekolah, periode, callback) => {
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/API/getdetailsinkronperiod',
            url:'http://467a0269edbd.sn.mynetname.net:80/API/getdetailsinkronperiod',
            data: {
                appsekolah:appsekolah,
                periode:periode
            }
        }).then(function(response) {
            // console.log(response.data);
            if (response.data.status == 200) {
                return callback({penerimaan:response.data.penerimaan, pengeluaran:response.data.pengeluaran})
            } else {
                return callback({msg:'data salah'})
            }
        })
    } catch (error) {
        return callback({msg:'request error'})
    }
}

const GetListPeriodBySekolah = async(appsekolah, callback) => {
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/API/getlistperiodbysekolah',
            url:'http://467a0269edbd.sn.mynetname.net:80/API/getlistperiodbysekolah',
            data: {
                appsekolah:appsekolah
            }
        }).then(function(response) {
            // console.log(response.data);
            if (response.data.status == 200) {
                const listper = []
                for (let i = 0; i < response.data.data.length; i++) {
                    const per =response.data.data[i].periode
                    const per1 =per.substring(0, 8);
                    const per1tahun = per1.substring(0, 4)
                    const per1bulan = per1.substring(4, 6)
                    const per1tanggal = per1.substring(6, 8)
                    const per2 =per.substring(9, 17)
                    const per2tahun = per2.substring(0, 4)
                    const per2bulan = per2.substring(4, 6)
                    const per2tanggal = per2.substring(6, 8)
                    const periode2 = per2bulan+"/"+per2tanggal+"/"+per2tahun
                    const periode1 = per1bulan+"/"+per1tanggal+"/"+per1tahun
                    const cperiode1 = date.format(new Date(periode1), 'DD/MMMM/YYYY')
                    const cperiode2 = date.format(new Date(periode2), 'DD/MMMM/YYYY')
                    const all = cperiode1+"-"+cperiode2
                    listper.push({
                        periode:all,
                        realperiode:per,
                        appsekolah: response.data.data[i].appsekolah
                    })            
                }
                return callback(listper)
            } else {
                console.log('data error');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const GetDeletePeriodSekolah = async(appsekolah, periode, callback) =>{
    try {
        axios({
            method:'get',
            // url:'http://localhost:3123/API/getdelperiodsinkron',
            url:'http://467a0269edbd.sn.mynetname.net:80/API/getdelperiodsinkron',
            data:{
                appsekolah:appsekolah,
                periode:periode
            }
        }).then(function(response) {
            return callback(response)
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    submit,
    getListAll,
    getList,
    cekToken,
    cekSekolah,
    addlaporan,
    addSekolah,
    updatesekolah,
    getLaporan,
    cekLaporan,
    cekSinkron,
    delSekolah,
    getUpdateSekolah,
    getunsync,
    getlistallperiod,
    getsekolahbyperiod,
    GetDetailSinkronPeriod,
    GetListPeriodBySekolah,
    GetDeletePeriodSekolah
}