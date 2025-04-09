import React from 'react';
import logo from '../assets/images/logo.png';

const Header = () => (
    <header>
        <img src={logo} alt="Zero 2 Hero Logo" className="logo" />
        <h1>Zero 2 Hero</h1>
    </header>
);

export default Header;