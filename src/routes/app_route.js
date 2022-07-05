'use strict'
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/app_controller');
const apicontroller = require('../controllers/api_controller');

//GET
// router.get('/', controllers.get_login);
router.get('/', controllers.getDashboard);
router.get('/register', controllers.getRegisterSekolah);
router.get('/list', controllers.getListSekolah);
router.get('/listunsync', controllers.getunsync);
router.get('/listlaporan', controllers.getListLaporan);
router.get('/penerimaan', controllers.inPenerimaan);
router.get('/pengeluaran', controllers.inPengeluaran);
router.get(`/laporankas`, controllers.getLaporankas);
router.get(`/getEditsekolah`, controllers.getEditsekolah)
router.get('/API', controllers.apiSekolah);
router.get('/APIid', controllers.apiSekolahID);
router.get('/API/cektoken', controllers.post_cektoken);
router.get('/listperiod', controllers.getlistperiod);
router.get('/listSekolahByPeriod', controllers.getlistsekolahbyperiod);
router.get('/detailperiodesinkron', controllers.getperiodesinkron);
router.get(`/listperiodesinkron`, controllers.getperiodbysekolah);
router.get(`/delperiodesekolah`, controllers.delperiodbysekolah);
// router.get('/API/cektoken', controllers.post_cektoken);

//APIGET
router.get('/APIlist', apicontroller.getListSekolah);
router.get('/API/cekLaporan', apicontroller.cekLaporan);
router.get('/API/cekSinkronisasi', apicontroller.cekSinkronisasi);
router.get('/API/laporankas', apicontroller.getLaporankas);

//API POST
router.post('/APIaddsekolah', apicontroller.addlistsekolah);
router.post('/APIeditsekolah', apicontroller.editsekolah);
router.post(`/API/postLaporan`, apicontroller.postLaporan);
router.post('/api/aktivasi', controllers.post_aktivasi);

//POST
router.post('/', controllers.post_login);
router.post('/list/add', controllers.addlistsekolah);
router.post('/addlaporan', controllers.post_laporan);
router.post('/editsekolah', controllers.editsekolah);
router.post('/delete', controllers.getDelete);

module.exports = {
    routes:router
}