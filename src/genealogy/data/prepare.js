'use strict'

const fs = require('fs')

let rawdata = fs.readFileSync('raw.json')
let data = JSON.parse(rawdata)

const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const daysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const families = data['FAM']
const individuals = data['INDI']

function indexIndividuals() {
    return individuals.reduce((acc, individual) => ({
        ...acc,
        [individual['ID']]: individual,
    }), {})
}

function indexFamilies() {
    return families.reduce((acc, family) => ({
        ...acc,
        [family['ID']]: family,
    }), {})
}

function getDailyHeatmap() {
    return daysPerMonth.map((days, i) => ({
        label: monthNames[i],
        days: new Array(days).fill(null).map((_, j) => ({
            label: j + 1 + '',
            count: 0,
        })),
    }))
}

function getAgeChart(step = 5) {
    return new Array(Math.ceil(100 / step)).fill(null).map((_, i) => ({
        age: `${i * step + 1} - ${i * step + step}`,
        men: 0,
        women: 0,
    }))
}

function cleanOccupations(occupation) {
    if (!occupation) return []

    return occupation
        .split('-') // split based on -
        .map(o => o.split(',')) // split based on ,
        .flat() // flatten all sub arrays from the second split
        .map(o => o.trim()) // Remove extra spaces
        .filter(o => !!o) // Remove all empty data
        .map(o => o.toLocaleLowerCase()) // Normalize data
}

function getOccupationFrequency() {
    const freqMap = {}

    for (const individual of individuals) {
        const occupations = cleanOccupations(individual['OCCU'])
        occupations.map(occupation => {
            if (!freqMap[occupation]) freqMap[occupation] = 0
            freqMap[occupation] += 1
        })
    }

    const freqData = Object.keys(freqMap).map((occupation) => ({ text: occupation, value: freqMap[occupation] }))

    fs.writeFileSync('occupation.json', JSON.stringify(freqData))
}

function getNameFrequency() {
    const freqMapMen = {}
    const freqMapWomen = {}

    for (const individual of individuals) {
        const [firstName] = individual['NAME'].split(' ')
        if (individual['SEX'] === 'F') {
            if (!freqMapWomen[firstName]) freqMapWomen[firstName] = 0
            freqMapWomen[firstName] += 1
        } else {
            if (!freqMapMen[firstName]) freqMapMen[firstName] = 0
            freqMapMen[firstName] += 1
        }
    }

    const freqDataMen = Object.keys(freqMapMen).map((firstName) => ({ text: firstName, value: freqMapMen[firstName] }))
    const freqDataWomen = Object.keys(freqMapWomen).map((firstName) => ({
        text: firstName,
        value: freqMapWomen[firstName],
    }))

    fs.writeFileSync('names.json', JSON.stringify({
        men: freqDataMen,
        women: freqDataWomen,
    }))
}

