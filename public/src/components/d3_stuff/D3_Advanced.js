import React from 'react';
import * as d3 from "d3";
import _ from 'underscore';

var globalProps;
var dataUpdated;
var nodeClicked;
var mayAddNode;
var mayAddLine;
var sourceNodeDefined;
var sourceNodeId;

// DATA HANDLE
function renderNodes(){
    // ADD NODES based on data (globalProps.dataModel) -- SECTION START --
    let nodes = d3.select("#container-div").selectAll("svg").select("g").data(globalProps.design,(d)=>{
        return d.id;
    });

    nodes.enter().append(function(d){
            let res = undefined;
            if(d.style.shape==='circle'){
                res = "circle";
            // }else if(d.style.shape==='triangle'){
            //     res = "rect";
            // }else if(d.style.shape==='square'){
            //     res = "rect";
            }
            return document.createElementNS(d3.namespaces.svg,res);
        })
        .merge(nodes)
            .attr("id",function(d){
                return getNodeId(d.id);
            })
            .attr("class","node")
            .attr("cx", (d)=>{ return d.style.shape ==='circle' ? d.style.x0 : null })
            .attr("cy", (d)=>{ return d.style.shape ==='circle' ? d.style.y0 : null })
            .attr("r", (d)=>{ return d.style.shape ==='circle' ? d.style.radius : null })
            // .attr("x", (d)=>{ return getShape(d.designId)==='square' || getShape(d.designId)==='triangle' ? getCoordinates(d.designId).x : null })
            // .attr("y", (d)=>{ return getShape(d.designId)==='square' || getShape(d.designId)==='triangle' ? getCoordinates(d.designId).y : null })
            // .attr("width", (d)=>{ return getShape(d.designId)==='square' || getShape(d.designId)==='triangle' ? 200 : null })
            // .attr("height", (d)=>{ return getShape(d.designId)==='square' || getShape(d.designId)==='triangle' ? 100 : null })
            .attr("fill", (d)=>{return d.style.color } );      

    d3.select("#container-div").selectAll(".node").data(globalProps.design,(d)=>{
            return d.id;
    }).exit().remove();
    // ADD NODES based on data (globalProps.dataModel) -- SECTION END -- 

    // ADD LISTENERS -- SECTION START -- 
    nodeDeleteListener();
    nodeAddListener();
    nodeSelectListener();
    nodeOnDraggListener();
    // ADD LISTENERS -- SECTION END -- 

    // UPDATE DATA IN THE PARENT ELEMENT (handled by React)
    dataUpdated(globalProps);
}

function renderLines(){
    // ADD LINES based on data (globalProps.relationshipsModel) -- SECTION START --

    // update globalProps.designRelations
    updateDesignRelations();
    // now globalProps.designRelations is updated,
    // we may bind it's data with d3
    let lineFunction = d3.line()
                            .curve(d3.curveLinear)
                            .x((d)=>{return d.x})
                            .y((d)=>{return d.y});

    let links = d3.select("#lines-group").selectAll("path").data(globalProps.designRelations,(d)=>{
        return d.id;
    });    
    links.enter().append("path")
                .merge(links)
                    .attr("d", (d,i)=>{
                        return lineFunction( getLinePoints(d) );
                    })
                    .attr("stroke", "blue")
                    .attr("stroke-width", 1)
                    .attr("fill", "none")
                    .attr("id",(d)=>{
                        return "link-"+d.id;
                    });
    links.exit().remove();
    // ADD LINES based on data (globalProps.relationshipsModel) -- SECTION END --

    // UPDATE DATA IN THE PARENT ELEMENT (handled by React)
    dataUpdated(globalProps);
}

function myRender(){

     // ADD NODES based on data (globalProps.dataModel)
    renderNodes();    
    // ADD LINES based on data (globalProps.relationshipsModel)
    renderLines();
    
}

// LISTENERS


export default class D3 extends React.Component{

    constructor(props){
        super(props);
        // this.myProps = props.myProps;
        dataUpdated = props.dataUpdated;
        nodeClicked = props.nodeClicked;
        sourceNodeDefined = false;
    }

    render(){
        return(
            <svg style={{ height: '100%', width:'100%',border:'dashed' }} ref="myRef" >
                <g id="lines-group">
                </g>
                <g id="container-div" >
                </g>                
            </svg>
        );
    }

