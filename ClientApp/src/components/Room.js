import React, { Component } from 'react';
import Utils from '../Utils';

export class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageWidth: 0,
            maxheight: 500,
            maxWidth: 1200
        }

        this.onCoordinatesClick.bind(this);
        this.onMouseOut.bind(this);
        this.onCoordinatesMouseOver.bind(this);
    }

    onCoordinatesMouseOver() {
        var rowTarget = document.getElementById(this.props.email);
        if (rowTarget !== undefined && rowTarget !== null) {
            rowTarget.classList.add("highlightRow");
        }
        if (this.props.hasHighlight === true) {

            this.drawRedRectangleForTarget(this.props.coordinates[0], this.props.coordinates[1], this.props.coordinates[2], this.props.coordinates[3], "highlightingCanvas");
        }
        else {
            this.drawRectangleForTarget(this.props.coordinates[0], this.props.coordinates[1], this.props.coordinates[2], this.props.coordinates[3], this.props.canvasName);
        }
    }

    onMouseOut() {
        var rowTarget = document.getElementById(this.props.email);
        if (rowTarget !== undefined && rowTarget !== null) {
            rowTarget.classList.remove("highlightRow");
        }

        this.clearCanvas();
    }


    componentDidMount() {
        this.drawRectangleForTarget(this.props.coordinates[0], this.props.coordinates[1], this.props.coordinates[2], this.props.coordinates[3], this.props.canvasName);
    }

    onCoordinatesClick = (event) => {
        event.preventDefault();
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hours = date.getHours();

        var startDateString = year + "-" + this.pad((month + 1), 2) + "-" + this.pad(day, 2) + "T" + this.pad(hours, 2) + ":00:00";
        var endDateString = year + "-" + this.pad((month + 1), 2) + "-" + this.pad(day, 2) + "T" + this.pad(hours, 2) + ":30:00";

        var teamsLink = "https://teams.microsoft.com/l/meeting/new?subject=Room%20Booking&startTime=" + startDateString + "&endTime=" + endDateString + "&attendees="

        var fullLink = teamsLink + this.props.email;
        window.open(fullLink, "_blank");
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    drawRectangleForTarget(x, y, xx, yy, canvasName, color) {
        var canvas = document.getElementById(canvasName);
        var ctx = canvas.getContext("2d");
        var scaling = Utils.formatSize(this.props.imageHeight, this.props.imageWidth, this.state.maxheight, this.state.maxWidth);

        if (this.props.shouldScale === false) {
            scaling = 1
        }

        ctx.height = this.props.imageHeight;
        ctx.width = this.props.imageWidth;
        ctx.fillStyle = "#6264A7";

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

    drawRedRectangleForTarget(x, y, xx, yy, canvasName) {
        var canvas = document.getElementById(canvasName);
        var ctx = canvas.getContext("2d");
        var scaling = Utils.formatSize(this.props.imageHeight, this.props.imageWidth, this.state.maxheight, this.state.maxWidth);
        if (this.props.shouldScale === false) {
            scaling = 1
        }
        ctx.height = this.props.imageHeight;
        ctx.width = this.props.imageWidth;
        ctx.fillStyle = "red";

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

    clearCanvas() {
        if (this.props.hasHighlight === true) {
            var canvas = document.getElementById("highlightingCanvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    render() {

        const name = this.props.name;
        const email = this.props.email;
        const capacity = this.props.capacity;
        var scaling = Utils.formatSize(this.props.imageHeight, this.props.imageWidth, this.state.maxheight, this.state.maxWidth);
        const parsedCoords = "" + (this.props.coordinates[0] * scaling) + ", " + (this.props.coordinates[1] * scaling) + ", " + (this.props.coordinates[2] * scaling) + ", " + (this.props.coordinates[3] * scaling) + "";
        const parsedTitle = name + " (" + capacity + " capacity)";
        return (
            <area
                onMouseOver={this.onCoordinatesMouseOver.bind(this)}
                onMouseOut={this.onMouseOut.bind(this)}
                onClick={this.onCoordinatesClick.bind(this)}
                className="mapcoords"
                shape="rect"
                //id={name}
                coords={parsedCoords}
                href="#"
                title={parsedTitle}
                alt={name}
                email={email} />
        );
    }
}