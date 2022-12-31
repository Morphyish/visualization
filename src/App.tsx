import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Home'

const Genealogy = React.lazy(() => import('./genealogy'))

function App() {
    return (
        <React.Suspense fallback={null}>
            <BrowserRouter>
                <Routes>
                    <Route path="/genealogy" element={<Genealogy />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </React.Suspense>
    )
}

export default App
