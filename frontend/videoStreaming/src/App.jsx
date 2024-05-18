import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import videoPlayer from './videoPlayer'
import { useRef } from 'react'

function App() {
 const playerRef=useRef(null)
 const videoLink= "http://localhost:49152/uploads/course/535fe08f-2c36-495b-acb8-f28dc29f2e69/index.m3u8";

 const videoPlayerOptions={
  controls:true,
  responsive:true,
  fluid:true,
  sourses:[
    {
      src:videoLink,
      type:"application/x-mpegURL"
    }
  ] 
 }
 const handlePlayerReady = (player) => {
  playerRef.current = player;

  // You can handle player events here, for example:
  player.on("waiting", () => {
    videojs.log("player is waiting");
  });

  player.on("dispose", () => {
    videojs.log("player will dispose");
  });
};

  return (
    <>
    <div>
      <h1>video player</h1>
    </div>
    <videoPlayer/>
    options={videoPlayerOptions}
    onReady={handlePlayerReady}
     
    </>
  )
}

export default App
