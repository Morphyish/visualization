import WordCloud from '../components/WordCloud'
import data from './data/occupation.json'

const colors = ['#163832', '#235347', '#8eb69b']

function OccupationCloud() {
    return <WordCloud data={data} size={500} colors={colors} />
}

export default OccupationCloud