function getFamilyTreeOf(individual, individuals, families) {
    if (!individual) return null

    const parentFamilyId = individual['FAMC']
    if (!parentFamilyId) return null

    const parentFamily = families[parentFamilyId]
    if (!parentFamily) return null

    const children = [
        getFamilyTreeOf(individuals[parentFamily['HUSB']], individuals, families),
        getFamilyTreeOf(individuals[parentFamily['WIFE']], individuals, families),
    ]

    const cleanedChildren = children.filter(i => !!i)

    const [firstName] = individual['NAME'].split(' ')
    const lastName = individual['NAME'].match(/\/(.+)\//)

    return {
        ...individual,
        FIRST_NAME: firstName,
        LAST_NAME: lastName[1],
        children: cleanedChildren,
    }
}

function reconstructFamilyTree() {
    const indexedIndividuals = indexIndividuals()
    const indexedFamilies = indexFamilies()

    const familyTree = getFamilyTreeOf(individuals[0], indexedIndividuals, indexedFamilies)

    fs.writeFileSync('family-tree.json', JSON.stringify(familyTree))
}

function cleanBirthLocation(location) {
    if (!location) return null
    return location
        .split(',') // split data
        .map((l, i) => i === 0 ? l.split(' - ') : l) // split the first value to separate lieu dits from towns
        .flat() // flatten all sub arrays from the second split
        .map(l => l.trim()) // remove extra spaces
        .reverse() // reverse to have wide to narrow data
}

function getBirthLocations() {
    const rawLocations = []

    for (const individual of individuals) {
        const birthLocation = cleanBirthLocation(individual['BIRT']?.['PLAC'])
        if (birthLocation) rawLocations.push(birthLocation)
    }

    const weightedLocation = {
        children: [],
    }

    rawLocations.forEach((location) => {
        let temp = weightedLocation

        location.forEach((segment, i, arr) => {
            if (!isNaN(segment) && !isNaN(parseFloat(segment))) return

            let existingSegment = temp.children.find(c => c.name === segment)

            if (!existingSegment) {
                existingSegment = {
                    name: segment,
                    value: 0,
                    children: [],
                }
                temp.children.push(existingSegment)
            }

            if (i === arr.length - 1) {
                existingSegment.value += 1
            }
            temp = existingSegment
        })
    })

    fs.writeFileSync('birth-locations.json', JSON.stringify(weightedLocation.children[0]))
}

function getBirthHeatmap() {
    const heatmap = getDailyHeatmap()

    individuals.forEach(individual => {
        if (typeof individual['BIRT'] === 'object') {
            const date = individual['BIRT']['DATE']
            const [_, month, day] = date.split('-')
            if (month && day && heatmap[parseInt(month, 10) - 1]?.days[parseInt(day, 10) - 1]) {
                heatmap[parseInt(month, 10) - 1].days[parseInt(day, 10) - 1].count += 1
            }
        }
    })

    fs.writeFileSync('birth-heatmap.json', JSON.stringify(heatmap))
}

function getMarriageHeatmap() {
    const heatmap = getDailyHeatmap()

    families.forEach(family => {
        if (typeof family['MARR'] === 'object') {
            const date = family['MARR']['DATE']
            const [_, month, day] = date.split('-')
            if (month && day && heatmap[parseInt(month, 10) - 1]?.days[parseInt(day, 10) - 1]) {
                heatmap[parseInt(month, 10) - 1].days[parseInt(day, 10) - 1].count += 1
            }
        }
    })

    fs.writeFileSync('marriage-heatmap.json', JSON.stringify(heatmap))
}

function getDeathHeatmap() {
    const heatmap = getDailyHeatmap()

    individuals.forEach(individual => {
        if (typeof individual['DEAT'] === 'object') {
            const date = individual['DEAT']['DATE']
            const [_, month, day] = date.split('-')
            if (month && day && heatmap[parseInt(month, 10) - 1]?.days[parseInt(day, 10) - 1]) {
                heatmap[parseInt(month, 10) - 1].days[parseInt(day, 10) - 1].count += 1
            }
        }
    })

    fs.writeFileSync('death-heatmap.json', JSON.stringify(heatmap))
}

// Butterfly chart
function getAgeOfMarriagePerSexFrequency() {
    const step = 2
    const indexedFamilies = indexFamilies()
    const ageChart = getAgeChart(step)

    individuals.forEach(individual => {
        const family = indexedFamilies[individual['FAMS']]
        if (typeof individual['BIRT'] === 'object' && family && typeof family['MARR'] === 'object') {
            const birthDate = individual['BIRT']['DATE']
            const [birthYear] = birthDate.split('-')
            const marriageDate = family['MARR']['DATE']
            const [marriageYear] = marriageDate.split('-')


            if (birthYear && marriageYear) {
                const age = parseInt(marriageYear, 10) - parseInt(birthYear, 10)
                const index = (age - (age % step)) / step
                if (ageChart[index]) {
                    if (individual['SEX'] === 'F') ageChart[index].women += 1
                    else ageChart[index].men += 1
                }
            }
        }
    })

    fs.writeFileSync('age-of-marriage-chart.json', JSON.stringify(ageChart))
}

// Butterfly chart
function getAgeOfDeathPerSexFrequency() {
    const step = 2
    const ageChart = getAgeChart(step)

    individuals.forEach(individual => {
        if (typeof individual['BIRT'] === 'object' && typeof individual['DEAT'] === 'object') {
            const birthDate = individual['BIRT']['DATE']
            const [birthYear] = birthDate.split('-')
            const deathDate = individual['DEAT']['DATE']
            const [deathYear] = deathDate.split('-')

            if (birthYear && deathYear) {
                const age = parseInt(deathYear, 10) - parseInt(birthYear, 10)
                const index = (age - (age % step)) / step
                if (ageChart[index]) {
                    if (individual['SEX'] === 'F') ageChart[index].women += 1
                    else ageChart[index].men += 1
                }
            }
        }
    })

    fs.writeFileSync('age-of-death-chart.json', JSON.stringify(ageChart))
}

// Chord chart
function getOccupationMatrix() {
    const indexedIndividuals = indexIndividuals()
    const occupations = []

    for (const individual of individuals) {
        const individualOccupations = cleanOccupations(individual['OCCU'])
        individualOccupations.map(occupation => {
            if (!occupations.includes(occupation)) occupations.push(occupation)
        })
    }

    const links = []

    for (const family of families) {
        const husband = indexedIndividuals[family['HUSB']]
        const wife = indexedIndividuals[family['WIFE']]
        if (husband && wife) {
            const husbandOccupations = cleanOccupations(husband['OCCU'])
            const wifeOccupations = cleanOccupations(wife['OCCU'])
            husbandOccupations.forEach((husbandOccupation) => {
                wifeOccupations.forEach((wifeOccupation) => {
                    links.push({
                        source: husbandOccupation,
                        target: wifeOccupation,
                    })
                })
            })
        }
    }

    const index = new Map(occupations.map((occupation, i) => [occupation, i]))
    const matrix = Array.from(index, () => new Array(occupations.length).fill(0))
    for (const { source, target } of links) {
        matrix[index.get(source)][index.get(target)] += 1
        matrix[index.get(target)][index.get(source)] += 1
    }

    fs.writeFileSync('linked-occupation.json', JSON.stringify({
        labels: occupations,
        matrix,
    }))
}

function getCities(addresses, cityIndex) {
    const cities = addresses
        .map(rawLocation => rawLocation[cityIndex]) // get cities
        .filter(l => !!l) // remove undefined values
    return [...new Set(cities)] // remove duplicates
}

// Chord chart
function getLocationMatrix() {
    const indexedIndividuals = indexIndividuals()
    const cityIndex = 4
    const rawLocations = []

    for (const individual of individuals) {
        const birthLocation = cleanBirthLocation(individual['BIRT']?.['PLAC'])
        if (birthLocation) rawLocations.push(birthLocation)
    }

    const locations = getCities(rawLocations, cityIndex)

    const links = []

    for (const family of families) {
        const husband = indexedIndividuals[family['HUSB']]
        const wife = indexedIndividuals[family['WIFE']]
        if (husband && wife) {
            const husbandLocation = cleanBirthLocation(husband['BIRT']?.['PLAC'])
            const wifeLocation = cleanBirthLocation(wife['BIRT']?.['PLAC'])
            const husbandCity = husbandLocation?.[cityIndex]
            const wifeCity = wifeLocation?.[cityIndex]
            if (husbandCity && wifeCity) {
                links.push({
                    source: husbandCity,
                    target: wifeCity,
                })
            }
        }
    }

    const index = new Map(locations.map((location, i) => [location, i]))
    const matrix = Array.from(index, () => new Array(locations.length).fill(0))
    for (const { source, target } of links) {
        matrix[index.get(source)][index.get(target)] += 1
        matrix[index.get(target)][index.get(source)] += 1
    }

    fs.writeFileSync('linked-location.json', JSON.stringify({
        labels: locations,
        matrix,
    }))
}

getOccupationFrequency()
getNameFrequency()
reconstructFamilyTree()
getBirthLocations()
getBirthHeatmap()
getMarriageHeatmap()
getDeathHeatmap()
getAgeOfMarriagePerSexFrequency()
getAgeOfDeathPerSexFrequency()
getOccupationMatrix()
getLocationMatrix()
