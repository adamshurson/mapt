import React from 'react';

export default function Summary(props) {
    return (
        <div className="relative h-full w-full">
            <h2 className="font-normal text-grey-darkest">Select Files - Summary</h2>
            <p className="pt-4">
                If you require file types extraneous to the below, please submit a request via the feedback button. This is not a guarantee it will be supported, but if there are enough
                requests it may be included in further developments.
            </p>
            <p className="pt-4">
                Currently, the application supports the following file types:
            </p>
            <ul className="mt-2 ml-2 pl-4">
                <li>xlsx</li>
                <li>csv</li>
                <li>tsv</li>
            </ul>
            <button onClick={() => props.prev()}
                    className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                Back
            </button>
            <button onClick={() => props.next()}
                    className="absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                Next
            </button>
        </div>
    );
};