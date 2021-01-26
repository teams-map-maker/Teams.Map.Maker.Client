import React, { Component } from 'react';
import '../css/style.css';

export class MsftSelection extends Component {

    constructor(props) {
        super(props)

        this.state = {
            maps: [

                {
                    name: "Urban Escape",
                    location: "Stockholm",
                    country: "Sweden",
                    url: "https://teamsroomsfinder.com/?map=cc7b7dbd-fc93-4689-86f7-c1282ae7660a.json&token=sv%3D2019-02-02%26sr%3Db%26sig%3D6pOQK%252BR9iZs%252Fj70d5GkR6GKzKliQe8f%252Fh6bkbzjpDww%253D%26se%3D2045-02-03T12%253A29%253A10Z%26sp%3Drcw"
                }
            ]
        }
    }

    render() {
        return (<><div className="row msft-selection-header">
            <div>
                <h1 className="display-2">Teams room booking</h1>
            </div>
        </div>
            <div className="row">
                <div className="col">
                    <h3 className="display-4">Select your office</h3>
                    <br />
                    <br />
                    {
                        this.state.maps.map((map, i) => {
                            return <div className="col">
                                <a className="btn btn-outline-primary col-md-12" href={map.url}>{map.name} </a>
                            </div>
                        })

                    }

                </div>
            </div>
        </>);
    }
}
