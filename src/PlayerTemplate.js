import React from "react";
import { render } from "react-dom";
import ReactPlayer from 'react-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'

/*
The goal is to create an audio player, similar to what you'd find at the bottom of the Spotify app.
All our media files are accessible via URLs, as you can see below in `this.tracks`. We're using a
library called react-player (https://www.npmjs.com/package/react-player) for the actual streaming
logic. Our MediaPlayer component encapsulates a ReactPlayer component.

The Player component should implement the following functionality (in order of priority):
1. It should have a play/pause button. Clicking on the button should play/pause the song
   accordingly. DONE
2. It should display the track name, artist name, and artwork for the given track. DONE
3. It should have next/previous buttons for navigating to the next/previous track in `this.tracks`. DONE
4. Style it! The player should always appear at the bottom of the page, and should take up the full
   width of the screen. DONE
5. A seeker for the song. It should grpahically show the amount of the song that has been played
   relative to the total length of the song. Look into progressInterval and onProgress in the
   ReactPlayer library. DONE

Notes:
- Assume for now that we will always have a harcoded playlist in `this.tracks`.
- Feel free to add additional libraries if necessary.
- Prioritize a clean implementation.
- Launch localhost:3000 in the browser to view the result.
*/
class Player extends React.Component {
  constructor(props) {
    super(props);
    // This is the 'playlist' of tracks that we're playing/pausing, navigating through, etc.
    this.tracks = [
      {
        id: 1,
        trackName: "The Pretender",
        artistName: "Foo Fighters",
        artworkUrl: "https://images.sk-static.com/images/media/profile_images/artists/29315/huge_avatar",
        mediaUrl: "https://p.scdn.co/mp3-preview/6aba2f4e671ffe07fd60807ca5fef82d48146d4c?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000 // This track is 30 seconds long (30,000 milliseconds).
      },
      {
        id: 2,
        artistName: "Arctic Monkeys",
        trackName: "Do I Wanna Know?",
        artworkUrl: "https://cps-static.rovicorp.com/3/JPG_500/MI0003/626/MI0003626958.jpg?partner=allrovi.com",
        mediaUrl: "https://p.scdn.co/mp3-preview/9ec5fce4b39656754da750499597fcc1d2cc82e5?cid=1cef747d7bdf4c52ac981490515bda71",
        durationMilliseconds: 30000
      },
    ];

    this.state = {
      playing: false,
      currentTrack: 0,
      progress: 0
    }
  }

  render() {
    const currentTrackInfo = this.tracks[this.state.currentTrack];
    const currentTrackLength = Math.round(currentTrackInfo.durationMilliseconds / 1000);
    const progressSeconds =  Math.round(this.state.progress * currentTrackLength);
    const playedMinutes = Math.floor(progressSeconds / 60);
    const playedSeconds = progressSeconds - playedMinutes * 60;
    const totalMinutes = Math.floor(currentTrackLength / 60);
    const totalSeconds = currentTrackLength - totalMinutes * 60;
    return (
      <div className='player'>
        <MediaPlayer playing={this.state.playing} url={currentTrackInfo.mediaUrl} onProgress={this.onProgress.bind(this)} />
        <div className='player-buttons'>
          <button className='player-button' onClick={this.previousSong.bind(this)}>
            <FontAwesomeIcon icon={faStepBackward} />
          </button>
          <button className='player-button' onClick={this.togglePlay.bind(this)}>
            <FontAwesomeIcon icon={this.state.playing ? faPause : faPlay} />
          </button>
          <button className='player-button' onClick={this.nextSong.bind(this)}>
            <FontAwesomeIcon icon={faStepForward} />
          </button>
        </div>
        <div className='seeker'>
          <div className='seeker-time'>{playedMinutes + ':' + (playedSeconds < 10 ? '0' : '') + playedSeconds}</div>
          <div className='seeker-bar'>
            <div className='seeker-progress' style={{width: this.state.progress * 100 + '%'}}></div>
          </div>
          <div className='seeker-time'>{totalMinutes + ':' + (totalSeconds < 10 ? '0' : '') + totalSeconds}</div>
        </div>
        <img className='player-artwork' src={currentTrackInfo.artworkUrl} alt='Artwork' />
        <div className='player-info'>
          <div>{currentTrackInfo.trackName}</div>
          <div>{currentTrackInfo.artistName}</div>
        </div>
      </div>
    );
  }

  togglePlay() {
    this.setState(prevState => ({
      playing: !prevState.playing
    }));
  }

  previousSong() {
    this.setState(prevState => ({
      currentTrack: Math.max(0, prevState.currentTrack - 1),
      progress: 0
    }));
  }

  nextSong() {
    this.setState(prevState => ({
      currentTrack: Math.min(this.tracks.length - 1, prevState.currentTrack + 1),
      progress: 0
    }));
  }

  onProgress(progress) {
    this.setState(prevState => ({
      progress: progress.played
    }));
  }
}

/*
Library documentation: https://www.npmjs.com/package/react-player
*/
class MediaPlayer extends React.Component {
  render() {
    return (
      <div>
        <ReactPlayer
          ref="reactPlayer"
          playing={this.props.playing}
          height={'0px'}
          width={'0px'}
          config={{ file: { forceAudio: true } }}
          url={this.props.url}
          onProgress={this.props.onProgress} /> 
      </div>
    )
  }
}

export default Player;