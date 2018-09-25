import React from 'react';
import loadinglogo from "../../logo-loading.svg";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

function Loader(props) {
    return (
        <ReactCSSTransitionGroup
        transitionName='Loader'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>
        {
            props.isLoading
            ? <div className="absolute z-10 bg-grey-darkest pin flex items-center justify-center">
                <img width="20%" src={loadinglogo} className="App-logo" alt="logo" />
            </div>
            : null
        }
        </ReactCSSTransitionGroup>
    );
}
export default Loader;