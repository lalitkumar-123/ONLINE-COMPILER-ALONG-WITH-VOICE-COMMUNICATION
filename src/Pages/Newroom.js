import React, { useRef, useState } from 'react'
import Navbar from './Navbar'
import { Form,Button,Card } from 'react-bootstrap'
import { v4 as uid } from 'uuid'
import { useHistory } from 'react-router-dom'
import '../Css/Cards.css'


export default function Newroom() {

    const roomref = useRef();
    const [room, setRoom] = useState();
    const history = useHistory();

    function submit (e) 
    {
        e.preventDefault();
        history.push(`/room/${roomref.current.value}`);
    }

    function generateid() 
    {
        setRoom(uid());
    }

    return (
        <div>
            <Navbar/>
            <Card className="card">
            <Card.Body className="card-body">
            <Form className="form" onSubmit={submit}>
                <Form.Group className="form-group">
                    <Form.Label className="form-field">ENTER ROOMID</Form.Label>
                    <Form.Control className="form-field mb-4" value={room} type="text" ref={roomref} placeholder="RoomID" required></Form.Control>
                </Form.Group>
                <Button onClick={generateid}>Generate Id</Button> 
                <Button type="submit" className="mx-2">Join Room</Button>
            </Form>
            </Card.Body>
            </Card>
        </div>
    )
}
