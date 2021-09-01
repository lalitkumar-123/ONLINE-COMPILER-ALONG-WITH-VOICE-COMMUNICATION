import React from 'react'
import Navbar from './Navbar'
import { Button,Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import '../Css/Cards.css'


export default function Home() {

    const history = useHistory();

    return (
        <>
        <Navbar/>
        <Card className="card d-flex bg-dark">
            <ul className="d-flex list-main">
                <li className="list-item text-white mx-4">CREATE A ROOM</li>
                <li className="list-item text-white mx-5">JOIN A ROOM</li>
            </ul>
            <ul className="d-flex">
                <li className="list-item text-white mx-1"><Button className="ms-4" onClick={() => history.push("/newroom")}>Create Room</Button></li>
                <li className="list-item text-white mx-5"><Button className="ms-4 me-4" onClick={() => history.push("/joinroom")}>Join Room</Button></li>
            </ul>
        </Card>
        </>
    )
}
