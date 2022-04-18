'use strict';
const data_aktivasi = require('../data/aktivasi');
const rupiah = require('rupiah-format');
// const eventData = require('../data/aktivasi')

const getListSekolah = async (req, res, next) => {
    try {
        await data_aktivasi.getListAll(function (data) {
            // console.log(data.row[0]);
            let listdata = [];
            for (let i = 0; i < data.row.length; i++) {
                listdata.push({
                    id: data.row[i].id,
                    namasekolah: data.row[i].NamaSekolah,
                    kodesekolah: data.row[i].KodeSekolah,
                    kodeaktivasi: data.row[i].KodeAktivasi,
                    token: data.row[i].Token
                })
            }
            // console.log(listdata);
            res.send({ status:'ok', data:listdata, no:1})
        })
    } catch (error) {
        console.log(error);
    }
    next()
}

const addlistsekolah = async (req, res, next) => {
    try {
        const idsek = req.body.idsekolah
        const namasekolah = req.body.namasekolah
        const kodesekolah = req.body.kodesekolah
        const kodeaktivasi = req.body.kodeaktivasi
        const result = await data_aktivasi.addSekolah(idsek, namasekolah, kodesekolah, kodeaktivasi)
        res.send({status:'ok', data:result, msg:`data ${namasekolah} sudah masuk`})
    } catch (error) {
        res.send({status:'no', msg:'gagal'})
    }
}

const editsekolah = async (req, res, next) => {
    try {
        const idsek = req.body.idsekolah
        const namasekolah = req.body.namasekolah
        const kodesekolah = req.body.kodesekolah
        const kodeaktivasi = req.body.kodeaktivasi
        const result = await data_aktivasi.updatesekolah(idsek, namasekolah, kodesekolah, kodeaktivasi)
        res.send({status:'ok', data:result, msg:`sukses mengganti data sekolah ${namasekolah}`})
    } catch (error) {
        res.send({status:'ok', msg:`gagal mengganti data`})
    }
    next()
}

const delSekolah = async (req, res, next) => {

}

const postLaporan = async (req, res, next) => {
    try {
        const sub = req.body.sub
        const kd = req.body.kd
        const kategori = req.body.kategori
        const dess = req.body.dess
        const total = req.body.total
        const totalRp = req.body.totalRp
        const appsekolah = req.body.appsekolah
        await data_aktivasi.addlaporan(sub, kd, kategori, dess, total, totalRp, appsekolah)
        // res.send({status:'ok', data: result, msg: `data sudah masuk`})
    } catch (error) {
        // res.send({status:`no`, msg:`data tidak bisa masuk`})
        console.log(error);
    }
}

const cekLaporan = async(req, res, next) => {
    try {
        const appsekolah = req.body.appsekolah
        await data_aktivasi.cekLaporan(appsekolah)
    } catch (error) {
        console.log(error);
    }
}

const cekSinkronisasi = async(req, res, next) => {
    try {
        const appsekolah = req.body.appsekolah
        const result = await data_aktivasi.cekSinkron(appsekolah)
        res.send({result})
    } catch (error) {
        console.log(error);
    }
}

const getLaporankas = async (req, res, next) => {
    try {
        const kodesekolah = req.query.kodesekolah
        const result = await data_aktivasi.getLaporan(kodesekolah);
        // console.log(result);
        if (result.status === 'ok') {
            const terima = result.penerimaan
            // console.log(terima);
            const listpenerimaan = [];
            let totalIn = 0;
            for (let i = 0; i < terima.length; i++) {
                listpenerimaan.push({
                    sub: terima[i].sub,
                    dess: terima[i].dess,
                    total: terima[i].total,
                    totalRp: terima[i].totalRp
                })
                totalIn += terima[i].total
            }
            // console.log(rupiah.convert(totalIn));
            const keluar = result.pengeluaran
            const listpengeluaran = [];
            let totalOut = 0;
            for (let i = 0; i < keluar.length; i++) {
                listpengeluaran.push({
                    sub: keluar[i].sub,
                    dess: keluar[i].dess,
                    total: keluar[i].total,
                    totalRp: keluar[i].totalRp
                })
                totalOut += keluar[i].total
            }
            // console.log(listpengeluaran);
            // console.log(rupiah.convert(totalOut));
            const totalAll = totalIn - totalOut
            // console.log(totalAll);
            res.send({  penerimaan: listpenerimaan,
                        pengeluaran: listpengeluaran,
                        total_penerimaan: rupiah.convert(totalIn),
                        total_pengeluaran: rupiah.convert(totalOut),
                        totalAll: rupiah.convert(totalAll) })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getListSekolah,
    addlistsekolah,
    editsekolah,
    delSekolah,
    postLaporan,
    cekLaporan,
    cekSinkronisasi,
    getLaporankas
}