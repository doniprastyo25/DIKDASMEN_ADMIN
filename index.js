'use strict'
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const express_layouts = require('express-ejs-layouts');
const body_parser = require('body-parser');
const app_route = require('./src/routes/app_route');
const dotenv = require('dotenv')
const config = require('./config')
const flash = require('connect-flash');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const open = require('open');
dotenv.config();
// app.use(cors());

const app = express();
app.use(helmet());
app.use(compression());

//view engine
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

// config flash
app.use(cookieParser('secretMMSPObyqueenofpain'));
app.use(
    session({
        cookie: {expires: 6000},
        secret: 'secretMMSPObyqueenofpain',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());


//layouts
app.use(express_layouts);
app.use(body_parser.json());
app.use(express.urlencoded({ extended: true }));

//route
app.use("/", app_route.routes);

//static
app.use("/styles", express.static(path.join(__dirname + "/src/assets/bootstrap")));
app.use("/icon", express.static(path.join(__dirname + "/src/assets/bootstrap-icons")));
app.use("/ressources", express.static(path.join(__dirname + "/src/assets/ressources")));

//server
app.listen(config.port, ()=>{
    console.log("");
    console.log(" ====================================================");
    console.log(" ADMIN SAKUMU (Sistem Aplikasi Keuangan Muhammadiyah)");
    console.log(" ====================================================");
    console.log("");
    console.log(" Powered by PT BPRS Mitra Mentari Sejahtera");
    console.log("");
    console.log(" url : http://localhost:"+ config.port);
    console.log("");
    console.log(" app version 1.0");
    console.log(" _________________________________");
    console.log("");
    // console.log(config.sql);
    openlink();
});

async function openlink() {
    await open('http://localhost:3112', {app: {name: 'chrome'}});
}

module.exports={app};