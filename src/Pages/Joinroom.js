import React, {useRef} from 'react'
import Navbar from './Navbar'
import {Form,Button,Card} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import '../Css/Cards.css'

export default function Joinroom() {
    
    const roomref = useRef();
    const history = useHistory();

    function submit (e) 
    {
        e.preventDefault();
        history.push(`/room/${roomref.current.value}`);
    }

    return (
        <div>
            <Navbar/>
            <Card className="card">
            <Card.Body className="card-body">
            <Form onSubmit={submit} className="form">
                <Form.Group className="form-group">
                    <Form.Label className="form-field">ENTER ROOMID</Form.Label>
                    <Form.Control className="form-field mb-4" type="text" ref={roomref} placeholder="RoomID" required></Form.Control>
                </Form.Group>
                <Button onClick={submit}>Join Room</Button>
            </Form>
            </Card.Body>
            </Card>
        </div>
    )
}
