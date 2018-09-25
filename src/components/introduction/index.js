import React from 'react';

export default function Introduction(props) {
    return (
        <div className="relative h-full w-full">
            <h2 className="font-normal text-grey-darkest">Introduction</h2>
            <p className="pt-4">
                This is a tool to automate validation of data sources from commonly used files. Note that this tool will not store any
                permanent information on your computer, but allows you to export results. Therefore, please exercise caution when exporting
                data to ensure you do not violate any privacy constraints you may have.
            </p>
            <button onClick={() => props.next()}
                    className="absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                Next
            </button>
        </div>
    );
};