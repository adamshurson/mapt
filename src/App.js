import React from 'react';
import {Route, Link, withRouter} from "react-router-dom";
import './App.css';
import './tailwind.css';
import Loader from "./components/loader";
import logo from "./logo.svg";
import loading from "./logo-loading.svg";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import WindowMenu from "./components/windowmenu";
import StepPearl from "./pearls/step";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(fas);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isLoading: false,
            isMounted: false,
            steps: []
        };
    }

    componentDidMount() {
        this.StepPearl = new StepPearl();
        this.StepPearl.subscribe((newState) => {
            this.setState({steps: newState.steps});
        });
        setTimeout(() => this.setState({isMounted: true}), 4000);
    }

    isActiveRoute(compareRoute) {
        return this.props.location.pathname === compareRoute;
    }

    isActiveParent(compareRoute) {
        return this.props.location.pathname.indexOf(compareRoute) !== -1;
    }

    setActiveRoute(step, evt) {
        evt.preventDefault();
        const newStep = this.StepPearl.setActiveStep(step);
        if (newStep) {
            this.props.history.push(newStep);
        }
    }

    render() {
        return (
            <div className="App w-screen h-screen flex overflow-hidden">
                <Loader isLoading={!this.state.isMounted}/>
                <div className="flex flex-col w-1/2 md:w-1/3 xl:w-1/4 p-4 bg-grey-darkest shadow-lg">
                    <div className="flex items-center pb-8">
                        <img width="20%" src={this.state.isLoading ? loading : logo} className="App-logo"
                             alt="logo"/>
                        <h1 className="ml-auto font-normal text-white">MAPT</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col text-grey-dark">
                            {
                                this.state.steps.map((step, index) => {
                                    if (step.substeps !== undefined) {
                                        return (
                                            <div key={index} onClick={(evt) => this.setActiveRoute(step, evt)} className={(this.isActiveParent(step.route) ? "border-white text-white" : "border-grey-dark text-grey-dark") + " border-l-4 hover:text-white " +
                                            "hover:border-white px-4 py-2 no-underline normal-case flex flex-col cursor-pointer"}>
                                                <span className="flex items-center">
                                                    {step.title}
                                                    <FontAwesomeIcon className={(step.isComplete ? "" : "hidden") + " ml-auto text-green"} icon="check"/>
                                                </span>
                                                <div className={(this.isActiveParent(step.route) ? "flex" : "hidden") + " flex-col ml-2 mt-2"}>
                                                    {
                                                        step.substeps.map((substep, subindex) => {
                                                            return (
                                                                <Link key={index+"."+subindex} to={(substep.navigationAllowed ? step.route + substep.route : this.props.location.pathname)}
                                                                  className={(this.isActiveRoute(step.route + substep.route) ? "border-white text-white" : "border-grey-dark text-grey-dark") + " border-l-4 hover:text-white " +
                                                                  "hover:border-white pl-4 py-2 no-underline normal-case"}>
                                                                    <span className="flex items-center">
                                                                        {substep.title}
                                                                        <FontAwesomeIcon className={(substep.isComplete ? "" : "hidden") + " ml-auto text-green"} icon="check"/>
                                                                    </span>
                                                                </Link>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <Link key={index} to={(step.navigationAllowed ? step.route : this.props.location.pathname)}
                                                  className={(this.isActiveRoute(step.route) ? "border-white text-white" : "border-grey-dark text-grey-dark") + " border-l-4 hover:text-white " +
                                                  "hover:border-white px-4 py-2 no-underline normal-case"}>
                                                <span className="flex items-center">
                                                    {step.title}
                                                    <FontAwesomeIcon className={(step.isComplete ? "" : "hidden") + " ml-auto text-green"} icon="check"/>
                                                </span>
                                            </Link>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="flex items-center justify-center py-4">
                        <a className="text-white hover:text-green cursor-pointer normal-case no-underline"
                           href="mailto:adam.m.shurson@accenture.com?subject=Mapt Feedback">
                            <h2 className="font-normal">Feedback</h2>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <WindowMenu/>
                    <div className="flex-1 p-4 pt-0">
                        {
                            this.state.steps.map((step, index) => {
                                if (step.component !== undefined) {
                                    return <Route exact key={index} path={step.route} render={() => <step.component
                                        next={() => this.StepPearl.markComplete(this.props.history, index)}
                                        prev={() => this.StepPearl.unmarkComplete(this.props.history, index)}/>} />;
                                } else if (step.substeps !== undefined) {
                                    {
                                        return step.substeps.map((substep, subindex)  => {
                                            return <Route exact key={index+"."+subindex} path={step.route + substep.route}
                                                      render={() => <substep.component
                                                          next={() => this.StepPearl.markComplete(this.props.history, index, subindex)}
                                                          prev={() => this.StepPearl.unmarkComplete(this.props.history, index, subindex)}/>} />;
                                        })
                                    }
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
