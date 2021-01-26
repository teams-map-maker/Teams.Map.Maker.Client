import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { ImageMapper } from './components/ImageMapper'
import { Map } from './components/Map'
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    constructor() {
        super();
        this.state = {
            rooms: []
        }

    }


    render() {
        return (
            <Layout>
                <Route path='/' component={ImageMapper} />
                <Route strict path='/map' component={Map} />
            </Layout>
        );
    }
}
