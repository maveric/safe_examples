import React, { Component } from 'react';
import Peer from 'simple-peer';
import logo from './logo.svg';
import './App.css';

class PeerView extends Component {
  constructor() {
    super()
    this.state = {
      connectionString: '',
      connectionPayload: '',
      connectionState: 'initializing',
      messages: [],
      myVideo: null,
      peerVideo: null
    }
  }
  sendDraft() {
    let msg = this.refs['draft'].value
    this.peer.send(msg)
    this.addMsg("Me: " + msg)
    this.refs['draft'].value = ""
  }

  submitResponse (){
    var val = JSON.parse(window.atob(this.refs['answer'].value));
    this.peer.signal(val)
  }

  addMsg (msg) {
    this.state.messages.unshift(msg)
    this.setState({"messages": this.state.messages})
  }

  componentWillMount() {
    this.setState({"connectionState": "requesting video permissions"});
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: "user",
        // frameRate: { ideal: 10, max: 15 }
      }
    }).then((stream) => {

      this.setState({
        "connectionState": "connecting",
        "myVideo": window.URL.createObjectURL(stream)
      })

      var peer = new Peer({ initiator: location.hash.length <= 1,
                            stream: stream,
                            trickle: false });
      var conData = location.hash.slice(1);

      this.peer = peer;
      console.log("mounting")

      // we are the second peer
      if (conData){
        var parse = JSON.parse(window.atob(conData))
        console.log("sending", parse)
        peer.signal(parse)
      }

      peer.on('signal',  (data) => {
        // automatically establish connection
        console.log("SIGNAL", data)
        this.setState({'connectionPayload': data });
      })
      peer.on('error', (err) => {
        this.addMsg('-- ERROR ' + (new Date()).toISOString() + ':' + err)
        console.log('error', err)
      })

      peer.on('connect', () => {
        this.setState({"connectionState": "connected"});
        this.addMsg('-- Connection Established: ' + (new Date()).toISOString())
      })

      peer.on('stream', (stream) => {
        this.setState({"peerVideo": window.URL.createObjectURL(stream)})
      })

      peer.on('data', (data) => {
        // incoming message
        console.log('data: ' + data)
        this.addMsg("Peer: " + data)
      })


    }).catch( (err) => {
      this.setState({"connectionState": err.toString()})
    })

  }
  render() {
    if (this.state.connectionState === 'connected') {
      return (<div>
        <form onSubmit={this.sendDraft.bind(this)}>
          <input type="text" ref="draft"
          /><button  type="submit">send</button>
      </form>
      <div>
        <ul>
          {this.state.messages.map((m) => <li>{m}</li>)}
        </ul>
      </div>
      <div>
        <video className="me" autoPlay={true}
          src={this.state.myVideo}></video>
        <video className="peer" autoPlay={true}
          src={this.state.peerVideo}></video>
      </div>
      </div>);
    }
    if (this.state.connectionPayload.type === "offer") {
      return <div>
        <h3>Waiting</h3>
        <p>Please tell the other party to go the following link</p>
        <p><a target="noopener" href={"/#" + window.btoa(JSON.stringify(this.state.connectionPayload))}>copy me</a></p>
        <p>
          And copy-paste their response here:
        </p>
        <form onSubmit={this.submitResponse.bind(this)}>
          <textarea ref="answer"></textarea>
          <button type="submit">send</button>
        </form>
      </div>
    } else if (this.state.connectionPayload.type === "answer") {
      return <div>
        <h3>Waiting</h3>
        <p>Please tell the other party to paste this into their field</p>
        <textarea>{window.btoa(JSON.stringify(this.state.connectionPayload))}
        </textarea>
      </div>
    }
    return (<div>{this.state.connectionState}</div>);
  }
}

class App extends Component {
  render() {
    if (!Peer.WEBRTC_SUPPORT) {
      return (
        <div className="App">
          <div className="App-header">
            <h2>Browser not support</h2>
          </div>
          <p className="App-intro">
          The browser you are using doesn't have the required <a href="http://caniuse.com/#search=webrtc" target="noopen">WebRTC support</a>. Please try again using latest Chrome or <a href="http://getfirefox.org/">Firefox</a>.
          </p>
        </div>
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to SAFE Signaling Demo</h2>
        </div>
        <PeerView />
      </div>
    );
  }
}

export default App;
