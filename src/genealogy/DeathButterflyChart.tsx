import { Group } from '@visx/group'

import ButterflyChart from '../components/ButterflyChart'
import Card from '../components/Card'
import chartData from './data/age-of-death-chart.json'

const menColor = '#143059'
const womenColor = '#db6551'
const background = '#e4e3d8'

interface AgeFrequency {
    age: string;
    men: number;
    women: number;
}

// accessors
const age = (d: AgeFrequency) => d.age
const men = (d: AgeFrequency) => d.men
const women = (d: AgeFrequency) => d.women

function DeathButterflyChart() {
    return (
        <Card color={background}>
            {({ innerHeight, innerWidth, top, left }) => (
                <Group height={innerHeight} width={innerWidth} top={top} left={left}>
                    <ButterflyChart
                        data={chartData}
                        legend={(d) => age(d) ?? ''}
                        left={(d) => men(d) ?? 0}
                        right={(d) => women(d) ?? 0}
                        height={innerHeight}
                        width={innerWidth}
                        colors={[menColor, womenColor]}
                        gap={4}
                    />
                </Group>
            )}
        </Card>
    )
}

export default DeathButterflyChart
