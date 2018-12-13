import React from 'react';
// import Graph from './Graph';

export default class MainApp extends React.Component{

    render(){
        return(
            <div id="myDiagramDiv" style={{ height: '100%', width:'100%',border:'dashed' }} ref="myRef" >
                Lollll
            </div>
        );
    }

    componentDidMount(){
        var $ = go.GraphObject.make;
        var myDiagram = $(go.Diagram, "myDiagramDiv");
        myDiagram.model = $(go.GraphLinksModel);
        myDiagram.model.nodeDataArray = [
            {key: '001'},
            {key: '002'},
            {key: '003'}
        ];
        myDiagram.model.linkDataArray =[
            {to: '001', from: '003'}
        ];
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(){
        return false;
    }

}