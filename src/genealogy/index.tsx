import React from 'react'

import FirstNameCloud from './FirstNameCloud'
import OccupationCloud from './OccupationCloud'
import MarriageButterflyChart from './MarriageButterflyChart'
import DeathButterflyChart from './DeathButterflyChart'
import OccupationChordChart from './OccupationChordChart'
import LocationChordChart from './LocationChordChart'
import BirthHeatmap from './BirthHeatmap'
import MarriageHeatmap from './MarriageHeatmap'
import DeathHeatmap from './DeathHeatmap'
import LocationSunburst from './LocationSunburst'
import FamilyTree from './FamilyTree'

function Genealogy() {
    return (
        <main>
            <header>
                <h1>Genealogy</h1>
            </header>
            <article>
                <h2>Family Tree</h2>
                <section>
                    <FamilyTree />
                </section>
            </article>
            <article>
                <h2>Names</h2>
                <section>
                    <FirstNameCloud />
                </section>
            </article>
            <article>
                <h2>Occupations</h2>
                <section>
                    <OccupationCloud />
                    <OccupationChordChart />
                </section>
            </article>
            <article>
                <h2>Place of Birth and Movements</h2>
                <section>
                    <LocationSunburst />
                    <LocationChordChart />
                </section>
            </article>
            <article>
                <h2>Age of Marriage and Death</h2>
                <section>
                    <MarriageButterflyChart />
                    <DeathButterflyChart />
                </section>
            </article>
            <article>
                <h2>Birth, Marriage and Death throughout the year</h2>
                <section>
                    <BirthHeatmap />
                </section>
                <section>
                    <MarriageHeatmap />
                </section>
                <section>
                    <DeathHeatmap />
                </section>
            </article>
        </main>
    )
}

export default Genealogy
