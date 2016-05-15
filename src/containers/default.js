const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore');



export default class DefaultContainer extends React.Component {
    render() {
        return <div>Welcome {this.props.name}!</div>;
    }
}