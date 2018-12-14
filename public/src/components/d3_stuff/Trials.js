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

var points = [
    {x:100 , y:100 },
    {x:200 , y:100 },
    {x:200 , y:200 },
    {x:400 , y:300 },
    
]


export default class Trials extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <svg style={{ height: '100%', width:'100%',border:'dashed' }} >
                <g id="line-container">
                </g>
                <g id="items-container" >
                    <circle id="id01" className="node" cx="800" cy="100" r="30" x="800" y="100" width="200" height="100" fill="red"></circle>
                    <circle id="id02" className="node" cx="100" cy="250" r="30" x="800" y="100" width="200" height="100" fill="red"></circle>
                </g>    
                
            </svg>
        );
    }

    componentDidMount(){
        let dataPoints = connections.map((connection)=>{
            // console.log(d3.select("#"+connection.from))
            let x1 = d3.select("#"+connection.from).attr("cx");
            let y1 = d3.select("#"+connection.from).attr("cy");
            let x2 = d3.select("#"+connection.to).attr("cx");
            let y2 = d3.select("#"+connection.to).attr("cy");

            return([
                {
                    x:x1,
                    y:y1
                },

                // create some intermediate points
                
                // {
                //     x:(Math.max(x1,x2) + Math.min(x1,x2))/2,
                //     y:y1,
                // },
                // {
                //     x:(Math.max(x1,x2) + Math.min(x1,x2))/2,
                //     y:y2,
                // },

                // intermediate points have been created

                {
                    x:x2,
                    y:y2
                }
            ]);
        });
        dataPoints = [].concat.apply([], dataPoints);
        console.log(dataPoints)
        

        var lineFunction = d3.line()
                                .curve(d3.curveStep)
                                .x((d)=>{return d.x})
                                .y((d)=>{return d.y});

        // lineFunction.curve(d3.curveCardinal);

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
