import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import About from './components/About';
import TeamRoster from './components/TeamRoster';
import MatchResults from './components/MatchResults';
import Sponsorship from './components/Sponsorship';
import Footer from './components/Footer';


const App = () => (
    <div>
        <Header />
        <About />
        <TeamRoster />
        <MatchResults />
        <Sponsorship />
        <Footer />
    </div>
);

export default App;