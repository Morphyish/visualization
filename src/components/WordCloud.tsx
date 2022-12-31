import { scaleLog } from '@visx/scale'
import { Wordcloud } from '@visx/wordcloud'
import { Text } from '@visx/text'
import { ParentSize } from '@visx/responsive'

import Background from './Background'
import styles from './Card.module.css'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }

interface WordData {
    text: string;
    value: number;
}

interface WordCloudProps {
    data: WordData[];
    size?: number;
    ratio?: number;
    colors: string[];
}

const background = '#eaedff'

const fixedValueGenerator = () => 0.5

function WordCloud({ data, size, ratio = 1, colors }: WordCloudProps) {
    const fontScale = scaleLog({
        domain: [Math.min(...data.map((w) => w.value)), Math.max(...data.map((w) => w.value))],
        range: [10, 100],
    })
    const fontSizeSetter = (datum: WordData) => fontScale(datum.value)

    return (
        <ParentSize className={styles.card} style={{ width: size }} debounceTime={10}>
            {({ width: cardWidth }) => {
                const cardHeight = cardWidth * ratio
                const innerHeight = cardHeight - margin.top - margin.bottom
                const innerWidth = cardWidth - margin.left - margin.right

                return cardWidth < 10 ? null : (
                    <Wordcloud<WordData>
                        width={innerWidth}
                        height={innerHeight}
                        words={data}
                        fontSize={fontSizeSetter}
                        font="Impact"
                        padding={2}
                        spiral="rectangular"
                        rotate={0}
                        random={fixedValueGenerator}
                    >
                        {(cloudWords) => (
                            <>
                                <Background width={cardWidth} height={cardHeight} color={background}
                                            transform={`translate(-${innerWidth / 2}, -${innerHeight / 2})`} />
                                {cloudWords.map((w, i) => (
                                    <Text
                                        key={w.text}
                                        fill={colors[i % colors.length]}
                                        textAnchor="middle"
                                        transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                                        fontSize={w.size}
                                        fontFamily={w.font}
                                    >
                                        {w.text}
                                    </Text>
                                ))}
                            </>
                        )
                        }
                    </Wordcloud>
                )
            }}
        </ParentSize>
    )
}

export default WordCloud
