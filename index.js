const fs = require('fs')
const Shell = require('powershell')

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
    if (scenarios.length == 1) {
        const init = lines.indexOf(`Scenario: ${scenarios[0]}`)
        const name = scenarios[0]
        let steps = lines.slice(init + 1, lines.length)
        return {
            name,
            steps
        }
    } else {
        let j = 1;
        let listScenarios = []
        for (let i = 0; i < scenarios.length; i++) {
            if (j < scenarios.length) {
                const init = lines.indexOf(`Scenario: ${scenarios[i]}`)
                const finish = lines.indexOf(`Scenario: ${scenarios[j]}`)
                const name = scenarios[i]
                let steps = lines.slice(init + 1, finish)
                listScenarios.push({
                    name,
                    steps
                })
            } else if (i == scenarios.length - 1) {
                const init = lines.indexOf(`Scenario: ${scenarios[i]}`)
                const finish = lines.indexOf(`Scenario: ${scenarios[j]}`)
                const name = scenarios[i]
                let steps = lines.slice(init + 1, lines.length)
                listScenarios.push({
                    name,
                    steps
                })
            }
            j++
        }

        return listScenarios;
    }
}

// let name = getFeatureName('teste.feature')
// let tags = getFeatureTags('teste.feature')
// let scenarios = getFeatureScenarios('teste.feature')
// let scenarioSteps = getScenarioSteps('teste.feature')

// fs.writeFileSync('./tudo.json', JSON.stringify({
//     name,
//     tags,
//     scenarios,
//     scenarioSteps: [scenarioSteps]
// }))

let features = []

fs.readdirSync('./features').map(file => {
    let name = getFeatureName(file)
    let tags = getFeatureTags(file)
    let scenarios = getFeatureScenarios(file)
    let scenarioSteps = getScenarioSteps(file)
    let featurePath = `./features/${file}`
    const featureFileName = `${file}`;
    features.push({
        name,
        scenarioSteps
    })
})

fs.writeFileSync('./tudo.json', JSON.stringify(
    features
))


let tags = ['apresentacao']

// tags = tags.map(tag => `--tags @${tag}`);
// console.log(tags.join(' '));

// let ps = new Shell(`rm -r ./novo-archetype`)

// ps.on("error", err => {
//     console.error(err);
// });

// // Stdout
// ps.on("output", data => {
//     console.log(data);
//     console.log('success');
// });

// // Stderr
// ps.on("error-output", data => {
//     console.error(data);
//     console.log('error');
// });

// // End
// ps.on("end", code => {
//     console.log(code);
// });

// var rmdirRecursiveSync = require('rmdir-recursive').sync;
 
// var dir = './novo-archetype';
// try {
//   rmdirRecursiveSync(dir);
//   console.log(dir + ' removed');
// } catch (err) {
//   console.log(dir + ' cant removed with status ' + err);
// }



let testResults = JSON.parse(fs.readFileSync('./testResults.json'));

// fs.writeFileSync('./teste2.json', JSON.stringify(JSON.parse(json)));
