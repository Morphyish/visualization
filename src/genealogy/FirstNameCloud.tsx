import WordCloud from '../components/WordCloud'
import data from './data/names.json'

const menColors = ['#143059', '#2F6B9A', '#82a6c2']
const womenColors = ['#db6551', '#e6896b', '#e5a186']

function FirstNameCloud() {
    return (
        <>
            <WordCloud data={data.men} size={500} colors={menColors} />
            <WordCloud data={data.women} size={500} colors={womenColors} />
        </>
    )
}

export default FirstNameCloud
