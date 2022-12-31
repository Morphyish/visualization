import { Group } from '@visx/group'

import Card from '../components/Card'
import ChordChart from '../components/ChordChart'
import linkedData from './data/linked-location.json'

const background = '#faf7e9'

const { labels, matrix } = linkedData

function LocationChordChart() {
    return (
        <Card color={background}>
            {({ innerWidth, innerHeight, top, left }) => (
                <Group top={top} left={left}>
                    <ChordChart
                        matrix={matrix}
                        legend={labels}
                        height={innerHeight}
                        width={innerWidth}
                    />
                </Group>
            )}
        </Card>
    )
}

export default LocationChordChart
