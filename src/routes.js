import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../src/pages/Home';
import MapPage from '../src/pages/MapPage';
import Details from '../src/pages/Details';
import About from '../src/pages/About';
import Help from '../src/pages/Help';


const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact={true} component={Home} />
                <Route path='/Map' exact={true} component={MapPage} />
                <Route path='/Details' exact={true} component={Details} />
                <Route path='/About' exact={true} component={About} />
                <Route path='/Help' exact={true} component={Help} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes