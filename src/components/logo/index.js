import React from 'react';

function logo(props) {
  if (props.loading) {
    return <svg width={props.width} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 200">
      <polygon id="bottom" fill="rgb(5,145,8)">
        <animate id="bottomFill" attributeName="points" begin="0;topEmpty.end+0.25s" dur="0.5s" fill="freeze"
                 from="0,200 0,200 0,160 0,160"
                 to="0,200 225,120 225,80 0,160"/>
        <animate id="bottomEmpty" attributeName="points" begin="topFill.end+0.25s" dur="0.5s" fill="freeze"
                 to="225,120 225,120 225,80 225,80"
                 from="0,200 225,120 225,80 0,160"/>
      </polygon>
      <polygon id="top" fill="rgb(1,255,2)">
        <animate id="topFill" attributeName="points" dur="0.5s" begin="bottomFill.end" fill="freeze"
                 from="225,80 225,80 225,120 225,120"
                 to="0,0 225,80 225,120 0,40"/>
        <animate id="topEmpty" attributeName="points" dur="0.5s" begin="bottomEmpty.end" fill="freeze"
                 to="0,0 0,0 0,40 0,40"
                 from="0,0 225,80 225,120 0,40"/>
      </polygon>
    </svg>
  } else {
    return <svg width={props.width} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 200">
      <polygon fill="rgb(5,145,8)" points="0,200 225,120 225,80 0,160"/>
      <polygon fill="rgb(1,255,2)" points="0,0 225,80 225,120 0,40"/>
    </svg>
  }
}

export default logo;