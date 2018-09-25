import React from 'react';
import FilePearl from "../../../pearls/file";

class FieldLegacy extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            selectedRow: 0,
            rows: [],
            menuOpen: false
        }
    }

    componentDidMount() {
        this.FilePearl = new FilePearl();
        this.FilePearl.readMappings['csv']('legacy', 0, 5)
            .then((response) => {
                this.setState({
                    rows: response
                });
            });
    }

    openMenu() {
        this.setState({
            menuOpen: true
        });
    }

    formatOption(row) {
        let rowStr = '';
        row.map((field, index) => {
            if (field.length !== 0) {
                rowStr += (index === row.length - 1 ? field : field + ', ');
            }
        });
        return rowStr.length > 50 ? rowStr.substring(0, 50) + "..." : rowStr;
    }

    render() {
        return (
            <div className="relative h-full w-full">
                <h2 className="font-normal text-grey-darkest">Fields - Legacy</h2>
                <p className="pt-4">
                    Please select your header row and which headers you would like to validate.
                </p>
                <button onClick={() => this.openMenu()}
                    className={(this.state.menuOpen ? 'text-grey-darker border-grey-darker' : 'border-grey-darkest text-grey-darkest') +
                    " w-full hover:text-grey-darkest hover:border-grey-darkest relative mt-6 px-6 py-4 bg-white border focus:outline-none"}>
                    <span className="absolute pin-t pin-l -mt-2 -ml-1 pr-1 bg-white whitespace-no-wrap text-sm">
                      Legacy Data
                    </span>
                    Not Selected
                    {
                        this.state.menuOpen
                            ? <span className="absolute pin-b pin-l pin-r h-48 -mb-48 z-10 bg-white">
                                <span
                                    className="absolute pin border border-grey-darkest flex flex-col overflow-y-auto overflow-x-hidden">
                                    {
                                        this.state.rows.map((row, index) => {
                                            return <span key={index} className="p-4 hover:bg-grey-darkest hover:text-white">{this.formatOption(row)}</span>
                                        })
                                    }
                                </span>
                            </span>
                            : null
                    }
                </button>
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

export default FieldLegacy;