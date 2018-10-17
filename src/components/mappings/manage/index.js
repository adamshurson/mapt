import React from "react";
import MappingPearl from "../../../pearls/mapping";
import Dropdown from "../../dropdown";
import Source from "./Source";

class MappingsManage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      mappings: [],
      legacyFields: [],
      targetFields: [],
      active: 0
    };
    this.functions = [
      {
        name: "add",
        params: ["x", "y"],
        paramSources: [new Source(), new Source()],
        value: function(params) {
          return params["x"] + params["y"];
        }
      }
    ]
  }

  updateSource(source, index) {
    const mappings = this.state.mappings;
    mappings[index].source = source;
    this.setState({mappings: mappings});
  }

  autoMap() {
    const mappings = this.state.mappings;
    const used = {};
    this.state.mappings.map((m, i) => {
      if (used[m.fieldName] === undefined) {
        used[m.fieldName] = -1;
      }
      for (let j=0; j<this.state.legacyFields.length; j++) {
        const field = this.state.legacyFields[j];
        if (m.fieldName === field.fieldName && used[m.fieldName] < j) {
          mappings[i].source = new Source(null, (source) => this.updateSource(source, i));
          mappings[i].source.setField(field, null, true);
          used[m.fieldName] = j;
          break;
        }
      }
    });
    this.setState({mappings: mappings});
  }

  componentDidMount() {
    this.MappingPearl = new MappingPearl();
    this.MappingPearl.subscribe((newState) => {
      if (this.state.mappings.length === 0) {
        const mappings = [];
        newState.targetFields.map((field, index) => {
          mappings.push({
            fieldName: field.fieldName,
            fieldIndex: field.fieldIndex,
            source: new Source(null, (source) => this.updateSource(source, index)),
            included: field.included
          });
        });
        this.setState({
          legacyFields: newState.legacyFields,
          targetFields: newState.targetFields,
          mappings: mappings
        });
      } else {
        this.setState({
          legacyFields: newState.legacyFields,
          targetFields: newState.targetFields
        });
      }
    });
  }

  mappingComplete() {
    let foundBlank = false;
    this.state.mappings.map(m => {
      if (m.included && (m.source.getSource().type == null || m.source.getSource().value == null)) {
        foundBlank = true;
      }
    });
    return !foundBlank;
  }

  getLegacyFields() {
    return this.state.legacyFields.filter(row => row.included);
  }

  displaySource(source, parent) {
    const sourceObj = source.getSource();
    parent = parent || null;
    if (sourceObj.type == null) {
      return <div className="flex items-center justify-center self-center">
        <div className="w-1/2 pr-2">
          <Dropdown handleChange={(field) => source.setField(field, parent)} title={"Field"} data={this.getLegacyFields()} format={row => row.fieldName}/>
        </div>
        <div className="w-1/2 pl-2">
          <Dropdown handleChange={(fn) => source.setFunction(fn, parent)} title={"Function"} data={this.functions} format={row => row.name}/>
        </div>
      </div>
    } else if (sourceObj.type === "Reference") {
      return <Dropdown clear={() => source.clearSource()} value={sourceObj.value.fieldName} handleChange={(field) => source.setField(field, parent)}
                       title={"Field"} data={this.getLegacyFields()} format={row => row.fieldName}/>
    }
    else if (sourceObj.type === "Function") {
      const params = [];
      sourceObj.paramSources.map((param) => params.push(
        <div key={param.index} className="p-2 h-full">
          {this.displaySource(param, source)}
        </div>
      ));
      return <Dropdown clear={() => source.clearSource()} value={sourceObj.name} subitems={params} handleChange={(fn) => source.setFunction(fn, parent)}
                title={"Function"} data={this.functions} format={row => row.name}/>
    }
  }

  next() {
    this.MappingPearl.setMappings(this.state.mappings);
    this.props.next();
  }

  render() {
    return (
      <div className="relative h-full w-full flex flex-col">
        <h2 className="font-normal text-grey-darkest">Mappings - Manage</h2>
        <p className="pt-4">
          Please input the source for each field in the Target data
        </p>
        <div className="flex pt-4">
          <div className="w-1/2 pr-2">
            <div className="h-64 border border-grey-darker overflow-y-auto">
              <div className="flex flex-col h-fit">
                {
                  this.state.mappings.map((mapping, index) => {
                    if (!mapping.included) {
                      return null;
                    } else {
                      return <div onClick={() => this.setState({ active: index })} key={index}
                                  className={(this.state.active === index ? "bg-grey-darkest text-white" : "text-grey-darkest hover:bg-grey-darkest hover:text-white")
                                  + " cursor-pointer px-4 py-2 "}>{mapping.fieldName}</div>
                    }
                  })
                }
              </div>
            </div>
            <button onClick={() => this.autoMap()}
                    className="mt-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
              Auto Map
            </button>
          </div>
          {
            this.state.mappings.length === 0
              ? null
              : <div className="w-1/2 pl-2 h-64">
                {
                  this.displaySource(this.state.mappings[this.state.active].source)
                }
                </div>
          }
        </div>
        <button onClick={() => this.props.prev()}
                className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
          Back
        </button>
        <button onClick={() => this.next()}
                className={(this.mappingComplete() ? "" : "hidden") + " absolute pin-b pin-r m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer"}>
          Next
        </button>
      </div>
    );
  }
}

export default MappingsManage;