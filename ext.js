const fs = require('fs');

function getFeatureResultSteps(id, projectName) {
    let backgroundSteps = [];
    let scenarioStatus;
    let featureStatus;
    const scenarios = [];
    let scenarioSteps = [];
    let performedTestStatus;
    let featureName;
    const features = [];
    const results = JSON.parse(fs.readFileSync('./teste.json')
        .toString()
        .split('\n')
        .map(line => {
            if (!line.includes('error_message')) {
                return line.trim();
            }
        }).join("\n"));
    results.map(result => {
        featureName = result.name;
        result.elements.map(element => {
            if (element.type === 'background') {
                backgroundSteps = [];
                element.steps.map(step => {
                    backgroundSteps.push({
                        stepDefinition: step.keyword.trim(),
                        stepName: step.name,
                        stepDuration: step.result.duration ? step.result.duration : 0,
                        stepStatus: step.result.status
                    });
                });
            } else if (element.type === 'scenario') {
                scenarioSteps = [];
                element.steps.map(step => {
                    scenarioStatus = step.result.status === 'passed' ? 'passed' : 'failed';
                    scenarioSteps.push({
                        stepDefinition: step.keyword.trim(),
                        stepName: step.name,
                        stepDuration: step.result.duration ? step.result.duration : 0,
                        stepStatus: step.result.status
                    });
                });
                const before = element.before === undefined ? [] : element.before.map(step => {
                    return {
                        stepDefinition: 'Before',
                        stepName: 'Before all steps',
                        stepDuration: step.result.duration ? step.result.duration : 0,
                        stepStatus: step.result.status
                    }
                });
                const after = element.after === undefined ? [] : element.after.map(step => {
                    return {
                        stepDefinition: 'After',
                        stepName: 'After all steps',
                        stepDuration: step.result.duration ? step.result.duration : 0,
                        stepStatus: step.result.status
                    }
                });
                scenarios.push({
                    scenarioName: element.name,
                    scenarioStatus,
                    steps: before.concat(backgroundSteps.concat(scenarioSteps).concat(after))
                });
            }
        });
        featureStatus = scenarios
            .filter(scenario => scenario.scenarioStatus === 'failed')
            .length > 0 ? 'failed' : 'passed';
        features.push({
            featureName,
            featureStatus,
            scenarios
        });
    });
    features.map(feature => feature.scenarios.map(scenario => scenario.steps.map(step => {
        if (step.stepStatus === 'passed') {
            performedTestStatus = 'passed';
        } else if (step.stepStatus === 'skipped' || step.stepStatus === 'failed') {
            performedTestStatus = 'failed';
        }
    })));
    return [{
        id,
        projectName,
        performedTestStatus,
        executionDate: new Date(),
        features
    }]
}

fs.writeFileSync('./testResults.json', JSON.stringify(getFeatureResultSteps(1, 'javac')));
