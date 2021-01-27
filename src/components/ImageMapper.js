import React, { Component } from 'react';
import { RoomMap } from './RoomMap';
import '../css/style.css';
import Config from '../Config'
import { Map } from './Map';
import { RoomList } from './RoomList';

export class ImageMapper extends Component {

    constructor(props) {
        super(props);

        const scaling = 0.8;

        this.area = React.createRef();

        this.state = {
            imageWidth: (1440 * scaling),
            imageHeight: (741 * scaling),
            scaling: scaling,
            mousePressed: false,
            mousedownStartX: 0,
            mousedownStartY: 0,
            mousedownEndX: 0,
            mousedownEndY: 0,
            mapName: '',
            roomName: '',
            roomCapacity: 0,
            roomEmail: '',
            rooms: [],
            imageData: '',
            iconImageData: '',
            displayImage: false,
            displayTitle: true,
            hasParams: true,
            errorText: '',
            internalMode: false,
            shouldScale: false
        }

        this.onMouseOver.bind(this);
        this.onMouseOut.bind(this);
        this.getCursorPosition.bind(this);
        this.trackMouseMove.bind(this);
        this.submitRoom.bind(this);
        this.handleTextUpdate.bind(this);
        this.handleImageUpdate.bind(this);
        this.exportMap.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.handleIconUpdate = this.handleIconUpdate.bind(this);
    }

    handleRemoveRoom = (index) => {
        if (index !== -1) {
            const array = this.state.rooms.filter(item => item.email !== index.email);

            this.setState({
                rooms: array
            })

            this.reRenderAllAreasForCanvas(array);
        }
    }

    reRenderAllAreasForCanvas(array) {
        // clear canvas and re-draw each room
        this.clearDrawingCanvas('myCanvas');

        array.forEach((room) => {
            this.redrawRectangleForTarget(room.coordinates[0], room.coordinates[1], room.coordinates[2], room.coordinates[3]);
        })
    }

    handleIconUpdate = (event) => {
        var objectUrl = URL.createObjectURL(event.target.files[0])
        var img = new Image();
        img.src = objectUrl;

        var parent = this;

        img.onload = function () {
            parent.setState({
                iconImageData: objectUrl
            })
        };
    }

    handleImageUpdate = (event) => {
        var objectUrl = URL.createObjectURL(event.target.files[0])
        var img = new Image();
        img.src = objectUrl;

        var parent = this;

        img.onload = function () {
            parent.setState({
                imageHeight: this.naturalHeight,
                imageWidth: this.naturalWidth,
                imageData: objectUrl,
                displayImage: true
            })
        };
    }

    onAreaAdded = (area) => {
        this.area.current.addRoomToMap(area)
    }

    getCursorPosition = (event) => {

        var canvas = document.getElementById('mainImage');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (event.type === 'mousedown') {
            this.setState({
                mousePressed: true,
                mousedownStartX: x,
                mousedownStartY: y
            });

        }
        else {
            this.setState({
                mousePressed: false,
                mousedownEndX: x,
                mousedownEndY: y
            });

        }

    }

    onMouseOver = (event) => {
        var targetToMap = document.getElementById(event.target.getAttribute('name'));
        this.mapCoords(targetToMap.coords.split(','));
    }

