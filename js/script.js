console.log("finally after doing a lot of styling now its js time");
let currentsong = new Audio();
let songs
let currFolder


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder
   
    let s = await fetch(`/${folder}/`);
    let response = await s.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
     songs = [];

   
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mpeg")) {
            // Decode the song name before pushing it into the array
            let decodedSong = decodeURIComponent(element.href.split(`/${folder}/`)[1]);
            songs.push(decodedSong);
        }
    }
        // Show all the songs in the playlist
        let call = document.querySelector(".songlist ul");
        call.innerHTML = ""

        for (const song of songs) {
            call.innerHTML += `
                <li> 
                    <img class="invert" src="img/music.svg" alt="">
                    <div class="info">
                        <div>${song}</div> <!-- Use the song name directly -->
                        <div>Ameen</div>
                    </div>
                    <div class="playnow">
                        <span>Playnow</span>
                        <img class="invert" src="img/play.svg" alt="">
                    </div>
                </li>`;
        }
    
        // Attach event listeners after the list is fully populated
        Array.from(call.getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                // this code gets the text from the first element inside an element with the class .info and removes any extra spaces from the beginning and end of the text.
                let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
                console.log("Selected song:", track); // Debugging to see the selected song
                playMusic(track); // Play the selected song
            });
        });
        return songs
    
    

    
}

const playMusic = (track,pause=false) => {
    let songPath = `/${currFolder}/` + track; // Construct the path
    console.log("Playing:", songPath); // Debugging to see the correct path
    currentsong.src = songPath; // Set the src for Audio
    if (!pause) {
        

        
        currentsong.play(); // Play the song
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};
async function  displayAlbums() {
    let s = await fetch(`/songs/`);
    let response = await s.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  cardparent = document.querySelector(".cardparent")
  let a = Array.from(as)
  for (let index = 0; index < a.length; index++) {
      const e = a[index]; 
    if(e.href.includes("/songs")&& !e.href.includes(".htaccess")){
        let file = e.href.split("/").slice(-2)[0]
        // now fetching the metadata 
        let s = await fetch(`/songs/${file}/info.json`);
        let response = await s.json();
        console.log(response);
        cardparent.innerHTML += ` <div data-folder="${file}" class="card ">
                        <div class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                fill="none">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="black" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>


                        </div>


                        <img aria-hidden="false" draggable="false" loading="eager"
                            src="/songs/${file}/cover.jpg"
                            alt="Nasheeds ☪️🕋( No Music)"
                            class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj"
                            sizes="(min-width: 1280px) 232px, 192px">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>

                    </div>`
    
    }
  }
  Array .from (document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])

    })

})
 
    
}






    


async function main() {
    
    // Get the list of all the songs
    await getsongs("songs/KJ");
    playMusic(songs[0],true)
  await  displayAlbums()

   
}
play.addEventListener("click", ()=>{
    if(currentsong.paused){
        
        currentsong.play()
        play.src = "img/pause.svg"
    
}
else {
        currentsong.pause()
        play.src = "img/play.svg"
}
})
// listen for timeupdate
currentsong.addEventListener("timeupdate",()=>{
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
})
// Attching event listener to seekbar and circle 

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    // Attching event listener to ham 
    document.querySelector(".ham").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
     
    })
    // Attaching event listener to cross 
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
     
    })
    // Attaching event listener to next
    // always remember for calling ids you have to use # 
    // document.querySelector("#next");
    
    // next.addEventListener("click",()=>{
    //     currentsong.src.split("/").splice(-1)[0]
    //     let index  = songs.indexOf( currentsong.src.split("/").splice(-1)[0])
    //     if (index+1>length){
    //         playMusic(songs[index+1])
    //     }
    
            
    
    //     console.log("next",songs[index + 1])
    //     })
    next.addEventListener("click", () => {
        // Extract the current song's name from the src
        let currentSongName = currentsong.src.split("/").splice(-1)[0];
        
        // Find the index of the current song
        let index = songs.indexOf(currentSongName);
        
        // Check if there is a next song
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]); // Play the next song
        } else {
            console.log("No next song available"); // Handle end of the list
        }
    
        console.log("Next song:", songs[index + 1]);
    });
    
        
    
    // Attaching event listener to prev
    prev.addEventListener("click", () => {
        // Extract the current song's name from the src
        let currentSongName = currentsong.src.split("/").splice(-1)[0];
        
        // Find the index of the current song
        let index = songs.indexOf(currentSongName);
        
        // Check if there is a previous song
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]); // Play the previous song
        } else {
            console.log("No previous song available"); // Handle start of the list
        }
    
        console.log("Previous song:", songs[index - 1]);
    });
    // Attching event to volume
    // You can change the volume of an audio element in JavaScript by adjusting its volume property. The volume property accepts values between 0 (muted) and 1 (full volume). You can use a range input to control the volume.
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to,"+ e.target.value + "/100")
        currentsong.volume = parseInt(e.target.value)/100
    
    })
    // Adding event on volume 
   let v =  document.querySelector(".volume").firstElementChild
   let volumeInput = document.querySelector(".range").getElementsByTagName("input")[0]
   v.addEventListener("click", (e)=>{
   if(v.src.includes("volume.svg")){
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    currentsong.volume = 0
    v.src = "img/mute.svg"
   }
   else{
    document.querySelector(".range").getElementsByTagName("input")[0].value = 30
    currentsong.volume = .30
    v.src = "img/volume.svg"
   }
    })
    

    


    








   
volumeInput.addEventListener("input", (e)=>{
if(e.target.value>0){
    currentsong.volume = e.target.value/100
      v.src = "img/volume.svg"

}
    else{
        currentsong.volume = 0
        v.src = "img/mute.svg"
    }

})

    


    






main();
