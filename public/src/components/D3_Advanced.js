import React from 'react';
import * as d3 from "d3";

var globalProps;
// globalProps = {dataModel,relationshipsModel,design,counter}

function getColor(designId){
    let res = undefined;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = item.style.color;
        }         
    })
    return res;
}

function getShape(designId){
    let res = undefined;
    globalProps.design.map((item)=>{
        if(item.id == designId){
            res = item.style.shape;
        }         
    })
    return res;
}

function getCoordinates(designId){
    let res = undefined;
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
    let res = undefined;
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
    var nodes = d3.select("#container-div").selectAll("svg").data(globalProps.dataModel,(d)=>{
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
            // .text(function(d){
            //     return d.name; 
            // })
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

    })

    d3.select("#container-div").on("click",containerClicked );

}

// LISTENERS
function containerClicked(){
    // console.log('clicked on : (' + d3.mouse(this)[0]+','+d3.mouse(this)[1]+')');
    let inputCoordinates = d3.mouse(this);
    let numOfNodes = d3.selectAll(".node").nodes().length;
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
        globalProps = props.myProps;
    }

    render(){
        return(
            <svg id="container-div" style={{ height: '100%', width:'100%',border:'dashed' }} ref="myRef" />
        );
    }

    componentDidMount(){
        // counter = 3;
        myRender();  
    }

    componentWillUnmount(){
        // remove listeners by :
        d3.select("#container-div").on("click", null );        
    }

    componentWillReceiveProps(nextProps) {
        globalProps = nextProps.myProps;
    }

    shouldComponentUpdate(){
        return false;
    }
  
}