    componentDidMount(){   
        globalProps = JSON.parse(JSON.stringify( this.props.myProps ));        
        mayAddNode = this.props.mayAddNode;
        mayAddLine = this.props.mayAddLine;
        myRender();
    }

    componentWillUnmount(){
        // remove listeners :
        d3.selectAll(".node").on("contextmenu", null);
        d3.select("svg").on("click", null);
        d3.selectAll(".node").on("click", null);
        d3.selectAll(".node").on('mousedown.drag', null);
    }

    componentWillReceiveProps(nextProps) {
        // update data based on new props
        if( ! ( _.isEqual( globalProps.dataModel --- nextProps.myProps.dataModel)) ){
            globalProps.dataModel = JSON.parse(JSON.stringify( nextProps.myProps.dataModel ));
            renderNodes();
        }
        if( ! ( _.isEqual( globalProps.relationshipsModel --- nextProps.myProps.relationshipsModel)) ){
            globalProps.relationshipsModel = JSON.parse(JSON.stringify( nextProps.myProps.relationshipsModel ));
            renderLines();
        }
        // globalProps = JSON.parse(JSON.stringify( nextProps.myProps ));

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
            renderNodes();
        }
    }

    shouldComponentUpdate(){
        return false;
    }
  
}

// ---- LISTENERS - SECTION START ----

function nodeDeleteListener(){
    // Each node will be deleted on right click
    d3.selectAll(".node").on("contextmenu", function (d, i) {
        // DELETE ON RIGHT-CLICK functionality
        d3.event.preventDefault();
        let nodeId = getNodeId(d.id);
        
        // FIRST : remove links to/from this node
        let arrayOfIndexes = [];
        globalProps.relationshipsModel.map((link,i)=>{
            if(link.from == nodeId || link.to == nodeId){
                let index = globalProps.designRelations.map((item)=>{return item.id}).indexOf(link.designId);
                (index >= 0) && globalProps.designRelations.splice(index, 1);
                arrayOfIndexes.push(i);
            }
        });
        // var valuesArr = ["v1","v2","v3","v4","v5"],
        // removeValFromIndex = [0,4,2]; 
        // removeValFromIndex.sort(function(a,b){ return a - b; }); // asceding
        // for (var i = removeValFromIndex.length -1; i >= 0; i--){
        //     valuesArr.splice(removeValFromIndex[i],1);
        // }
        arrayOfIndexes.sort(function(a,b){ return a - b; }); // asceding
        for (var x = arrayOfIndexes.length -1; x >= 0; x--){
            globalProps.relationshipsModel.splice(arrayOfIndexes[x],1);
        }
        
        // -- delete element which clicked from dataModel array --
        
        let designRemoveIndex = globalProps.design.map((item) => {
            return item.id; 
        }).indexOf(d.id);
        let removeIndex = globalProps.dataModel.map((item)=>{
            return item.id;
        }).indexOf( nodeId );
        (removeIndex >= 0) && globalProps.dataModel.splice(removeIndex, 1); 
        (designRemoveIndex >= 0) && globalProps.design.splice(designRemoveIndex, 1); 

        

        // UPDATE DATA IN THE PARENT ELEMENT (handled by React)
        dataUpdated(globalProps);

        // re-update dom & remove the proper dom elements :
        myRender();
        // must render all (both renderNodes() and renderLines())
    });
}

function nodeAddListener(){
    // A new node will be added each time
    // user clicks on container
    // The coordinates of the new node will be taken
    // as input from mouse coordinates
    d3.select("svg").on("click", function(){
        if(mayAddNode()){
            let inputCoordinates = d3.mouse(this);
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
            renderNodes();
        }
    } );
}

