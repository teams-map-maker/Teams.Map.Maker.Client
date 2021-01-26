import { Room } from './Room';
import React, { Component } from 'react';

export class RoomMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageHeight: 0,
            imageWidth: 0,
            maxheight: 500,
            maxWidth: 1200,
            scaling: 1
        }

        this.onCoordinatesMouseOver.bind(this);
        this.onMouseOut.bind(this);
        this.onCoordinatesClick.bind(this);
    }

   
    addRoomToMap = (input) => {
        this.setState({
            rooms: [...input, this.state.rooms]
        })

        var newArray = [input, ...this.state.rooms];
        this.setState({
            rooms: newArray
        });
        console.log("RoomMap - updating rooms " + (this.state.rooms))
    }

    onCoordinatesMouseOver = (event) => {
        console.log("Mouse over " + event.target);
    }

    onMouseOut = (event) => {
        console.log("Mouse out " + event.target);
    }

    onCoordinatesClick = (event) => {
        console.log("Coordinates click " + event.target);
    }

    render() {
        return (<map id="map" name={this.props.mapName}>
            {
                this.props.rooms.map((room, i) => {
                    return (<Room key={i} name={room.name} email={room.email} coordinates={room.coordinates} capacity={room.capacity} imageHeight={this.props.imageHeight} imageWidth={this.props.imageWidth} canvasName={this.props.canvasName} hasHighlight={this.props.hasHighlight} shouldScale={this.props.shouldScale}/>)
                })
            }
        </map>)
    }
}