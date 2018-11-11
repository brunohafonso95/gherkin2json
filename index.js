const fs = require('fs')

function getFeatureName(file) {
    let featureName;
    fs.readFileSync(`./features/${file}`)
        .toString()
        .split('\n')
        .map(line => {
            if (line.includes('Feature:')) {
                featureName = line.split(':')[1].trim()
            }
        })

    return featureName;
}

function getFeatureTags(file) {
    let tags = []
    fs.readFileSync(`./features/${file}`)
        .toString()
        .split('\n')
        .map(line => {
            if (line.includes('@')) {
                tags.push(line.replace('@', '').trim())
            }
        })

    return tags;
}

function getFeatureScenarios(file) {
    let scenarios = []
    fs.readFileSync(`./features/${file}`)
        .toString()
        .split('\n')
        .map(line => {
            if (line.includes('Scenario:')) {
                scenarios.push(line.split(':')[1].trim())
            }
        })

    return scenarios;
}

function getLinesFile(file) {
    return fs.readFileSync(`./features/${file}`)
        .toString()
        .split('\n')
        .filter(line => line.trim() != '')
        .map(line => line.trim())
}

function getScenarioSteps(file) {
    const scenarios = getFeatureScenarios(file)
    const lines = getLinesFile(file)
    if(scenarios.length == 1) {    
        const init = lines.indexOf(`Scenario: ${scenarios[0]}`)
        const name = scenarios[0]
        let steps = lines.slice(init + 1, lines.length)
        return {
            scenario: {  name, steps } 
        }
    } 
}

// let name = getFeatureName('teste.feature')
// let tags = getFeatureTags('teste.feature')
// let scenarios = getFeatureScenarios('teste.feature')
// let scenarioSteps = getScenarioSteps('teste.feature')

// fs.writeFileSync('./tudo.json', JSON.stringify(
//     {
//         name,
//         tags,
//         scenarios,
//         scenarioSteps: [scenarioSteps] 
//     }
// ))

let features = []

fs.readdirSync('./features').map(file => {
    let name = getFeatureName(file)
    let tags = getFeatureTags(file)
    let scenarios = getFeatureScenarios(file)
    let scenarioSteps = getScenarioSteps(file)
    features.push({
        name,
        tags,
        scenarios,
        scenarioSteps: [scenarioSteps] 
    })
})

fs.writeFileSync('./tudo.json', JSON.stringify(
    features
))









