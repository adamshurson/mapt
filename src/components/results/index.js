import React from 'react';
import MappingPearl from "../../pearls/mapping";
import Loader from "../loader";
import {Doughnut} from 'react-chartjs-2';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      loading: true,
      validCount: 0,
      invalidCount: 0,
      invalidRows: [],
      percent: 0,
      startTime: new Date(),
      endTime: new Date()
    };
    this.options = {
      percentageInnerCutout: 50,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false
    }
  }
  componentDidMount() {
    this.MappingPearl = new MappingPearl();
    this.setState({startTime: new Date()});
    this.MappingPearl.run((percent => {console.log(percent); this.setState({percent: percent})}))
      .then((results) => {
        this.setState({
          loading: false,
          validCount: results.validCount,
          invalidCount: results.invalidCount,
          invalidRows: results.invalidRows,
          endTime: new Date()
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    return <div className="relative h-full w-full flex flex-col">
      <Loader percent={this.state.percent} bgClass="bg-white" isLoading={this.state.loading}/>
      <h2 className="font-normal text-grey-darkest">Results</h2>
      <div className="flex-1 flex pt-8">
        <div className="flex flex-col w-1/2">
          <h4 className="font-normal text-grey-darkest mt-4">Total Rows Validated: {this.state.validCount + this.state.invalidCount}</h4>
          <h4 className="font-normal text-grey-darkest mt-4">Valid Rows: {this.state.validCount}</h4>
          <h4 className="font-normal text-grey-darkest mt-4">Invalid Rows: {this.state.invalidCount}</h4>
          <h4 className="font-normal text-grey-darkest mt-4">Execution Time: {(this.state.endTime.getTime() - this.state.startTime.getTime()) / 1000} seconds</h4>
        </div>
        <div className="w-1/2 flex">
          <Doughnut data={{
            labels: [
              'Valid',
              'Invalid'
            ],
            datasets: [{
              data: [
                this.state.validCount,
                this.state.invalidCount
              ],
              backgroundColor: [
                '#05D903',
                '#e3342f'
              ],
              hoverBackgroundColor: [
                '#1f9d55',
                '#cc1f1a'
              ]
            }]
          }} options={this.options}/>
        </div>
      </div>
      <button onClick={() => this.props.prev()}
              className="absolute pin-b pin-l m-2 px-4 py-2 border-2 border-grey-dark text-grey-dark hover:text-grey-darkest hover:border-grey-darkest cursor-pointer">
        Back
      </button>
    </div>
  }
}

export default Results;