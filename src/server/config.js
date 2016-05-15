import _ from 'underscore';
import Fs from 'fs';
import Path from 'path';

import Toml from 'toml';
import Os from 'os';
import Slugify from "underscore.string/slugify";

export const RootDir = Path.join( Path.dirname(__filename), '../../' );

export const Paths = {
    etc: Path.join(RootDir, 'etc'),
    views: Path.join( RootDir, 'web' ),
    'var': Path.join( RootDir, 'var' )
};


// 
// Read config from etc/config.toml
// 

let configPath = Path.join( RootDir, 'etc', 'config.toml' );
let configData = Fs.readFileSync( configPath, 'utf-8' );
export const Config = Toml.parse( configData );


export function loadJson( ...paths ){
    const path = Path.join.apply(this,paths);
    console.log('loadJson from ' + path );
    const result = JSON.parse(Fs.readFileSync(path, 'utf8'));
    return result;
}


// change underscore template strings to use es6 format
_.templateSettings = {
    interpolate: /\$\{(.+?)\}/g
};


const hostname = Slugify( Os.hostname() ); //Slugify('allenby.tap2connect.com');

// console.log('config for ' + hostname + ' is ', localConfig);

if( Config.server[hostname] ){
    Config.server = _.extend({}, Config.server, Config.server[hostname] );
}
