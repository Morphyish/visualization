import { Fragment } from 'react'
import { Group } from '@visx/group'
import { Bar } from '@visx/shape'
import { scaleLinear } from '@visx/scale'

interface Props<Datum> {
    data: Datum[];
    legend?: (row: Datum) => string;
    left: (row: Datum) => number;
    right: (row: Datum) => number;
    height: number;
    width: number;
    colors: [string, string];
    gap?: number;
    middleGap?: number;
    hideLegend?: boolean;
}

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value))
}

function ButterflyChart<Datum>({
    data,
    legend,
    left,
    right,
    height,
    width,
    colors,
    gap = 0,
    middleGap = 50,
    hideLegend = false,
}: Props<Datum>) {
    const barHeight = Math.floor(height / data.length - gap / 2)
    const centerAxis = Math.floor(width / 2)

    const rowSizeMax = max<Datum>(data, (d) => Math.max(left(d), right(d)))
    const xScale = scaleLinear<number>({
        range: [0, height],
        domain: [0, data.length],
    })
    const yScale = scaleLinear<number>({
        range: [0, Math.floor(width / 2)],
        domain: [0, rowSizeMax],
    })

    return barHeight < 1 ? null : (
        <>
            {data.map((row, i) => {
                const leftValue = left(row)
                const rightValue = right(row)

                const offsetTop = xScale(i)
                const leftBarSize = yScale(leftValue)
                const rightBarSize = yScale(rightValue)

                return (
                    <Fragment key={`row-${i}`}>
                        <Group top={offsetTop} left={centerAxis}>
                            <Bar
                                x={hideLegend ? -1 * gap / 2 : -1 * middleGap / 2}
                                width={leftBarSize}
                                height={barHeight}
                                fill={colors[0]}
                                transform={`translate(-${leftBarSize})`}
                            />
                            <Bar
                                x={hideLegend ? gap / 2 : middleGap / 2}
                                width={rightBarSize}
                                height={barHeight}
                                fill={colors[1]}
                            />
                            {!hideLegend && !!legend && (
                                <text
                                    y={Math.floor(9 / 2) + Math.floor(barHeight / 2)}
                                    fontSize={9}
                                    fontFamily="Arial"
                                    textAnchor="middle"
                                    fill="#000"
                                >
                                    {legend(row)}
                                </text>
                            )}
                        </Group>
                    </Fragment>
                )
            })}
        </>
    )
}

export default ButterflyChart
