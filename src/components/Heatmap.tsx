import { scaleLinear } from '@visx/scale'
import { HeatmapRect } from '@visx/heatmap'

interface HeatmapProps<ColumnDatum, BinDatum> {
    data: ColumnDatum[];
    bins: (column: ColumnDatum) => BinDatum[];
    count: (bin: BinDatum) => number;
    label?: (column: ColumnDatum) => string;
    height: number;
    width: number;
    colors: [string, string];
}

const gap = 2

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value))
}

function Heatmap<ColumnDatum, BinDatum>({
    data,
    bins,
    count,
    label,
    height,
    width,
    colors,
}: HeatmapProps<ColumnDatum, BinDatum>) {
    const colorMax = max(data, (d) => max(bins(d), count))
    const bucketSizeMax = max(data, (d) => bins(d).length)

    // scales
    const rectColorScale = scaleLinear<string>({
        range: colors,
        domain: [0, colorMax],
    })
    const opacityScale = scaleLinear<number>({
        range: [0.1, 1],
        domain: [0, colorMax],
    })

    const xScale = scaleLinear<number>({
        range: [0, height],
        domain: [0, data.length],
    })
    const yScale = scaleLinear<number>({
        range: [0, width],
        domain: [0, bucketSizeMax],
    })
    const binSize = Math.min(Math.floor(height / data.length), Math.floor(width / bucketSizeMax)) - gap

    return (
        <HeatmapRect<ColumnDatum, BinDatum>
            data={data}
            xScale={(d) => xScale(d) ?? 0}
            yScale={(d) => yScale(d) ?? 0}
            colorScale={rectColorScale}
            opacityScale={opacityScale}
            bins={bins}
            count={count}
            binWidth={binSize}
            binHeight={binSize}
            gap={gap}
        >
            {(heatmap) => (
                <>
                    {!!label && data.map((col, i) => (
                        <text
                            key={`heatmap-label-${i}`}
                            x={-1 * gap}
                            y={xScale(i) + Math.floor(9 / 2) + Math.floor(xScale(1) / 2) - gap}
                            fontSize={9}
                            fontFamily="Arial"
                            textAnchor="end"
                            style={{ pointerEvents: 'none' }}
                            fill="#fff"
                        >
                            {label(col)}
                        </text>
                    ))}
                    {heatmap.map((heatmapBins) =>
                        heatmapBins.map((bin) => bin.width > 0 && bin.height > 0 && (
                            <rect
                                key={`heatmap-rect-${bin.row}-${bin.column}`}
                                width={bin.width}
                                height={bin.height}
                                x={bin.y}
                                y={bin.x}
                                fill={bin.color}
                                fillOpacity={bin.opacity}
                                // @ts-expect-error
                                onClick={() => alert(`${bin.datum.label}`)}
                            />
                        )),
                    )}
                </>
            )}
        </HeatmapRect>
    )
}

export default Heatmap
