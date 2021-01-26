import React, { Component } from 'react';

export class RoomList extends Component {
    constructor(props) {
        super(props)

        this.removeRoom.bind(this);
    }

    removeRoom(i) {
        // trigger room deletion to parent ImageMapper
        this.props.handleRemoveRoom(i);
    }

    render() {
        return (
            <>
                {
                    <table className="table table-sm table-hover col-md-12">
                        <tbody>
                            <tr className='col-md-12'>
                                <th className='col-md-5'>Name</th>
                                <th className='col-md-5'>Email</th>
                                <th className='col-md-2'>Capacity</th>
                            </tr>
                            {
                                this.props.rooms.map((room, i) => {
                                    return (
                                        <tr key={i} className='col-md-12'>
                                            <td className='col-md-5'>{room.name}</td>
                                            <td className='col-md-5'>{room.email}</td>
                                            <td className='col-md-2'>{room.capacity}</td>
                                            <td>
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.removeRoom.bind(this, room)}> Remove</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                }
            </>
        )
    }
}