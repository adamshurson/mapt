import React from 'react';

export default function Summary(props) {
    return (
        <div className="relative h-full w-full">
            <h2 className="font-normal text-grey-darkest">Fields - Summary</h2>
            <p className="pt-4">
                Following this page, you will select the row which contains your header data. Once the row is selected, you may toggle which fields you would like to validate.
            </p>
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