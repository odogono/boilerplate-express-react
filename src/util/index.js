import Util from 'util';
import _ from 'underscore';

export function Stringify( obj, space ){
    let cache = [];
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, space);
}


export function printIns(arg,depth,showHidden,colors){
    if( _.isUndefined(depth) ) depth = 2;
    // var stack = __stack[1];
    // var fnName = stack.getFunctionName();
    // var line = stack.getLineNumber();
    // Util.log( fnName + ':' + line + ' ' + Util.inspect(arg,showHidden,depth,colors) );
    Util.log( Util.inspect(arg,showHidden,depth,colors) );
};

export function printVar(...args){
    let ii, len;
    for (ii = 0, len = args.length; ii < len; ii++) {
        Util.log( Stringify(args[ii], null, '\t') );
    }
}