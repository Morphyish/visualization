import { Fragment, useMemo } from 'react'
import { Chord, Ribbon } from '@visx/chord'
import { Group } from '@visx/group'
import { Arc } from '@visx/shape'
import { cubehelix } from 'd3-color'
import { quantize } from 'd3-interpolate'
import { scaleOrdinal } from 'd3-scale'

type SubgroupSortFn = (a: number, b: number) => number

interface ChordChartProps {
    legend?: string[]
    matrix: number[][]
    height: number;
    width: number;
    centerSize?: number;
    sort?: SubgroupSortFn;
}

function interpolateRainbow(t: number) {
    if (t < 0 || t > 1) t -= Math.floor(t)
    const ts = Math.abs(t - 0.5)
    const h = 360 * t - 100
    const s = 1.5 - 1.5 * ts
    const l = 0.8 - 0.9 * ts
    return cubehelix(h, s, l) + ''
}

const legendGap = 4

function ascending(a: number, b: number): number {
    return b > a ? -1 : b < a ? 1 : b <= a ? 0 : NaN;
}

function ChordChart({ legend, matrix, height, width, centerSize = 20, sort = ascending }: ChordChartProps) {
    const size = Math.min(width, height)
    const outerRadius = size * 0.5 - (centerSize + 10);
    const innerRadius = outerRadius - centerSize;


    const color = useMemo(() => scaleOrdinal(
        [0, matrix.length - 1],
        quantize(interpolateRainbow, matrix.length),
    ), [matrix])

    return innerRadius <= 0 ? null : (
        <Group top={size / 2} left={size / 2}>
            <Chord matrix={matrix} padAngle={0.05} sortSubgroups={sort}>
                {({ chords }) => (
                    <g>
                        {chords.groups.map((group, i) => {
                            const textAngle = (group.startAngle + group.endAngle) / 2 * 180 / Math.PI
                            const transform = `rotate(${textAngle - 90}) translate(${outerRadius + legendGap},0) rotate(${textAngle < 180 ? 0 : 180})`
                            return (
                                <Fragment key={`group-${i}`}>
                                    <Arc
                                        data={group}
                                        innerRadius={innerRadius}
                                        outerRadius={outerRadius}
                                        fill={color(group.index)}
                                    />
                                    {!!legend && group.value > 0 && (
                                        <text
                                            dy=".33em"
                                            fontSize={10}
                                            fontFamily="Arial"
                                            textAnchor={textAngle < 180 ? 'start' : 'end'}
                                            style={{ pointerEvents: 'none' }}
                                            transform={transform}
                                            fill="#000"
                                        >
                                            {legend[group.index]}
                                        </text>
                                    )}
                                </Fragment>
                            )
                        })}
                        {chords.map((chord, i) => (
                            <Ribbon
                                key={`ribbon-${i}`}
                                chord={chord}
                                radius={innerRadius}
                                fill={color(chord.target.index)}
                                fillOpacity={0.75}
                            />
                        ))}
                    </g>
                )}
            </Chord>
        </Group>
    )
}

export default ChordChart
