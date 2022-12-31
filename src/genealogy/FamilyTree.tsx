import { Group } from '@visx/group'
import { Tree, hierarchy } from '@visx/hierarchy'
import { LinkRadialStep } from '@visx/shape'
import type { HierarchyPointNode } from '@visx/hierarchy/lib/types'
import { pointRadial } from 'd3-shape'

import Card from '../components/Card'
import useForceUpdate from '../useForceUpdate'
import rawTree from './data/family-tree.json'

const peach = '#fd9b93'
const blue = '#03c0dc'
const lightpurple = '#374469'
const white = '#ffffff'
const background = '#272b4d'

interface TreeNode {
    ID: string;
    NAME: string;
    FIRST_NAME: string;
    LAST_NAME: string;
    SEX: string;
    isCollapsed?: boolean;
    children: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

function Node({ node, forceUpdate }: { node: HierarchyNode, forceUpdate: () => void }) {
    const width = 60
    const height = 20
    const centerX = -width / 2
    const centerY = -height / 2
    const isRoot = node.depth === 0
    const hasHiddenBranches = !!node.data.children?.length && node.data.isCollapsed

    const [radialX, radialY] = pointRadial(node.x, node.y)

    const handleOnClick = () => {
        if (!isRoot) {
            node.data.isCollapsed = !node.data.isCollapsed
            forceUpdate()
        }
    }

    return (
        <Group top={radialY} left={radialX}>
            <rect
                height={height}
                width={width}
                y={centerY}
                x={centerX}
                fill={background}
                stroke={node.data['SEX'] === 'F' ? peach : blue}
                strokeWidth={1}
                strokeDasharray={hasHiddenBranches ? '2,2' : '0'}
                strokeOpacity={hasHiddenBranches ? 0.6 : 1}
                onClick={handleOnClick}
            />
            <text
                dy=".33em"
                fontSize={9}
                fontFamily="Arial"
                textAnchor="middle"
                style={{ pointerEvents: 'none' }}
                fill={white}
            >
                <tspan x="0" dy="-.15em">{node.data['FIRST_NAME']}</tspan>
                <tspan x="0" dy="1em">{node.data['LAST_NAME']}</tspan>
            </text>
        </Group>
    )
}

function FamilyTree() {
    const forceUpdate = useForceUpdate()

    return (
        <Card color={background}>
            {({ innerWidth, innerHeight }) => {
                const size = 2 * Math.PI
                const radius = Math.min(innerWidth, innerHeight) / 2

                const origin = {
                    x: innerWidth / 2,
                    y: innerHeight / 2,
                }

                return (
                    <Tree<TreeNode>
                        root={hierarchy<TreeNode>(rawTree, (d) => (d.isCollapsed ? null : d.children))}
                        size={[size, radius]}
                        separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
                    >
                        {(tree) => (
                            <Group top={origin.y} left={origin.x}>
                                {tree.links().map((link, i) => (
                                    <LinkRadialStep
                                        key={`link-${i}`}
                                        data={link}
                                        stroke={lightpurple}
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                ))}
                                {tree.descendants().map((node, i) => (
                                    <Node key={`node-${i}`} node={node} forceUpdate={forceUpdate} />
                                ))}
                            </Group>
                        )}
                    </Tree>
                )
            }}
        </Card>
    )
}

export default FamilyTree
