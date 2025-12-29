import React from 'react';

import AnimatedLogo from '../components/AnimatedLogo.jsx';

export default function Home() {
    return (
        <>
            <h2 style={{ color: 'white' }}>
                Home
            </h2>
            <header className="App-header app-logo-header">
                <AnimatedLogo size={160} />
            </header>
        </>
    );
}