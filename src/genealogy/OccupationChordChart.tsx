import { Group } from '@visx/group'

import Card from '../components/Card'
import ChordChart from '../components/ChordChart'
import linkedData from './data/linked-occupation.json'

const background = '#eaedff'

const { labels, matrix } = linkedData

function OccupationChordChart() {
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

export default OccupationChordChart
