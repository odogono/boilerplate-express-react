import Http from 'http';
import Url from 'url';
// import Ws from 'ws';
import Express from 'express';
import Session from 'express-session';
import _ from 'underscore';
import {Config,Paths} from './config';
import * as Log from './log';
// import Livereload  from 'tiny-lr';

let log = Log.create('server-http');


export default function create(port=4000, options={}){
    let httpServer = Http.createServer();
    let app = Express();
    httpServer.on('request', app);

    // app.use(require('connect-livereload')({
    //     src: "localhost:35730"
    // }));
    
    app.use( Session( Config.server.session ));
    // app.use(Livereload.middleware({ app }))
    app.use( Express.static('web') );
    app.set( 'views', Paths.views );
    app.set( 'view engine', 'mustache' );
    app.engine( 'mustache', require('odgn-express-mustache') );

    
    
    
    
    return _.extend({},options,{
        httpServer,
        app,
        start: function(){
            return new Promise( r => {
                return httpServer.listen(port, () => { 
                    log.info('Listening on ' + httpServer.address().port);
                    return r(this);
                });    
            })
            
        }
    });
}