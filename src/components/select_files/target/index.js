import React from 'react';
import FilePearl from '../../../pearls/file';

class SelectFilesTarget extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            file: {},
            loading: false
        };
    }

    componentDidMount() {
        this.FilePearl = new FilePearl();
        this.FilePearl.subscribe((newState) => {
            this.setState({file: newState.targetFile});
        });
    }

    openFile() {
        this.setState({
            loading: true
        }, () => {
            this.inputElement.click();
        });
    }

    changeFile(evt) {
        this.FilePearl.setFile(evt.target.files[0], 'target')
            .then(() => {
                this.setState({loading: false});
            }, 500)
            .catch((err) => {
                alert(err);
            });
    }

    render() {
        return (
            <div className="relative h-full w-full">
                <h2 className="font-normal text-grey-darkest">Select Files - Target File</h2>
                <p className="pt-4">
                    Please upload the target data file. Note that the type will be auto-detected, but must be of the
                    previously mentioned supported types.
                </p>
                <button onClick={() => this.openFile()}
                        className={(this.state.loading ? 'text-grey-darker border-grey-darker' : 'border-grey-darkest text-grey-darkest') +
                        " hover:text-grey-darkest hover:border-grey-darkest relative mt-6 px-6 py-4 bg-white border focus:outline-none"}>
                    <span className="absolute pin-t pin-l -mt-2 -ml-1 pr-1 bg-white whitespace-no-wrap text-sm">
                      Target Data
                    </span>
                    {
                        this.state.loading
                            ? <span className="absolute pin-b pin-l pin-r h-1 bg-grey-darkest progress"/>
                            : null
                    }
                    {
                        this.state.file.name === undefined
                            ? "No file selected"
                            : this.state.file.name
                    }
                </button>
                <input ref={input => this.inputElement = input} type="file" onChange={(evt) => this.changeFile(evt)}
                       className="hidden"/>
                <button onClick={() => this.props.prev()}
                        className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                    Back
                </button>
                {
                    this.state.file.name !== undefined
                        ? <button onClick={() => this.props.next()}
                                  className="absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
                            Next
                        </button>
                        : null
                }
            </div>
        );
    }
}

export default SelectFilesTarget;