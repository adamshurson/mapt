import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const { remote } = window.require('electron');

function WindowMenu() {
    return (
        <div className="flex z-10">
            <div id="MenuBar" className="flex-1 cursor-move" />
            <div className="ml-auto flex">
                <button onClick={() => remote.getCurrentWindow().minimize()} className="flex items-center py-2 px-3 text-grey-darker hover:text-grey-darkest">
                    <FontAwesomeIcon icon="window-minimize" className="fa-thin" />
                </button>
                <button onClick={() => remote.getCurrentWindow().maximize()} className="flex items-center py-2 px-3 text-grey-darker hover:text-grey-darkest">
                    <FontAwesomeIcon icon="window-maximize" className="fa-thin" />
                </button>
                <button onClick={() => remote.getCurrentWindow().close()} className="flex items-center py-2 px-3 text-grey-darker hover:text-grey-darkest">
                    <FontAwesomeIcon icon="window-close" className="fa-thin" />
                </button>
            </div>
        </div>
    );
}
export default WindowMenu;