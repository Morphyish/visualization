import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
    return (
        <main>
            <header>
                <h1>Visualization</h1>
            </header>
            <article>
                <ul>
                    <li>
                        <Link to="genealogy">Genealogy</Link>
                    </li>
                </ul>
            </article>
        </main>
    )
}

export default Home
