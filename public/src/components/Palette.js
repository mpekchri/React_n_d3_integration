import React from 'react';

export default class Palette extends React.Component{
    constructor(props){
        super(props);
        this.addNodeClicked = this.addNodeClicked.bind(this);
        this.addLineClicked = this.addLineClicked.bind(this);
    }

    render(){
        return(
            <div style={{ height: '100%', width:'100%',display:'flex',flexDirection:'column' }}>
                <button onClick={this.addNodeClicked}>Add node</button>
                <button onClick={this.addLineClicked}>Add line</button>
            </div>
        );
    }

    addNodeClicked(){
        this.props.paletteAddNode();
    }

    addLineClicked(){
        this.props.paletteAddLine();
    }

}