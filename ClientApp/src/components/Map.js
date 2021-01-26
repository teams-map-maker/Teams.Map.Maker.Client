import React, { Component } from 'react';
import { RoomMap } from './RoomMap';
import '../css/style.css';
import Config from '../Config';
import Utils from '../Utils';

export class Map extends Component {

    constructor(props) {
        super(props);

        const scaling = 1;

        this.state = {
            imageWidth: (1440 * scaling),
            imageHeight: (741 * scaling),
            originalWidth: 0,
            originalHeight: 0,
            scaling: scaling,
            mousePressed: false,
            mousedownStartX: 0,
            mousedownStartY: 0,
            mousedownEndX: 0,
            mousedownEndY: 0,
            rooms: [],
            imageData: "",
            isLoading: true,
            errorText: "",
            maxHeight: 500,
            maxWidth: 1200
        }

        this.onMouseOut.bind(this);
        this.onMouseEnter.bind(this);
        this.clearCanvas.bind(this);
        this.drawRectangleForTarget.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(email, i) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hours = date.getHours();

        var startDateString = year + "-" + this.pad((month + 1), 2) + "-" + this.pad(day, 2) + "T" + this.pad(hours, 2) + ":00:00";
        var endDateString = year + "-" + this.pad((month + 1), 2) + "-" + this.pad(day, 2) + "T" + this.pad(hours, 2) + ":30:00";

        var teamsLink = "https://teams.microsoft.com/l/meeting/new?subject=Room%20Booking&startTime=" + startDateString + "&endTime=" + endDateString + "&attendees="

        var fullLink = teamsLink + email;

        window.open(fullLink, "_blank");

    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    onMouseEnter = (room) => {
        if (room.coordinates !== undefined) {
            this.drawRectangleForTarget(room.coordinates[0], room.coordinates[1], room.coordinates[2], room.coordinates[3], "highlightingCanvas");
            if (room.email !== undefined) {
                this.highlightRow(document.getElementById(room.email));
            }
        }
    }

    onMouseOut = (room) => {
        if (room.email !== undefined) {
            this.removeHighligtFromRow(document.getElementById(room.email))
        }

        this.clearCanvas();
    }

    highlightRow(row) {
        row.classList.add("highlightRow");
    }

    removeHighligtFromRow(row) {
        row.classList.remove("highlightRow");
    }

    clearCanvas() {
        var canvas = document.getElementById("highlightingCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawRectangleForTarget(x, y, xx, yy, canvasName) {
        var canvas = document.getElementById(canvasName);
        var ctx = canvas.getContext("2d");

        ctx.height = this.state.imageHeight;
        ctx.width = this.state.imageWidth;
        ctx.fillStyle = "red";

        // use original for matching positioning
        var scaling = this.state.scaling;
        var coords = [
            (x * scaling),
            (y * scaling),
            (xx * scaling),
            (yy * scaling)
        ];

        ctx.beginPath();

        ctx.moveTo(coords[0], coords[1])
        ctx.lineTo(coords[0], coords[1])
        ctx.lineTo(coords[2], coords[1])
        ctx.lineTo(coords[2], coords[3])
        ctx.lineTo(coords[0], coords[3])

        ctx.closePath();
        ctx.fill();
    }


    componentDidMount() {
        this.getAllPosts();

        var container = document.getElementsByClassName("container")[0];
        container.classList.remove("container");
    }

    getAllPosts() {
        var q = this.props.queryString.split("map=");
        var mapTarget = q[1].split('&');
        var token = q[1].split('token=')[1];

        var mapId = mapTarget[0];
        this.setState({
            isLoading: true,
            loadingMessage: "Loading map"
        })

        fetch(`${Config.APIEndpoint}GetTeamsMapData?map=${mapId}&token=${token}`, {
            method: 'GET'
        }).then(response => {
            response.json().then((body) => {
                var scaling = Utils.formatSize(body.imageHeight, body.imageWidth, this.state.maxHeight, this.state.maxWidth);

                this.setState({
                    rooms: body.rooms,
                    imageData: body.imageData,
                    imageHeight: (body.imageHeight * scaling),
                    imageWidth: (body.imageWidth * scaling),
                    originalHeight: body.imageHeight,
                    originalWidth: body.imageWidth,
                    isLoading: false,
                    scaling: scaling
                })

            }).catch((error) => {
                console.log(error);
                this.setState({
                    isLoading: false,
                    errorText: "Error while fetching map: " + error
                })
            })
        }).catch((error) => {
            console.log(error);
            this.setState({
                isLoading: false,
                errorText: "Error: " + error
            })
        })
    }


    render() {
        return (
            <div className="viewMap">
                {
                    this.state.isLoading ?
                        <div className="row">
                            <div className="loading-div">
                                <svg id="loading-spinner" width="100" height="100">
                                    <circle cx="50" cy="50" r="37.5" stroke="#0047b3" strokeWidth="10" fill="transparent" stroke-offset="3" />
                                    <path stroke="#ccc" strokeWidth="10.5"
                                        d="M 25, 22
                                    a 37.5,37.5 0 1,0 50,0" fill="none" />
                                </svg>
                                <p>Loading map</p>
                            </div>
                        </div>
                        :
                        this.state.errorText.trim() !== "" ?
                            <p>{this.state.errorText}</p>
                            :
                            <>
                                <div className="sticky-top map-div">
                                    <canvas width={this.state.imageWidth} height={this.state.imageHeight} id="mapCanvas"></canvas>
                                    <canvas width={this.state.imageWidth} height={this.state.imageHeight} id="highlightingCanvas"></canvas>

                                    <img draggable="false"
                                        className="map maphilighted"
                                        src={this.state.imageData}
                                        width={this.state.imageWidth} height={this.state.imageHeight} alt="officeMap"
                                        useMap="#mappedOffice"
                                        id="mapImage" />
                                    <RoomMap
                                        mapName={"mappedOffice"}
                                        canvasName={"mapCanvas"}
                                        hasHighlight={true}
                                        rooms={this.state.rooms}
                                        imageHeight={this.state.originalHeight}
                                        imageWidth={this.state.originalWidth} />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <table className="table pointer-table table-sm col-md-6 room-table">
                                            <tbody>
                                                <tr>
                                                    <th>Rooms</th>
                                                </tr>
                                                {
                                                    // sort by room name and then map it out
                                                    this.state.rooms.sort(function (a, b) {
                                                        if (a.name < b.name) { return -1; }
                                                        if (a.name > b.name) { return 1; }
                                                        return 0;
                                                    }).map((room, i) => {
                                                        return (
                                                            <tr key={i} id={room.email} onClick={this.handleClick.bind(this, room.email)} onMouseEnter={this.onMouseEnter.bind(room)} onMouseOut={this.onMouseOut.bind(room)} coordinates={room.coordinates}>
                                                                <td onClick={this.handleClick.bind(this, room.email)} onMouseEnter={this.onMouseEnter.bind(this, room)} onMouseOut={this.onMouseOut.bind(this, room)}>{room.name} ({room.capacity})</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <p>Click on an item either in the list or on the map to start booking a room.
                                        You are only able to book rooms that are highlighted.</p>
                                        <p>Hover over an item on the map to view room details.</p>
                                    </div>
                                </div>
                            </>
                }
            </div >);
    }
}
