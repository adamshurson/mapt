import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isOpen: false
    };
  }
  handleChange(index) {
    this.setState({
      isOpen: false
    });
    this.props.handleChange(this.props.data[index]);
  }
  toggleOpen(evt) {
    evt.stopPropagation();
    this.setState({isOpen: !this.state.isOpen});
  }
  clear(evt) {
    evt.stopPropagation();
    this.props.clear();
  }
  render() {
    return <button onClick={(evt) => this.toggleOpen(evt)} className={(this.state.isOpen ? "text-grey-darker border-grey-darker" : "border-grey-darkest text-grey-darkest") +
                   " w-full hover:text-grey-darkest hover:border-grey-darkest relative p-2 bg-white border focus:outline-none h-full"}>
                    <span className="absolute pin-t pin-l -mt-2 -ml-1 pr-1 bg-white whitespace-no-wrap text-sm">
                      {
                        this.props.value == null || this.props.subitems == null
                          ? this.props.title
                          : this.props.value
                      }
                    </span>
      {
        this.props.value === undefined
          ? <span>Select</span>
          : <span className="w-full h-full flex items-center overflow-auto">
              {
                this.props.subitems === undefined
                  ? <span className="flex-1 text-center">{this.props.value}</span>
                  : <span className="flex items-center justify-center h-full">
                    {
                      this.props.subitems.map(subitem => {
                        return subitem;
                      })
                    }
                    </span>
              }
              <span onClick={(evt) => this.clear(evt)} style={{display: "hidden"}} className="ml-auto p-2 flex items-center justify-center text-grey-darker hover:text-white hover:bg-grey-darker">
                <FontAwesomeIcon icon="times" />
              </span>
            </span>
      }
      {
        this.state.isOpen
          ? <span className="absolute pin-b pin-l pin-r h-48 -mb-48 z-10 bg-white">
                                <span
                                  className="absolute pin border border-grey-darkest flex flex-col overflow-y-auto overflow-x-hidden">
                                    {
                                      this.props.data.map((row, index) => {
                                        return <span onClick={() => this.handleChange(index)} key={index}
                                                     className="p-2 hover:bg-grey-darkest hover:text-white">{this.props.format(row)}</span>;
                                      })
                                    }
                                </span>
                            </span>
          : null
      }
    </button>
  }
}

export default Dropdown;