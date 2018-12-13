import React from 'react';
import * as d3 from "d3";

var globalProps;
var dataUpdated;
var nodeClicked;

function getColor(designId){
    let res = null;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = item.style.color;
        }
    })
    return res;
}

function getShape(designId){
    let res = null;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = item.style.shape;
        }
    })
    return res;
}

function getCoordinates(designId){
    let res = null;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = {x:item.style.x0 , y:item.style.y0 };
        }         
    })
    return res;
}

function setCoordinates(designId,x0,y0){
    globalProps.design.map((item)=>{
        if(item.id == designId){
            item.x0 = x0;
            item.y0 = y0;
        }
    })
}

function getRadius(designId){
    let res = null;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = item.style.radius;
        }         
    })
    return res;
}

function dragstarted(d) {
    d3.select(this).style("cursor", "all-scroll");
    d3.select(this).raise().classed("active", true);
}
  
function dragged(d) {
    if(getShape(d.designId)==='circle'){
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }else if(getShape(d.designId)==='square' || 'triangle'){
        d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
    }
}
  
function dragended(d) {
    d3.select(this).style("cursor", "default"); 
    d3.select(this).classed("active", false);
}
  
// DATA HANDLE
function myRender(){
    var nodes = d3.select("#container-div").selectAll("svg").select("g").data(globalProps.dataModel,(d)=>{
        return d.id;
    });
    
    nodes.enter().append(function(d){
            let res = undefined;
            if(getShape(d.designId)==='circle'){
                res = "circle";
            }else if(getShape(d.designId)==='triangle'){
                res = "rect";
            }else if(getShape(d.designId)==='square'){
                res = "rect";
            }
            return document.createElementNS(d3.namespaces.svg,res);
        })
        .merge(nodes)
            .attr("id",function(d){
                return d.id;
            })
            .attr("class","node")
            .attr("cx", (d)=>{ return getShape(d.designId) ==='circle' ? getCoordinates(d.designId).x : null })
            .attr("cy", (d)=>{ return getShape(d.designId)==='circle' ? getCoordinates(d.designId).y : null })
            .attr("r", (d)=>{ return getShape(d.designId)==='circle' ? getRadius(d.designId) : null })

            .attr("x", (d)=>{ return getShape(d.designId)==='square' || 'triangle' ? getCoordinates(d.designId).x : null })
            .attr("y", (d)=>{ return getShape(d.designId)==='square' || 'triangle' ? getCoordinates(d.designId).y : null })
            .attr("width", (d)=>{ return getShape(d.designId)==='square' || 'triangle' ? 200 : null })
            .attr("height", (d)=>{ return getShape(d.designId)==='square' || 'triangle' ? 100 : null })
            .attr("fill", (d)=>{return getColor(d.designId)} );      

    d3.select("#container-div").selectAll(".node").data(globalProps.dataModel,(d)=>{
            return d.id;
    }).exit().remove();
            
    d3.selectAll(".node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended
        ));

    // add listeners
    d3.selectAll(".node").on("contextmenu", function (d, i) {
        // DELETE ON RIGHT-CLICK functionality
        
        d3.event.preventDefault();
        // react on right-clicking : 
        // -- delete element which clicked from dataModel array --
        let removeIndex = globalProps.dataModel.map((item) => {
            return item.id; 
        }).indexOf(d.id);
        let designRemoveIndex = globalProps.design.map((item)=>{
            return item.id;
        }).indexOf(d.designId);
        (removeIndex >= 0) && globalProps.dataModel.splice(removeIndex, 1); 
        (designRemoveIndex >= 0) && globalProps.design.splice(designRemoveIndex, 1); 

        // remove the proper dom elements :
        myRender();
    });
    d3.select("svg").on("click",containerClicked );
    d3.selectAll(".node").on("click", function(d,i){
        nodeClicked(d,i);
    });



    // update data back to parent-element (in react)
    dataUpdated(globalProps);
}

// LISTENERS
function containerClicked(){
    let inputCoordinates = d3.mouse(this);
    console.log(inputCoordinates)
    // let numOfNodes = d3.selectAll(".node").nodes().length;
    // let newNodeId = numOfNodes + 1;
    let newNodeId = globalProps.counter + 1;
    globalProps.counter = globalProps.counter + 1;

    // update data : 
    globalProps.design.push({
        id:newNodeId,
        style:{
            color:"yellow",
            shape:"circle",
            x0:inputCoordinates[0],
            y0:inputCoordinates[1],
            radius:40
        }
    })
    globalProps.dataModel.push({
        id:"node"+newNodeId,
        designId:newNodeId,
        name:"node "+newNodeId
    });

    myRender();
    
}

export default class D3 extends React.Component{

    constructor(props){
        super(props);
        this.myProps = props.myProps;
        dataUpdated = props.dataUpdated;
        nodeClicked = props.nodeClicked;
    }

    render(){
        return(
            <svg style={{ height: '100%', width:'100%',border:'dashed' }} ref="myRef" >
                <g id="container-div" >
                </g>
                <g id="lines-group">
                </g>
            </svg>
        );
    }

    componentDidMount(){
        globalProps = JSON.parse(JSON.stringify( this.myProps ));
        myRender();  
    }

    componentWillUnmount(){
        // remove listeners by :
        d3.select("#container-div").on("click", null );        
    }

    componentWillReceiveProps(nextProps) {
        // console.log('new props');

        globalProps = JSON.parse(JSON.stringify( nextProps.myProps ));
        let newNode = nextProps.myProps.updatedNode;
        if(newNode){
            // newNode is not undefined , update the dataModel 
            // TO-DO : also update the design (in future -- set proper the parent stuff)
            globalProps.dataModel.map((item)=>{
                if(item.id == newNode.id){
                    item.name = newNode.name;
                    // no need to update design id, should be the same (if no error exists)
                }
            });
        }
        // new data received, update the DOM properly, 
        // by calling myRender()        
        myRender();
    }

    shouldComponentUpdate(){
        return false;
    }
  
}
