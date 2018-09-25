import Pearl from '@ashurson/pearl';
import Introduction from "../../components/introduction";
import SelectFiles from "../../components/select_files/summary";
import SelectFilesLegacy from "../../components/select_files/legacy";
import SelectFilesTarget from "../../components/select_files/target";
import FieldsSummary from "../../components/fields/summary";
import FieldsLegacy from "../../components/fields/legacy";
import FieldsTarget from "../../components/fields/target";


export default class StepPearl extends Pearl {
    constructor() {
        super('StepPearl', function () {
            this.state = {
                steps: [
                    {
                        title: 'Introduction',
                        component: Introduction,
                        route: '/',
                        isComplete: false,
                        navigationAllowed: true
                    },
                    {
                        title: 'Files',
                        route: '/files',
                        substeps: [
                            {
                                title: 'Summary',
                                component: SelectFiles,
                                route: '/summary',
                                isComplete: false,
                                navigationAllowed: false
                            },
                            {
                                title: 'Legacy',
                                component: SelectFilesLegacy,
                                route: '/legacy',
                                isComplete: false,
                                navigationAllowed: false
                            },
                            {
                                title: 'Target',
                                component: SelectFilesTarget,
                                route: '/target',
                                isComplete: false,
                                navigationAllowed: false
                            }
                        ]
                    },
                    {
                        title: 'Fields',
                        route: '/fields',
                        substeps: [
                            {
                                title: 'Summary',
                                component: FieldsSummary,
                                route: '/summary',
                                isComplete: false,
                                navigationAllowed: false
                            },
                            {
                                title: 'Legacy',
                                component: FieldsLegacy,
                                route: '/legacy',
                                isComplete: false,
                                navigationAllowed: false
                            },
                            {
                                title: 'Target',
                                component: FieldsTarget,
                                route: '/target',
                                isComplete: false,
                                navigationAllowed: false
                            }
                        ]
                    }
                ]
            };
            this.getNextStep = function (index, subindex) {
                if (subindex !== undefined) {
                    if (this.state.steps[index].substeps.length - 1 === subindex) {
                        return [index + 1, 0];
                    } else {
                        return [index, subindex + 1];
                    }
                } else {
                    return [index + 1, 0];
                }
            };
            this.getPrevStep = function (index, subindex) {
                if (subindex !== undefined) {
                    if (subindex === 0) {
                        return [index - 1, 0];
                    } else {
                        return [index, subindex - 1];
                    }
                } else {
                    return [index - 1, 0];
                }
            };
            this.markComplete = function (history, index, subindex) {
                const newState = Object.assign({}, this.state);

                // mark complete
                if (subindex !== undefined) {
                    newState.steps[index].substeps[subindex].isComplete = true;
                    // last substep makes entire step complete
                    if (subindex === newState.steps[index].substeps.length - 1) {
                        newState.steps[index].isComplete = true;
                    }
                } else {
                    newState.steps[index].isComplete = true;
                }

                // allow navigation
                const nextStep = this.getNextStep(index, subindex);
                if (newState.steps[nextStep[0]]) {
                    if (newState.steps[nextStep[0]].substeps) {
                        newState.steps[nextStep[0]].substeps[nextStep[1]].navigationAllowed = true;
                    } else {
                        newState.steps[nextStep[0]].navigationAllowed = true;
                    }
                }

                // navigate
                if (newState.steps[nextStep[0]]) {
                    if (newState.steps[nextStep[0]].substeps) {
                        history.push(newState.steps[nextStep[0]].route + newState.steps[nextStep[0]].substeps[nextStep[1]].route);
                    } else {
                        history.push(newState.steps[nextStep[0]].route);
                    }
                }
                this.setState(newState);
            };
            this.unmarkComplete = function (history, index, subindex) {
                const newState = Object.assign({}, this.state);

                // disallow navigation
                if (subindex !== undefined) {
                    newState.steps[index].substeps[subindex].navigationAllowed = false;
                } else {
                    newState.steps[index].navigationAllowed = false;
                }

                // mark previous as incomplete
                const prevStep = this.getPrevStep(index, subindex);
                if (newState.steps[prevStep[0]].substeps) {
                    newState.steps[prevStep[0]].substeps[prevStep[1]].isComplete = false;
                }
                newState.steps[prevStep[0]].isComplete = false;

                // navigate
                if (newState.steps[prevStep[0]]) {
                    if (newState.steps[prevStep[0]].substeps) {
                        history.push(newState.steps[prevStep[0]].route + newState.steps[prevStep[0]].substeps[prevStep[1]].route);
                    } else {
                        history.push(newState.steps[prevStep[0]].route);
                    }
                }

                this.setState(newState);
            };
            this.setActiveStep = function (step) {
                if (step.substeps !== undefined) {
                    if (step.substeps[0].navigationAllowed) {
                        return step.route + step.substeps[0].route;
                    } else {
                        return null;
                    }
                } else {
                    return step.navigationAllowed ? step.route : null;
                }
            }
        });
    }
}