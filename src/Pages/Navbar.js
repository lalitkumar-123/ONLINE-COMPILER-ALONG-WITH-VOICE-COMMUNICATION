import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import '../Css/Navbar.css'

export default function Navbar() {
    const [roomId, setRoomId] = useState();
    const history = useHistory();

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="navbar-nav ms-2 mb-2 mb-lg-0">
                <li className="nav-item onhover">
                    <Link className="nav-link active" to="/">
                        Home
                    </Link>
                </li>
                <li className="nav-item onhover">
                    <Link className="nav-link active" to="/newroom">
                        New Room
                    </Link>
                </li>
                <li className="nav-item onhover">
                    <Link className="nav-link active" to="/joinroom">
                        Join Room
                    </Link>
                </li>
            </ul>
            <div className="d-flex" style={{marginLeft:"46rem"}}>
                <input 
                    className="form-control me-2"
                    type="search"
                    placeholder="Enter Room ID"
                    aria-label="Search"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                    if (roomId) {
                            history.push(`/room/${roomId}`);
                            setRoomId('');
                        }
                    }}
                >
                    Join
                </button>
            </div>
        </nav>
        </>
    )
}