    onMouseOut = (event) => {
        var canvas = document.getElementById('drawingCanvas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    onCoordinatesMouseOver = (event) => {
        var coords = event.target.coords.split(',');
        this.mapCoords(coords);
    }

    trackMouseMove = (event) => {
        var canvas = document.getElementById('mainImage');
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        if (this.state.mousePressed) {
            this.drawRectangleForTarget(this.state.mousedownStartX, this.state.mousedownStartY, x, y);
        }
        else {

        }
    }

    clearDrawingCanvas(canvasName) {
        var canvas = document.getElementById(canvasName);
        var ctx = canvas.getContext('2d');

        // always clear before re-drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    redrawRectangleForTarget(x, y, xx, yy) {
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        ctx.height = this.state.imageHeight;
        ctx.width = this.state.imageWidth;
        ctx.fillStyle = '#6264A7';

        var coords = [x, y, xx, yy];

        ctx.beginPath();

        ctx.moveTo(coords[0], coords[1])
        ctx.lineTo(coords[0], coords[1])
        ctx.lineTo(coords[2], coords[1])
        ctx.lineTo(coords[2], coords[3])
        ctx.lineTo(coords[0], coords[3])

        ctx.closePath();
        ctx.fill();
    }

    drawRectangleForTarget(x, y, xx, yy) {
        var canvas = document.getElementById('drawingCanvas');
        var ctx = canvas.getContext('2d');

        // always clear before re-drawing
        this.clearDrawingCanvas('drawingCanvas');

        ctx.height = this.state.imageHeight;
        ctx.width = this.state.imageWidth;
        ctx.fillStyle = 'green';

        var coords = [x, y, xx, yy];

        ctx.beginPath();

        ctx.moveTo(coords[0], coords[1])
        ctx.lineTo(coords[0], coords[1])
        ctx.lineTo(coords[2], coords[1])
        ctx.lineTo(coords[2], coords[3])
        ctx.lineTo(coords[0], coords[3])

        ctx.closePath();
        ctx.fill();
    }

    submitRoom = (event) => {
        event.preventDefault();
        if (this.state.roomEmail.trim() === '') {
            this.setState({
                errorText: 'Email is required.'
            })
        }
        else if (this.state.roomName.trim() === '') {
            this.setState({
                errorText: 'Email is required.'
            })
        }
        else if (!this.state.rooms.some(item => this.state.roomEmail === item.email)) {
            this.setState({
                rooms: [...this.state.rooms, { name: this.state.roomName, coordinates: [this.state.mousedownStartX, this.state.mousedownStartY, this.state.mousedownEndX, this.state.mousedownEndY], email: this.state.roomEmail, capacity: this.state.roomCapacity }]
            });

            this.setState({
                roomName: '',
                roomCap: '',
                roomEmail: '',
                errorText: ''
            })

            this.clearDrawingCanvas('drawingCanvas');
        }
        else {
            console.log('Email exist');
            this.setState({
                errorText: 'Email already exists.'
            })
        }
    }

    handleTextUpdate = (event) => {
        if (event.target.name === 'rName') {
            this.setState({
                roomName: event.target.value
            })
        }
        if (event.target.name === 'rCap') {
            this.setState({
                roomCapacity: event.target.value
            })
        }
        if (event.target.name === 'rEmail') {
            this.setState({
                roomEmail: event.target.value
            })
        }
        if (event.target.name === 'mName') {
            this.setState({
                mapName: event.target.value
            })
        }
    }

    exportMap() {
        var imageData = '';
        const toDataURL = url => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))


            console.log(Config.APIEndpoint);


