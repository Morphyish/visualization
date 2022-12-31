import { useCallback, useState } from 'react'
import { Group } from '@visx/group'
import { Arc } from '@visx/shape'
import { hierarchy, Partition } from '@visx/hierarchy'
import { quantize } from 'd3-interpolate'
import { cubehelix } from 'd3-color'
import { scaleOrdinal } from 'd3-scale'
import type { HierarchyRectangularNode } from '@visx/hierarchy/lib/types'

import Card from '../components/Card'
import root from './data/birth-locations.json'

const background = '#faf7e9'

interface LocationNode {
    name: string;
    value: number;
    isCollapsed?: boolean;
    children: this[];
}

function interpolateRainbow(t: number) {
    if (t < 0 || t > 1) t -= Math.floor(t)
    const ts = Math.abs(t - 0.5)
    const h = 360 * t - 100
    const s = 1.5 - 1.5 * ts
    const l = 0.8 - 0.9 * ts
    return cubehelix(h, s, l) + ''
}

const color = scaleOrdinal(quantize(interpolateRainbow, 50))

function setColorDomains(node: LocationNode) {
    if (node) color(node.name)
    node.children?.forEach(setColorDomains)
}

setColorDomains(root)

function LabelledArc<T extends HierarchyRectangularNode<LocationNode>>({
    node,
    onClick,
}: { node: T, onClick: () => void }) {
    const textAngle = (node.x0 + node.x1) / 2 * 180 / Math.PI
    const radiusCenter = (node.y1 - node.y0) / 2 + node.y0
    const transform = `rotate(${textAngle - 90}) translate(${radiusCenter},0) rotate(${textAngle < 180 ? 0 : 180})`

    return (
        <>
            <Arc
                data={node}
                innerRadius={node.y0}
                outerRadius={node.y1}
                startAngle={node.x0}
                endAngle={node.x1}
                fill={node.depth === 0 ? background : color(node.data.name)}
                stroke={background}
                strokeWidth={1}
                style={{ cursor: !node.children ? 'default' : 'pointer' }}
                onClick={onClick}
            />
            {node.depth !== 0 && (
                <text
                    dy=".33em"
                    fontSize={10}
                    fontFamily="Arial"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                    transform={transform}
                    fill="#000"
                >
                    {node.data.name}
                </text>
            )}
        </>
    )
}

function LocationSunburst() {
    const [currentRoot, setCurrentRoot] = useState<LocationNode>(root)

    const updateRoot = useCallback((node: HierarchyRectangularNode<LocationNode>) => () => {
        if (node.depth === 0) {
            setCurrentRoot(root)
        } else if (node.children) {
            setCurrentRoot(node.data)
        }
    }, [])

    return (
        <Card color={background}>
            {({ innerWidth, innerHeight, top, left }) => {
                const size = 2 * Math.PI
                const radius = Math.min(innerWidth, innerHeight) / 2

                const origin = {
                    x: innerWidth / 2,
                    y: innerHeight / 2,
                }

                return (
                    <Group top={top} left={left}>
                        <Partition
                            root={hierarchy<LocationNode>(currentRoot).sum((d) => d.value).sort((a, b) => (b.value ?? 0) - (a.value ?? 0))}
                            size={[size, radius]}
                        >
                            {(data) => (
                                <Group top={origin.y} left={origin.x}>
                                    {data.descendants().map((node) => (
                                        <LabelledArc key={node.data.name} node={node} onClick={updateRoot(node)} />
                                    ))}
                                </Group>
                            )}
                        </Partition>
                    </Group>
                )
            }}
        </Card>
    )
}

export default LocationSunburst
