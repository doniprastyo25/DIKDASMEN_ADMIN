'use strict';
const data_aktivasi = require('../data/aktivasi');
const eventData = require('../data/aktivasi');
const rupiah = require('rupiah-format');

//GET
const get_login = async (req, res) => {
    res.render('./pages/login', {
        title: 'Login',
        layout: 'login_layout'
    });
}

//POST
const post_login = async (req, res) => {

}

//API
const post_aktivasi = async (req, res) => {
    try {
        var kodesekolah = req.header('kd_sekolah');
        var kodeaktivasi = req.header('kd_aktivasi');
        var kodereq = req.body.kd;
        const result = await data_aktivasi.submit(kodesekolah, kodeaktivasi, kodereq);
        return res.status(result.status).json(result.response);
    } catch (error) {
        console.log(error);
    }

}

const post_cektoken = async (req, res, next) => {
    try {
        var cektok = req.body.token;
        const event = await data_aktivasi.cekToken(cektok);
        res.send(event);
    } catch (error) {
        console.log(error);
    }
}

const post_laporan = async (req, res, next) => {
    try {
        const idsek = req.body.idsek;
        const namasekolah = req.body.namasekolah;
        const tanggal = req.body.timestamp;
        const filepdf = req.body.filepdf;
        const result = await data_aktivasi.addlaporan(idsek, namasekolah, tanggal, filepdf)
        if (result == undefined) {
            res.send({status:'ok'})
        } else {
            res.send({error})
        }
        // res.send(result)
        // return res.status({result})
    } catch (error) {
        console.log(error);
    }
}

const getDashboard = async (req, res) => {
    res.render('./pages/dashboard', {
        title: 'Dashboard',
        layout: 'main_layout',
        page: 'dashboard'
    });
}

const getRegisterSekolah = async (req, res) => {
    res.render('./pages/register_sekolah', {
        title: 'Register Sekolah',
        layout: 'main_layout',
        page: 'register_sekolah'
    });
}

const getListSekolah = async (req, res, next) => {
    try {
        await data_aktivasi.getListAll(function (data) {
            // console.log(data);
            let listdata = [];
            for (let i = 0; i < data.row.length; i++) {
                listdata.push({
                    id: data.row[i].id,
                    namasekolah: data.row[i].namasekolah,
                    kodesekolah: data.row[i].kodesekolah,
                    kodeaktivasi: data.row[i].kodeaktivasi,
                    token: data.row[i].token
                })
            }
            // console.log(listdata);
            res.render('./pages/list_sekolah', {
            title: 'List Sekolah',
            layout: 'main_layout',
            page: 'list_sekolah',
            data: listdata,
            no: 1,
            succ: req.flash('success'),
            exist: req.flash('dataexist'),
            del: req.flash(`del`)
            });
        })
    } catch (error) {
        console.log(error);
    }
}

const getListLaporan = async (req, res, next) => {
    res.render('./pages/listlaporan', {
        title: 'List Laporan',
        layout: 'main_layout',
        page: 'list_laporan'
    })
}

const inPenerimaan = async (req, res) => {
    res.render('./pages/inPenerimaan', {
        title: 'Input Penerimaan',
        layout: 'main_layout',
        page: 'inPenerimaan'
    });
}

const inPengeluaran = async (req, res) => {
    res.render('./pages/inPengeluaran', {
        title: 'Input Pengeluaran',
        layout: 'main_layout',
        page: 'inPengeluaran'
    });
}

const apiSekolah = async (req, res, next) => {
    // const namasekolah = req.body.nama;
    try {
        const events = await eventData.getListAll();
        res.send(events)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const apiSekolahID = async (req, res, next) => {
    const namasekolah = req.body.nama;
    try {
        const events = await eventData.getList(namasekolah);
        res.send(events)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const addlistsekolah = async (req, res, next) => {
    const id = req.body.inpIdSekolah
    const namasekolah = req.body.inpNamaSekolah
    const kodesekolah = req.body.inpKodeSekolah
    const kodeaktivasi = req.body.inpKodeAktivasi
    const token = ''
    // console.log(id);
    //query db berdasarkan body
    await eventData.cekSekolah(id, namasekolah, kodesekolah, kodeaktivasi, token, function(data) {
        // console.log(data.data.length);
        const cek = data.data.length;
        if (cek > 0) {
            // console.log('data sudah ada');
            req.flash(`dataexist`, `data sudah ada silahkan teliti kembali`)
            res.redirect('/list')
        } else {
            eventData.addSekolah(id, namasekolah, kodesekolah, kodeaktivasi)
            req.flash(`success`, `data ${namasekolah} berhasil dimasukkan`);
            res.redirect('/list')
        }
    })
    //kodisi jika ada kembalikan fungsi jika tidak masukkan data
}

const getEditsekolah = async (req,res,next) => {
    const id = req.query.id
    await data_aktivasi.getUpdateSekolah(id, function(data) {
        // console.log(data.row[0].Id);
        res.render('./pages/geteditsekolah', {
            title: 'List Laporan',
            layout: 'main_layout',
            page: 'list_laporan',
            data: data.row[0]
        })
    })
}

const editsekolah = async (req, res, next) => {
    try {
        const idsek = req.query.id
        const namasekolah = req.body.inpNamasekolah
        const kodeaktivasi = req.body.inpKodeaktivasi
        // console.log(idsek);
        await data_aktivasi.updatesekolah(idsek, namasekolah, kodeaktivasi, function(data) {
            if (data.status == 'ok') {
                req.flash('updatesucc', `${data.msg}`)
                res.redirect(`/list`)
            }
        })

    } catch (error) {
        res.send({status:'ok', msg:`gagal mengganti data`})
    }
    next()
}

const getLaporankas = async (req, res, next) => {
    try {
        const kodesekolah = req.query.kodesekolah
        await data_aktivasi.getLaporan(kodesekolah, function(data) {
            // console.log(data);
            if (data.status === 'ok') {
                const terima = data.data.penerimaan
                console.log(terima);
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
                const keluar = data.data.pengeluaran
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
                res.render(`./pages/laporankas`,{
                    title: `laporankas`,
                    layout: `main_layout`,
                    page: `laporankas`,
                    penerimaan: listpenerimaan,
                    pengeluaran: listpengeluaran,
                    total_penerimaan: rupiah.convert(totalIn),
                    total_pengeluaran: rupiah.convert(totalOut),
                    totalAll: rupiah.convert(totalAll)
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const getDelete = async (req, res, next) => {
    try {
        const id = req.query.id
        await data_aktivasi.delSekolah(id)
        req.flash(`del`, `data telah terhapus`)
        res.redirect(`/list`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_login,
    post_login,
    post_aktivasi,
    getDashboard,
    getRegisterSekolah,
    getListSekolah,
    inPenerimaan,
    inPengeluaran,
    apiSekolah,
    apiSekolahID,
    post_cektoken,
    addlistsekolah,
    getListLaporan,
    post_laporan,
    getLaporankas,
    editsekolah,
    getEditsekolah,
    getDelete
}