        toDataURL(this.state.imageData)
            .then(dataUrl => {
                imageData = dataUrl
                var content = {
                    'rooms': this.state.rooms,
                    'imageData': imageData,
                    'imageWidth': this.state.imageWidth,
                    'imageHeight': this.state.imageHeight,
                    'mapName': this.state.mapName
                }

                var data = JSON.stringify(content);
                fetch(`${Config.APIEndpoint}/PostTeamsMapData`, {
                    method: 'POST',
                    body: data
                }).then(response => response.blob())
                    .then(blob => {
                        console.log(blob);
                        var blobUrl = window.URL.createObjectURL(blob);
                        var templink = document.createElement('a');
                        templink.href = blobUrl;
                        templink.setAttribute('download', 'manifest.zip');
                        templink.click();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
    }

    render() {
        return (
            <>
                {
                    this.props.location.search === '' ?
                        <div>
                            <div className={this.state.displayTitle ? 'main-frame' : 'hidden'} >
                                <canvas className={this.state.displayImage ? '' : 'hidden'} width={this.state.imageWidth} height={this.state.imageHeight} id='drawingCanvas'></canvas>
                                <canvas className={this.state.displayImage ? '' : 'hidden'} width={this.state.imageWidth} height={this.state.imageHeight} id='myCanvas'></canvas>

                                <img draggable='false'
                                    className={this.state.displayImage ? 'map maphilighted' : 'hidden'}
                                    onMouseDown={this.getCursorPosition.bind(this)}
                                    onMouseUp={this.getCursorPosition.bind(this)}
                                    onMouseMove={this.trackMouseMove.bind(this)}
                                    src={this.state.imageData}
                                    width={this.state.imageWidth} height={this.state.imageHeight} alt='officeMap' useMap='#officeMap' id='mainImage'
                                />
                                <div className={this.state.displayImage ? 'hidden' : 'main-title text-center'}>
                                    <h1 className={this.state.displayImage ? 'hidden' : 'display-4 text-center'}>Teams map maker</h1>
                                    <h2 className={this.state.displayImage ? 'hidden' : 'text-center'}>Start by uploading an image of your office map.</h2>
                                </div>

                                <div className='container col-md-8'>
                                    <p className={this.state.displayImage ? '' : 'hidden'}> Use your mouse to map out your office rooms</p>
                                    <div className={this.state.displayImage ? 'form-group' : 'hidden'}>
                                        <div className={this.iconImageData === '' ? 'icon-preview col-md-4' : 'hidden'}>
                                            <img src={this.state.iconImageData} alt='Teams icon' />
                                        </div>

                                        <div className={this.state.displayImage ? 'col-md-12' : 'hidden'}>
                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <label className='control-label col'>Map name: (will be displayed in Teams left-side tab)</label>
                                                    <input className='form-control col' type='text' onChange={this.handleTextUpdate.bind(this)} value={this.state.mapName} name='mName' />
                                                </div>
                                                <div className='col-md-6'>
                                                    <label className='control-label col'>Room name:</label>
                                                    <input className='form-control col' type='text' onChange={this.handleTextUpdate.bind(this)} value={this.state.roomName} name='rName' />
                                                </div>
                                                <div className='col-md-6'>
                                                    <label className='control-label col'>Room capacity</label>
                                                    <input className='form-control col' type='text' onChange={this.handleTextUpdate.bind(this)} value={this.state.roomCapacity} name='rCap' />
                                                </div>
                                                <div className='col-md-6'>
                                                    <label className='control-label col'>Room booking email</label>
                                                    <input className='form-control col' type='text' onChange={this.handleTextUpdate.bind(this)} value={this.state.roomEmail} name='rEmail' />
                                                </div>
                                                <div className='col col-sm-6'>
                                                    <button className='btn btn-primary submitroombtn' onClick={this.submitRoom.bind(this)}>Add room</button>
                                                    {
                                                        this.state.errorText.trim() !== '' ? <p className='text-danger'>{this.state.errorText}</p>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                                <div className='col-md-12'>
                                                    <div className='col-sm-6'>
                                                        <button className='btn btn-primary submitroombtn' onClick={this.exportMap.bind(this)}>Export map</button>
                                                    </div>
                                                    <br />
                                                </div>
                                            </div>

                                            <RoomMap
                                                hasHighlight={false}
                                                mapName={'officeMap'}
                                                canvasName='myCanvas'
                                                rooms={this.state.rooms}
                                                imageHeight={this.state.imageHeight}
                                                imageWidth={this.state.imageWidth}
                                                shouldScale={this.state.shouldScale} />
                                            <RoomList rooms={this.state.rooms} handleRemoveRoom={this.handleRemoveRoom} />
                                        </div>
                                    </div>
                                    <div className={this.state.displayImage ? 'hidden' : 'container imageselection'}>
                                        <span className='btn btn-primary btn-file col-md-12 text-center'>
                                            Select image<input type='file' onChange={this.handleImageUpdate.bind(this)} />
                                        </span>
                                        <p className='text-center'>The image will keep it's original size. Recommended size is approx. 1200 width but depends on general screen resolution.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <Map queryString={window.location.href} />
                }
            </>);
    }
}