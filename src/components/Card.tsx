import { ReactNode } from 'react'
import { ParentSize } from '@visx/responsive'

import Background from './Background'

import styles from './Card.module.css'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }

interface CardProps {
    size?: number;
    ratio?: number;
    color: string;
    children: (Sizes: { innerHeight: number; innerWidth: number; top: number; left: number; }) => ReactNode;
}

function Card({ size, ratio = 1, color, children }: CardProps) {
    return (
        <ParentSize className={styles.card} style={{ width: size }} debounceTime={10}>
            {({ width: cardWidth }) => {
                const cardHeight = cardWidth * ratio
                const innerHeight = cardHeight - margin.top - margin.bottom
                const innerWidth = cardWidth - margin.left - margin.right

                return cardWidth < 10 ? null : (
                    <svg width={cardWidth} height={cardHeight}>
                        <Background height={cardHeight} width={cardWidth} color={color} />
                        {children({ innerHeight, innerWidth, ...margin })}
                    </svg>
                )
            }}
        </ParentSize>
    )
}

export default Card
