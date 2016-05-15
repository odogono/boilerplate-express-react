const React = require ('react');
const ReactDOM =  require('react-dom');
const _ = require('underscore');

import DefaultContainer from '../containers/default';

const rootNode = document.querySelector('#app-container');
ReactDOM.render( <DefaultContainer />, rootNode );