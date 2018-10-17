import React from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Logo from '../logo';

function Loader(props) {
    return (
        <ReactCSSTransitionGroup
        transitionName='Loader'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>
        {
            props.isLoading
            ? <div className={props.bgClass + " absolute z-10 pin flex flex-col items-center justify-center"}>
                <Logo loading={true} width="20%" />
                <h4 className="font-normal text-grey-darkest mt-12">{Math.round(props.percent)}%</h4>
            </div>
            : null
        }
        </ReactCSSTransitionGroup>
    );
}
export default Loader;