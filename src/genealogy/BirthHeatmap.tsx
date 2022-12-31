import { Group } from '@visx/group'

import Card from '../components/Card'
import Heatmap from '../components/Heatmap'
import birthData from './data/birth-heatmap.json'

interface Day {
    label: string;
    count: number;
}

interface Month {
    label: string;
    days: Day[];
}

const lowlightColor = '#163832'
const highlightColor = '#8eb69b'
const background = '#28272c'

// accessors
const days = (d: Month) => d.days
const count = (d: Day) => d.count
const label = (d: Month) => d.label

function BirthHeatmap() {
    return (
        <Card ratio={1/4} color={background}>
            {({ innerHeight, innerWidth, top, left }) => (
                <Group top={top} left={left}>
                    <Heatmap<Month, Day>
                        data={birthData}
                        bins={days}
                        count={count}
                        label={label}
                        height={innerHeight}
                        width={innerWidth}
                        colors={[lowlightColor, highlightColor]}
                    />
                </Group>
            )}
        </Card>
    )
}

export default BirthHeatmap
