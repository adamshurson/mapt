import React from "react";
import FilePearl from "../../../pearls/file";
import MappingPearl from "../../../pearls/mapping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FieldTarget extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      selectedRow: 0,
      rows: [],
      menuOpen: false,
      fields: []
    };
  }

  componentDidMount() {
    this.FilePearl = new FilePearl();
    this.MappingPearl = new MappingPearl();
    this.FilePearl.readFile("target", 0, 5)
      .then((response) => {
        this.setState({
          rows: response,
          fields: this.allFields(response[0], false)
        });
      })
      .catch((err) => {
        console.log(err);
        this.props.prev();
      });
  }

  openMenu() {
    this.setState({
      menuOpen: true
    });
  }

  formatOption(row) {
    let rowStr = "";
    if (row == null) {
      return rowStr;
    } else {
      row.map((field, index) => {
        if (field.length !== 0) {
          rowStr += (index === row.length - 1 ? field : field + ", ");
        }
      });
      return rowStr.length > 50 ? rowStr.substring(0, 50) + "..." : rowStr;
    }
  }

  setIndex(evt, index) {
    evt.stopPropagation();
    this.setState({
      selectedRow: index,
      menuOpen: false,
      fields: this.allFields(this.state.rows[index], false)
    });
  }

  setAll(included) {
    this.setState({
      fields: this.allFields(this.state.rows[this.state.selectedRow], included)
    });
  }

  allFields(row, included) {
    const arr = [];
    row.map((field, index) => {
      if (field !== "") {
        arr.push({
          fieldName: field,
          fieldIndex: index,
          included: included
        });
      }
    });
    return arr;
  }

  toggleField(index) {
    const dup = this.state.fields;
    dup[index].included = !dup[index].included;
    this.setState({
      fields: dup
    });
  }

  next() {
    this.MappingPearl.setFields('target', this.state.fields);
    this.props.next();
  }

  render() {
    return (
      <div className="relative h-full w-full flex flex-col">
        <h2 className="font-normal text-grey-darkest">Fields - Target</h2>
        <p className="pt-4">
          Please select your header row and which headers you would like to validate.
        </p>
        <button onClick={() => this.openMenu()}
                className={(this.state.menuOpen ? "text-grey-darker border-grey-darker" : "border-grey-darkest text-grey-darkest") +
                " w-full hover:text-grey-darkest hover:border-grey-darkest relative mt-6 px-6 py-4 bg-white border focus:outline-none"}>
                    <span className="absolute pin-t pin-l -mt-2 -ml-1 pr-1 bg-white whitespace-no-wrap text-sm">
                      Target Data
                    </span>
          {
            this.formatOption(this.state.rows[this.state.selectedRow])
          }
          {
            this.state.menuOpen
              ? <span className="absolute pin-b pin-l pin-r h-48 -mb-48 z-10 bg-white">
                                <span
                                  className="absolute pin border border-grey-darkest flex flex-col overflow-y-auto overflow-x-hidden">
                                    {
                                      this.state.rows.map((row, index) => {
                                        return <span onClick={(evt) => this.setIndex(evt, index)} key={index}
                                                     className="p-4 hover:bg-grey-darkest hover:text-white">{this.formatOption(row)}</span>;
                                      })
                                    }
                                </span>
                            </span>
              : null
          }
        </button>
        <div className="my-4 border border-grey-darker p-4 h-64 overflow-y-auto">
          <div className="flex flex-wrap max-h-full">
            {
              this.state.fields.map((field, index) => {
                return <div onClick={() => this.toggleField(index)} key={index} className="p-4 cursor-pointer flex border border-grey-darker hover:border-grey-darkest text-grey-darker hover:text-grey-darkest mr-4 mb-4">
                  <FontAwesomeIcon className={field.included ? "" : "hidden"} icon={["far", "check-square"]} />
                  <FontAwesomeIcon className={field.included ? "hidden" : ""} icon={["far", "square"]} />
                  <span className="ml-4">{field.fieldName}</span>
                </div>
              })
            }
          </div>
        </div>
        <div className="my-2 flex">
          <button onClick={() => this.setAll(true)}
                  className="mt-2 mr-4 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
            Select All
          </button>
          <button onClick={() => this.setAll(false)}
                  className="mt-2 mr-4 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
            Deselect All
          </button>
        </div>
        <button onClick={() => this.props.prev()}
                className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
          Back
        </button>
        <button onClick={() => this.next()}
                className={(this.state.fields.length === 0 ? "hidden" : "") + " absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer"}>
          Next
        </button>
      </div>
    );
  }
}

export default FieldTarget;