import React from 'react';
// import Graph from './Graph';
// import D3 from './D3';
import D3Advanced from './d3_stuff/D3_Advanced';
import Trial from './d3_stuff/Trials';

export default class MainApp extends React.Component{
    constructor(props){
        super(props);
        this.dataBind = this.dataBind.bind(this);
        this.nodeClicked = this.nodeClicked.bind(this);
        this.changeNodeName = this.changeNodeName.bind(this);
        this.resetNodeName = this.resetNodeName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.myProps = {
            counter : 3,
            linksCounter: 0,

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
                    linkType: 'arrow',
                    id:0,
                    designId:0
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
                        shape:"circle",
                        x0:400,
                        y0:80,
                        radius:30
                    }
                    
                },
                {
                    id:2,
                    style:{
                        color:"blue",
                        shape:"circle",
                        x0:50,
                        y0:50,
                        radius:30
                    }
                }
            ],

            designRelations:[
                
            ],

            updatedNode:undefined
        }

        this.state = {
            visible:false,
            selectedNode:undefined
        }

    }

    render(){
        return(
            <div style={{ height: '800px', width:'1600px' }}>
                <D3Advanced myProps={this.myProps} 
                dataUpdated={this.dataBind}
                nodeClicked={this.nodeClicked}
            />
                <div style={{ height: '300px', width:'1600px', border:'dashed',visibility: this.state.visible ? 'visible':'hidden' }}>
                    { 
                    this.state.visible ? 
                        <form onSubmit={this.handleSubmit}>
                        <label>
                            Node name:<input type="text" value={ this.state.selectedNode.newName } onChange={this.changeNodeName}/>
                            </label>                            
                            <button onClick={this.resetNodeName}>Reset</button>

                            <hr/>
                            <input type="submit" value="Submit and Close" />
                        </form>
                        : undefined
                    }
                </div>  
            </div>
        );
            // return(
            //     <div style={{ height: '800px', width:'1600px' }}>
            //         <Trial />
            //     </div>
            // );
    }

    dataBind(newData){
        // copy new data : 
        this.myProps = JSON.parse(JSON.stringify(newData));
        // console.log(this.myProps);
    }

    handleSubmit(e){
        e.preventDefault();
        // Setting the new state will cause a re-render and props will be send to children again
        // thus, before we set the state we will change the data,
        // that will be send as props in D3 child
        this.myProps.updatedNode = {
            id: this.state.selectedNode.id,
            name: this.state.selectedNode.newName,
            designId: this.state.selectedNode.designId
        };

        // Now we may set the new state
        this.setState((prevState)=>{
            return{
                // selectedNode: {
                //     id:prevState.selectedNode.id,
                //     designId:prevState.selectedNode.designId,
                //     name:prevState.selectedNode.newName,
                //     newName:prevState.selectedNode.newName
                // }
                visible:false,
                selectedNode:undefined
            }
        });
    }
    
    changeNodeName(e){
        let newName = e.target.value;
        this.setState((prevState)=>{
            return{
                selectedNode: {
                    id:prevState.selectedNode.id,
                    designId:prevState.selectedNode.designId,
                    name:prevState.selectedNode.name,
                    newName:newName
                }
            }
        });
    }

    resetNodeName(e){
        e.preventDefault();

        this.setState((prevState)=>{
            return{
                selectedNode: {
                    id:prevState.selectedNode.id,
                    designId:prevState.selectedNode.designId,
                    name:prevState.selectedNode.name,
                    newName:prevState.selectedNode.name
                }
            }
        });
    }

    nodeClicked(d,i){
        this.setState(()=>{
            return{
                visible: true,
                selectedNode: {
                    id:d.id,
                    designId:d.designId,
                    name:d.name,
                    newName:d.name
                }
            };
        })
        // console.log('node '+d.name + ' clicked');
    }

}