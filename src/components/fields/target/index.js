import React from 'react';

class FieldTarget extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div className="relative h-full w-full">
                <h2 className="font-normal text-grey-darkest">Fields - Target</h2>
                <p className="pt-4">
                    Please select your header row and which headers you would like to validate.
                </p>
                <button
                        className={(false ? 'text-grey-darker border-grey-darker' : 'border-grey-darkest text-grey-darkest') +
                        " hover:text-grey-darkest hover:border-grey-darkest relative mt-6 px-6 py-4 bg-white border focus:outline-none"}>
                    <span className="absolute pin-t pin-l -mt-2 -ml-1 pr-1 bg-white whitespace-no-wrap text-sm">
                      Target Data
                    </span>
                    Target Data
                </button>
                <input ref={input => this.inputElement = input} type="file" onChange={(evt) => this.changeFile(evt)}
                       className="hidden"/>
                <button onClick={() => this.props.prev()}
                        className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                    Back
                </button>
                <button onClick={() => this.props.next()}
                        className="absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                    Next
                </button>
            </div>
        );
    }
}

export default FieldTarget;