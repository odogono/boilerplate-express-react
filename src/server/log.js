import _ from 'underscore';
import Bunyan from 'bunyan';
// import Syslog from 'bunyan-syslog';
import {printIns} from '../util';

function createSysLogStream( obj ){
    return obj;
    // return _.extend({}, obj, {
    //     streams:[
    //     // {
    //     //     level: 'debug',
    //     //     type: 'raw',
    //     //     stream: Syslog.createBunyanStream({
    //     //         type: 'sys',
    //     //         facility: Syslog.local0,
    //     //         host: '127.0.0.1',
    //     //         port: 514
    //     //     })
    //     // },
    //     {
    //         level: 'debug',
    //         stream: process.stdout
    //     }]
    // })
}

export function create( name ){
    let config = {name,
        level: 'debug'
    }; //createSysLogStream({name});
    let log = Bunyan.createLogger(config);
    // printIns( config );
    return log;
}