function nodeSelectListener(){
    // Each time a node is click on,
    // call nodeClicked() function (passed in props, from parent element)
    // so parent component may handle the event properly
    d3.selectAll(".node").on("click", function(d,i){
        
        if(sourceNodeDefined){
            // dataUpdated(globalProps);
            let flag = mayAddLine(true);
            if(flag){
                // add target node , update globalProps.relationshipsModel
                // mayAddLine(...) gets true as arg, so : Parent.state.paletteEvents.addLine === false
                globalProps.linksCounter = globalProps.linksCounter + 1;
                globalProps.relationshipsModel.push(
                    {
                        label:'is aware of',
                        from:sourceNodeId,   // source node id
                        to:getNodeId(d.id),            // target node id
                        linkType: 'arrow',
                        id:globalProps.linksCounter,
                        designId:globalProps.linksCounter
                    }
                );
                sourceNodeId = undefined;
                sourceNodeDefined = false;
                renderLines();
            }
        }else{
            if(mayAddLine(false)){
                sourceNodeDefined = true;
                sourceNodeId = getNodeId(d.id);
            }else{
                // update data in parent component !! VERY IMPORTAND - do this before you call any listener of parent component
                dataUpdated(globalProps);
                // then call the listener on data component
                let selectedNode = globalProps.dataModel.map((n)=>{return n.designId}).indexOf(d.id);
                selectedNode = globalProps.dataModel[selectedNode];
                nodeClicked(selectedNode,i);
            }
        }  
    });
}

function nodeOnDraggListener(){
    d3.selectAll(".node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended
        ));
}

// ---- LISTENERS - SECTION END ----


// ---- DRAGG - SECTION START ----
function dragstarted(d) {
    d3.select(this).style("cursor", "all-scroll");
    d3.select(this).raise().classed("active", true);
}
  
function dragged(d) {
    // d is type of : globalProps.design
    if(d.style.shape ==='circle'){
        d.x = d3.event.x;
        d.y = d3.event.y;
        // d3.select(this).attr("cx", d.x = d3.event.y ).attr("cy", d.y = d3.event.y );
        d3.select("#"+getNodeId(d.id))
            .attr("cx",d.x)
            .attr("cy",d.y);        
        setCoordinates(d.id,d.x,d.y);
        
        // update design
        globalProps.relationshipsModel.map((link)=>{
            if(link.from == getNodeId(d.id)){
                setDesignRelations(link.designId, {x1:d.x , y1:d.y});
            }else if(link.to == getNodeId(d.id)){
                setDesignRelations(link.designId, {x2:d.x , y2:d.y});
            }
        });
        renderLines();

    }else if(getShape(d.designId)==='square' || getShape(d.designId)==='triangle'){
        // d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
    }
}
  
function dragended(d) {
    d3.select(this).style("cursor", "default");     
    d3.select(this).classed("active", false);
}
// ---- DRAGG - SECTION END ----

// ---- FUNCTIONS HELPERS - SECTION START ----
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
            item.style.x0 = x0;
            item.style.y0 = y0;
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

function getLinePoints(d){
    return[
        {x:d.x1, y:d.y1},
        {x:d.x2, y:d.y2}
    ];
}

function getNodeDesignId(nodeId){
    let res = undefined;
    globalProps.dataModel.map((node)=>{
        if(node.id == nodeId){
            res = node.designId;
        }
    });
    return res;
}

function getNodeId(designId){
    let res = undefined;
    globalProps.dataModel.map((node)=>{
        if(node.designId == designId){
            res = node.id;
        }
    });
    return res;
}

function setDesignRelations(linkDesignId, setProperties){
    globalProps.designRelations.map((linkDesign)=>{
        if(linkDesign.id == linkDesignId){
            setProperties.x1 ? linkDesign.x1 = setProperties.x1 : undefined;
            setProperties.y1 ? linkDesign.y1 = setProperties.y1 : undefined;
            setProperties.x2 ? linkDesign.x2 = setProperties.x2 : undefined;
            setProperties.y2 ? linkDesign.y2 = setProperties.y2 : undefined;
        }
    });
    
}

function updateDesignRelations(){
    // TO-DO : UPDATE ONLY ADDS, WHAT ABOUT DELETE ???
    globalProps.relationshipsModel.map((link)=>{   
        let designExists = false;
        globalProps.designRelations.map((designLink)=>{
            if(designLink.id == link.designId){
                designExists = true;
            }
        });
        if(designExists!=true){
            // if the design of the link does not exist, create it :
            globalProps.designRelations.push({
                x1:getCoordinates( getNodeDesignId(link.from) ).x,
                y1:getCoordinates( getNodeDesignId(link.from) ).y,
                x2:getCoordinates( getNodeDesignId(link.to) ).x,
                y2:getCoordinates( getNodeDesignId(link.to) ).y, 
                id:link.designId
            })
        }
    });
}
// ---- FUNCTIONS HELPERS - SECTION END ----
