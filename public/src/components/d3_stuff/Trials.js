import React from 'react';
import * as d3 from "d3";

var lineData ;

var connections = [
    {
        from:"id01", 
        to: "id02"
    },
    // {
    //     from:"id02", 
    //     to: "id01"
    // }
]

export default class Trials extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <svg style={{ height: '100%', width:'100%',border:'dashed' }} >
                
                <g id="items-container" >
                    <circle id="id01" class="node" cx="800" cy="100" r="30" x="800" y="100" width="200" height="100" fill="red"></circle>
                    <circle id="id02" class="node" cx="100" cy="250" r="30" x="800" y="100" width="200" height="100" fill="red"></circle>
                </g>    
                <g id="line-container">
                </g>
            </svg>
        );
    }

    componentDidMount(){
        let dataPoints = connections.map((connection)=>{
            // console.log(d3.select("#"+connection.from))
            return([
                {
                    x:d3.select("#"+connection.from).attr("cx"),
                    y:d3.select("#"+connection.from).attr("cy")
                },
                {
                    x:d3.select("#"+connection.to).attr("cx"),
                    y:d3.select("#"+connection.to).attr("cy")
                }
            ]);
        });
        dataPoints = [].concat.apply([], dataPoints);

        var lineFunction = d3.line()
                                .x((d)=>{return d.x})
                                .y((d)=>{return d.y})
                                .curve(d3.curveBundle.beta(0.5));

        var container = d3.select("#line-container");
        
        container.append("path")
                    .attr("d", lineFunction(dataPoints))
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
    }

    componentWillUnmount(){    
    }

    componentWillReceiveProps(nextProps) {
        
    }

    shouldComponentUpdate(){
        return false;
    }
  
}
