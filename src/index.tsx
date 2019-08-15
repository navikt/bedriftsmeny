import React from 'react';
import { render } from 'react-dom';
import Bedriftsmeny from './bedriftsmeny/Bedriftsmeny';
import '../node_modules/nav-frontend-core/less/core.less';

const App = () => (
    <>
        <h1>Utviklingsapp for bedriftsmeny</h1>
        <Bedriftsmeny />
    </>
);

render(<App />, document.getElementById('app'));
