import React from 'react';
// Call this component as : 
// 
// <GoogleMap 
//      lat={18.796143}
//      lng={98.979263}
// />

export default class GoogleMap extends React.Component{

    render(){
        return(
            <div style={{ height: '50vh' }} ref="map" />         
        );
    }

    componentDidMount(){
        this.map = new global.google.maps.Map(this.refs.map, {
            center: { lat: this.props.lat, lng: this.props.lng },
            zoom: 8
        });
    }

    componentWillReceiveProps(nextProps) {
        // though never re-rendered, the component will receive new props here
        this.map.panTo({ lat: nextProps.lat, lng: nextProps.lng });
    }

    shouldComponentUpdate(){
        return false;
    }
}