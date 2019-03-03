import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../images/4041.png';

const Page404 = () => (

    <div>
        <img src={PageNotFound} alt={'Page not found'} style={{
            width: 'auto',
            padding: 'auto',
            height: 'auto',
            display: 'block',
            marginTop: '100px',
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative'
        }} />
        <center>
            <Link to="/" >
                <p style={{ color: 'light blue', }}>
                    {'Return to Home Page'}
                </p>
            </Link>
        </center>
    </div>

);
export default Page404;