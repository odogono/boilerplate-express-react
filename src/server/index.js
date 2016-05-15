import createHttpServer from './http';
import {Config, RootDir, Paths} from './config';
import * as Log from './log';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import DefaultContainer from '../containers/default';

const PORT = Config.server.port;

let httpServer = createHttpServer(PORT);
const app = httpServer.app;
const log = Log.create('server');

const ReactApp = React.createFactory( DefaultContainer );


httpServer.start()
    .then( () => {
        log.info(`started on ${Os.hostname()}:${PORT}`);
    })

    

app.get('/', (req, res) => {
    let state = {
        valid:true
    }
    let html = ReactDOMServer.renderToString( ReactApp() );
    // Output html rendered by react
    res.render('index.mustache', {react: html, initial_state:JSON.stringify(state) });
});