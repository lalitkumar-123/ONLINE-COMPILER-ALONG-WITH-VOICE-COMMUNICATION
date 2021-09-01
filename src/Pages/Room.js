import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import 'react-split-pane'
import Editor from './Editor'
import Splitpane from 'react-split-pane' 
import {Button} from 'react-bootstrap'
import Peer from 'peerjs'
import axios from 'axios'
import io from 'socket.io-client'
import '../Css/Room.css'

const endpoint = 'http://localhost:5000';

export default function Room() {
    const {roomid} = useParams();
    const [roomID,setRoomID] = useState(roomid);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [fontSize, setFontSize] = useState('');
    const [language, setLanguage] = useState('');
    const [body, setBody] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [clickaudio, setClickAudio] = useState(false);
    var peers = {};
    var audios = {};
    var myAudio;
    var myPeer;

    const [widthLeft, setWidthLeft] = useState('');
    const [mypeer, setMypeer] = useState('');
    const [mystream, setMystream] = useState('');
    const [widthRight, setWidthRight] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [submissionid, setSubmissionid] = useState();
    const [submissionstatus, setSubmissionstatus] = useState();

    // const [myAudio, setMyAudio] = useState(false);
    const [inAudio, setInAudio] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
 
    const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32'];
    const languages = {
        c: 'c_cpp',
        cpp: 'c_cpp',
        python: 'python',
        python3: 'python',
        java: 'java',
        javascript: 'javascript',
        kotlin: 'kotlin',
        rust: 'rust'
    };

    const languagess = Object.keys(languages);

    const themes = [
        'monokai',
        'github',
        'solarized_dark',
        'dracula',
        'eclipse',
        'tomorrow_night',
        'tomorrow_night_blue',
        'xcode',
        'ambiance',
        'solarized_light'
    ].sort();

    const updateBody = (value) => {
        setBody(value);
        console.log("body:"+body);
    };

    const updateInput = (value) => {
        setInput(value);
        console.log("input:"+input);
    };

    const updateOutput = (value) => {
        setOutput(value);
        console.log("output:"+output);
    };

    useEffect(() => {
        const th = localStorage.getItem('theme');
        const fs = localStorage.getItem('fontSize');
        const la = localStorage.getItem('language');
        if(th!=null || fs!=null || la!=null)
        {
            setTheme(th);
            setFontSize(fs);
            setLanguage(la);
        }
        else
        {
            setTheme('monokai');
            setFontSize('8');
            setLanguage('cpp');
        }
    }, []);

    const connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
    };

    const socket = io.connect(endpoint,connectionOptions);

    useEffect(() => {
        socket.emit('user-joined', roomid);
        socket.on('message', (message) => {
            console.log(message);
        })
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [window.location.search])

    const getAudioStream = () => {
        const myNavigator =
            navigator.mediaDevices.getUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.webkitGetUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.mozGetUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.msGetUserMedia;
        return myNavigator({ audio: true });
    };

    const createAudio = ({id,stream}) => {
        console.log("hello");
        const data = {id, stream};
        console.log(id, stream);
        if (!audios[id]) {
            const audio = document.createElement('audio');
            audio.id = id;
            audio.srcObject = stream;
            if (myPeer && id == myPeer.id) {
                myAudio = stream;
                audio.muted = true;
            }
            audio.autoplay = true;
            audios[id] = data;
            console.log('Adding audio: ', id);
        } // } else {
        //     console.log('adding audio: ', id);
        //     // @ts-ignore
        //     document.getElementById(id).srcObject = stream;
        // }
    };

    const removeAudio = (id) => {
        delete audios[id];
        const audio = document.getElementById(id);
        if (audio) audio.remove();
    };

    const destroyConnection = () => {
        console.log('distroying', audios, myPeer.id);
        if (audios[myPeer.id]) {
            const myMediaTracks = audios[myPeer.id].stream.getTracks();
            myMediaTracks.forEach((track) => {
                track.stop();
            });
        }
        if (myPeer) myPeer.destroy();
    };

    const setPeersListeners = (stream) => {
        myPeer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (userAudioStream) => {
                createAudio({ id: call.metadata.id, stream: userAudioStream });
            });
            call.on('close', () => {
                removeAudio(call.metadata.id);
            });
            call.on('error', () => {
                console.log('peer error');
                if (!myPeer.destroyed) removeAudio(call.metadata.id);
            });
            peers[call.metadata.id] = call;
        });
    };

    const newUserConnection = (stream) => {
        socket.on('userJoinedAudio', (userId) => {
            console.log("new"+userId);
            const call = myPeer.call(userId, stream, { metadata: { id: myPeer.id } });
            call.on('stream', (userAudioStream) => {
                createAudio({ id: userId, stream: userAudioStream });
            });
            call.on('close', () => {
                removeAudio(userId);
            });
            call.on('error', () => {
                console.log('peer error');
                if (!myPeer.destroyed) removeAudio(userId);
            });
            peers[userId] = call;
        });
    };

    // socket.on('userJoinedAudio', (userId) => {
    //         console.log("new"+userId);
    //         const call = myPeer.call(userId, mystream, { metadata: { id: myPeer.id } });
    //         call.on('stream', (userAudioStream) => {
    //             createAudio({ id: userId, stream: userAudioStream });
    //         });
    //         call.on('close', () => {
    //             removeAudio(userId);
    //         });
    //         call.on('error', () => {
    //             console.log('peer error');
    //             if (!myPeer.destroyed) removeAudio(userId);
    //         });
    //         peers[userId] = call;
    //     });

    useEffect(() => {
        if (inAudio) {
            myPeer = new Peer();
            myPeer.on('open', (userId) => {
                console.log(userId);
                getAudioStream().then((stream) => {
                    setMystream(stream);
                    socket.emit('joinAudioRoom', {roomId: roomID, userId: userId});
                    stream.getAudioTracks()[0].enabled = !isMuted;
                    newUserConnection(stream);
                    setPeersListeners(stream);
                    createAudio({ id: myPeer.id, stream: stream });
                });
            });
            myPeer.on('error', (err) => {
                console.log('peerjs error: ', err);
                if (!myPeer.destroyed) myPeer.reconnect();
            });
            socket.on('userLeftAudio', (userId) => {
                console.log('user left aiudio:', userId);
                if (peers[userId]) peers[userId].close();
                removeAudio(userId);
            });
        } else {
            console.log('leaving', myPeer);
            if (myPeer) {
                socket.emit('leaveAudioRoom', myPeer.id);
                destroyConnection();
            }
            myAudio = null;
        }
    }, [inAudio]);

    useEffect(() => {
        if (inAudio) {
            if (myAudio) {
                myAudio.getAudioTracks()[0].enabled = !isMuted;
            }
        }
    }, [isMuted]);

    //  const getAudioStream = () => {
    //     const myNavigator =
    //         navigator.mediaDevices.getUserMedia ||
    //         navigator.mediaDevices.webkitGetUserMedia ||
    //         navigator.mediaDevices.mozGetUserMedia ||
    //         navigator.mediaDevices.msGetUserMedia;
    //     return myNavigator({ audio: true });
    // };


    // const peer = new Peer();

    // const createAudio = (id, useraudiostream) => {
    //     if(id == mypeer) return;
    //     // console.log(mypeer);
    //     var data = {id, useraudiostream};
    //     // console.log(data);
    //     if (!peers[id]) {
    //         const audio = document.createElement('audio');
    //         audio.id = id;
    //         audio.srcObject = useraudiostream;
    //         if (peer && id == peer.id) {
    //             myAudio = useraudiostream;
    //             audio.muted = true;
    //         }
    //         audio.autoplay = true;
    //         peers[id] = data;
    //         console.log('Adding audio: ', id);
    //     }
    // };

    // // socket.on('audiotransfer', (id) => {
    // //     if(clickaudio === false) return;
    // //     // if(id == mypeer) return;
    // //     const call = peer.call(id, mystream);
    // //     call.on('stream', useraudiostream => {
    // //         createAudio(id, useraudiostream);
    // //     })
    // //     call.on('close', () => {
    // //         removeAudio(id);
    // //     });
    // //     call.on('error', () => {
    // //         console.log('peer error');
    // //         if (!peer.destroyed) removeAudio(id);
    // //     });
    // //     peers[id] = call;
    // // });

    // const setPeersListeners = (stream) => {
    //     peer.on('call', (call) => {
    //         call.answer(stream);
    //         call.on('stream', (userAudioStream) => {
    //             createAudio(call.metadata.id, userAudioStream );
    //         });
    //         call.on('close', () => {
    //             removeAudio(call.metadata.id);
    //         });
    //         call.on('error', () => {
    //             console.log('peer error');
    //             if (!peer.destroyed) removeAudio(call.metadata.id);
    //         });
    //         peers[call.metadata.id] = call;
    //     });
    // };

    // const removeAudio = (id) => {
    //     delete peers[id];
    //     const audio = document.getElementById(id);
    //     if (audio) audio.remove();
    // };

    // const destroyConnection = () => {
    //     console.log('distroying', peers, peer.id);
    //     if (peers[peer.id]) {
    //         const myMediaTracks = peers[peer.id].stream.getTracks();
    //         myMediaTracks.forEach((track) => {
    //             track.stop();
    //         });
    //     }
    //     if (peer) peer.destroy();
    // };

    // const newUserConnection = (stream) => {
    //     socket.on('userJoinedAudio', (userId) => {
    //         console.log("innnn" + userId);
    //         const call = peer.call(userId, stream, { metadata: peer.id });
    //         call.on('stream', (userAudioStream) => {
    //             createAudio(userId, userAudioStream);
    //         });
    //         call.on('close', () => {
    //             removeAudio(userId);
    //         });
    //         call.on('error', () => {
    //             console.log('peer error');
    //             if (!peer.destroyed) removeAudio(userId);
    //         });
    //         peers[userId] = call;
    //     });
    // };

    // useEffect(()=>{
    //     if(clickaudio)
    //     {
    //         peer.on('open', function(id) {
    //         setMypeer(id);
    //         console.log("own id: "+id);
    //         socket.emit('userJoinedRoom',{ Id: id, room: roomID});
    //         getAudioStream().then((stream) => {
    //                 setMystream(stream);
    //                 // socket.emit('userJoinedAudio',id);
    //                 // socket.emit('joinAudioRoom', roomid, id);
    //                 // socket.emit('audiotransfer', id);
    //                 stream.getAudioTracks()[0].enabled = !isMuted;
    //                 newUserConnection(stream);
    //                 setPeersListeners(stream);
    //                 createAudio(id, stream);
    //             })
    //         });
    //     }
    //     else
    //     {
    //         console.log('leaving', peer);
    //         if (peer) {
    //             socket.emit('leaveAudioRoom', peer.id);
    //             destroyConnection();
    //         }
    //         myAudio = null;
    //     }
        
    // },[clickaudio])

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    useEffect(() => {
        if(submissionid==null && submissionstatus==null) return;
        if(submissionstatus == 'running') return;
        const params = new URLSearchParams({
                id: submissionid,
                api_key: 'guest'
            });
            const querystring = params.toString();
            axios.get(`https://api.paiza.io/runners/get_details?${querystring}`).then((res) => {
                const { stdout, stderr, build_stderr } = res.data;
                console.log(res.data);
                let output = '';
                if (stdout) output += stdout;
                if (stderr) output += stderr;
                if (build_stderr) output += build_stderr;
                setOutput(output);
                console.log(output);
            });
    }, [submissionstatus])

    useEffect(() => {
        if (submissionid) {
            setInterval(() => updateSubmissionStatus(), 2000);
        }
    }, [submissionid]);

    const updateSubmissionStatus = () => {
        const params = new URLSearchParams({
            id: submissionid,
            api_key: 'guest'
        });
        const querystring = params.toString();
        axios.get(`https://api.paiza.io/runners/get_status?${querystring}`)
        .then((res) => {
            const { status } = res.data;
            setSubmissionstatus(status);
        });
    };

    async function handlesubmit(e) {
        e.preventDefault();
        setOutput('');

        const params = {
            source_code: body,
            language: language,
            input: input,
            api_key: 'guest',
        };
        await axios.post(`https://api.paiza.io/runners/create`, params)
            .then((res) => {
                const { id, status } = res.data;
                console.log(id);
                console.log(status);
                setSubmissionid(id);
                setSubmissionstatus(status);
            })
            .catch((err) => {
                console.log(err);
                setSubmissionid('');
                setSubmissionstatus(err);
            });
    }

    return (
        <>
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="navbar-nav ms-4 mb-2 mb-lg">
                <li className="nav-item text-white list-header">
                    <label>Language</label>
                    <select
                        className="form-select"
                        defaultValue={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                        }}
                    >
                        {languagess.map((lang, index) => {
                            return (
                                <option key={index} value={lang} selected={lang == language}>
                                    {lang.toUpperCase()}
                                </option>
                            );
                        })}    
                    </select>
                </li>
                <li className="nav-item text-white list">
                    <label>Theme</label>
                    <select
                        className="form-select"
                        defaultValue={theme}
                        onChange={(e) => {
                            setTheme(e.target.value);
                        }}
                    >
                        {themes.map((lang, index) => {
                            return (
                                <option key={index} value={lang} selected={lang == theme}>
                                    {lang.toUpperCase()}
                                </option>
                            );
                        })}    
                    </select>
                </li>
                <li className="nav-item text-white list-footer">
                    <label>FontSize</label>
                    <select
                        className="form-select"
                        defaultValue={fontSize}
                        onChange={(e) => {
                            setFontSize(e.target.value);
                        }}
                    >
                        {fontSizes.map((lang, index) => {
                            return (
                                <option key={index} value={lang} selected={lang == fontSize}>
                                    {lang}
                                </option>
                            );
                        })}    
                    </select>
                </li>
            </ul>
            <Button type="submit" className="button1" onClick={(e) => handlesubmit(e)}>Run</Button>
            <Button className="button2" onClick={() => setInAudio(!inAudio)}>Speak</Button>
        </nav>
        <Splitpane
                split="vertical"
                minSize={150}
                maxSize={windowWidth - 150}
                defaultSize={windowWidth / 1.5}
                className="text-center"
                style={{ height: '85vh' }}
                // onChange={handleWidthChange}
            >
                <div>
                    <h5>Code</h5>
                    <Editor
                        theme={theme}
                        language={languages[language]}
                        width={''}
                        height={'80vh'}
                        body={body}
                        setBody={updateBody}
                        readOnly={''}
                        fontSize={fontSize}
                    />
                </div>
                <div className="text-center">
                    <h5>Input</h5>
                    <Editor
                        theme={theme}
                        language={''}
                        width={''}
                        height={window.innerHeight/2.7}
                        body={input}
                        setBody={updateInput}
                        readOnly={''}
                        fontSize={fontSize}
                    />
                    <h5>Output</h5>
                    <Editor
                        theme={theme}
                        language={''}
                        width={''}
                        height={window.innerHeight/2.7}
                        body={output}
                        setBody={updateOutput}
                        readOnly={true}
                        fontSize={fontSize}
                    />
                </div>
            </Splitpane>
        </>
    )
}
