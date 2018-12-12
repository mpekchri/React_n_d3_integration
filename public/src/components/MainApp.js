import React from 'react';
// import Graph from './Graph';
// import D3 from './D3';
import D3Advanced from './D3_Advanced';

export default class MainApp extends React.Component{
    constructor(props){
        super(props);
        this.dataBind = this.dataBind.bind(this);

        this.myProps = {
            counter : 3,

            dataModel:[
                {
                    id:"node1",
                    designId:0,
                    name:"node 1"
                },
                {
                    id:"node2",
                    designId:1,
                    name:"node 2"
                },
                {
                    id:"node3",
                    designId:2,
                    name:"node 3"
                }
                
            ],

            relationshipsModel :[
                {
                    label:'is aware of',
                    from:'node1',   // source node id
                    to:'node2',     // target node id
                    linkType: 'arrow'
                }
            ],

            design : [
                {
                    id:0,
                    style:{
                        color:"blue",
                        shape:"circle",
                        x0:800,
                        y0:100,
                        radius:30
                    }
                    
                },
                {
                    id:1,
                    style:{
                        color:"red",
                        shape:"triangle",
                        x0:400,
                        y0:80
                    }
                    
                },
                {
                    id:2,
                    style:{
                        color:"blue",
                        shape:"square",
                        x0:50,
                        y0:50
                    }
                }
            ]
        }

    }

    render(){
        return(
            <div style={{ height: '800px', width:'1600px' }}>
                <D3Advanced myProps={this.myProps} 
                dataUpdated={this.dataBind}
            />
            </div>
        );
    }

    dataBind(newData){
        this.myProps = newData;
        console.log(this.myProps);
    }
}