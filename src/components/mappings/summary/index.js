import React from 'react';

export default function Summary(props) {
    return (
        <div className="relative h-full w-full">
            <h2 className="font-normal text-grey-darkest">Mappings - Summary</h2>
            <p className="pt-4">
                You will now map each target field to your legacy fields. You can use a one-to-one mapping or a transformation / advanced mapping (this allows you to format and include
                multiple fields using JavaScript).
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