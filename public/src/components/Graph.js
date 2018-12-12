import React from 'react';
import { Graph } from 'react-d3-graph';// Graph payload (with minimalist structure)

const data = {
    nodes: [
      {id: 'Harry', symbolType:'circle', },
      {id: 'Sally', symbolType:'cross'},
      {id: 'Alice', symbolType:'triangle'}
    ],
    links: [
        {source: 'Harry', target: 'Sally', color:'red'},
        {source: 'Harry', target: 'Alice', color:'blue'},
    ]
};
 
// The graph configuration
const myConfig = {
    highlightBehavior: true,
    node: {
        color: 'blue',
        size: 4000,
        highlightStrokeColor: 'red'
    },
    link: {
        highlightColor: 'red'
    }
};

export default class MyGraph extends React.Component{
    render(){
        return(
            <Graph
                id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
            />
        );
    }
}