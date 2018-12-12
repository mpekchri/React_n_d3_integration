import React from 'react';
// import Graph from './Graph';
import D3 from './D3';

export default class MainApp extends React.Component{
    render(){
        return(
            <div style={{ height: '800px', width:'1600px' }}>
                <D3 />
            </div>
        );
    }
}