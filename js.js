/*
      * 1. Render songs
      * 2. Scroll top
      * 3. Play / pause/ seek
      * 4. CD rotate
      * 5. Next / prev
      * 6. Random
      * 7. Next / Repeated when ended
      * 8. Active song
      * 9. Scroll active song into view
      * 10. Play song when click
      */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const currentProgress = $('#progress');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
  arraySongs: [],
  currentIndex: 0,
  isPlaying: false,
  onfocus: false,
  songs: [
    {
      name: "Don't Let Me Down",
      singer: "The Chainsmokers x Daya",
      path: "https://tainhacmienphi.biz/get/song/api/15067",
      image: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/01/06/f/e/3/f/1578292217455_600.jpg"
    },
    {
      name: "Faded",
      singer: "Alan Walker",
      path: "https://tainhacmienphi.biz/get/song/api/2581",
      image:
        "https://thenewsmexico.com/wp-content/uploads/2019/03/image8-5.jpg"
    },
    {
      name: "We Don't Talk Anymore",
      singer: "Charlie Puth x Selena Gomez",
      path:
        "https://tainhacmienphi.biz/get/song/api/2630",
      image: "https://i1.sndcdn.com/artworks-hADAxnACXWoAx6Og-YihIxg-t500x500.jpg"
    },
    {
      name: "Shape Of You",
      singer: "Ed Sheeran",
      path: "https://tainhacmienphi.biz/get/song/api/50854",
      image:
        "https://nld.mediacdn.vn/2017/14-ed-sheraan-1488983704317.jpg"
    },
    {
      name: "Closer",
      singer: "The Chainsmokers x Halsey",
      path: "https://tainhacmienphi.biz/get/song/api/2895",
      image:
        "https://file.tinnhac.com/resize/600x-/music/2017/03/04/okersearntheirfirsthot100101758x426-48d7.jpg"
    },
    {
      name: "Despacito",
      singer: "Luis Fonsi x Daddy Yankee",
      path:
        "https://tainhacmienphi.biz/get/song/api/2532",
      image:
        "https://file.tinnhac.com/resize/600x-/music/2017/07/25/1499940291-149991371-b35f.jpg"
    },
    {
      name: "Why Not Me",
      singer: "Enrique Iglesias",
      path: "https://tainhacmienphi.biz/get/song/api/2537",
      image:
        "https://theharmonica.vn/wp-content/uploads/2019/09/whynotme.jpg"
    },
    {
      name: "Asphyxia",
      singer: "NSZX",
      path: "https://tainhacmienphi.biz/get/song/api/209564",
      image:
        "https://khbvptr.vn/wp-content/uploads/2020/10/hoa-huong-duong-1-800x843.jpg"
    }
  ],

  render: function() {
    const htmls = this.songs.map(song => { 
      return `
        <div class="song ">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`
    })

    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() { 
        return this.songs[this.currentIndex];
      }
    });
  },
  
  handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xu ly CD play/pause
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000, //10 giay
      iterations: Infinity, //vo han
    })

    cdThumbAnimate.pause();


    // Xu ly phong to thu nho CD
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth =  cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    }

    // Xu ly khi click play
    playBtn.onclick = function() {
      if (_this.isPlaying) {
        audio.pause();
      }
      else {
        audio.play();
      }
    }

    // Xu ly khi play
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    }

    // Xu ly khi pause
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    }

    // Xu ly khi Next
    nextBtn.onclick = function() {
      if (randBtn.classList.contains('active')) {
        _this.currentIndex = _this.randSong();
        _this.loadCurrentSong();
      }
      else {
        _this.currentIndex == _this.songs.length-1 ? _this.currentIndex = 0 : _this.currentIndex++;
  
        _this.loadCurrentSong();
      }
    },
    
    // Xu ly khi Pre
    preBtn.onclick = function() {
      if (randBtn.classList.contains('active')) {
        _this.currentIndex = _this.randSong();
        _this.loadCurrentSong();
      }
      else {
        _this.currentIndex == 0 ? _this.currentIndex = _this.songs.length-1 : _this.currentIndex--;
  
        _this.loadCurrentSong();
      }
    }

    // Xu ly khi Rand
    randBtn.onclick = function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      }
      else {
        this.classList.add('active');

        
      }
    };


    // Xu ly khi Repeat
    repeatBtn.onclick = function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
      }
      else {
        this.classList.add('active');
      }
    }

    // Khi tien do bai hat thay doi
    let checkOnmouseAndTouch = true;
    currentProgress.onmousedown = function() {
      checkOnmouseAndTouch = false;
    }

    currentProgress.ontouchstart = function() {
      checkOnmouseAndTouch = false;
    }
    

    currentProgress.onchange = function () {
        const newTime = audio.duration * this.value / 100;
  
        audio.currentTime = newTime;
        checkOnmouseAndTouch = true;

    }
    
    audio.ontimeupdate = function() {
      if(checkOnmouseAndTouch && audio.duration ) {
        const currentPercent = this.currentTime / this.duration * 100;
        if(currentPercent) {
          currentProgress.value = currentPercent;
        }

      }
    }

    audio.onended = function() {
      if (repeatBtn.classList.contains('active')) {
        _this.loadCurrentSong();
      }
      else {
        if (randBtn.classList.contains('active')) {
          _this.currentIndex = _this.randSong();
          _this.loadCurrentSong();
        }
        else {
          _this.currentIndex == _this.songs.length-1 ? _this.currentIndex = 0 : _this.currentIndex++;
          _this.loadCurrentSong();
        }
      }
    }

    // Xu ly khi click song
    let allSongs = $$('.song');

    console.log(allSongs);

    for (let i = 0; i < allSongs.length; i++) {
      allSongs[i].onclick = function(){
        _this.currentIndex = i;

        _this.loadCurrentSong();
      }
    }
    
  },

  randSong: function() {
    var oldIndex;
    do {
        oldIndex = Math.round(Math.random() * 7);
    }
    while (this.arraySongs.includes(oldIndex) === true);

    this.arraySongs.push(oldIndex);
    
    if (this.arraySongs.length == this.songs.length) {
      this.arraySongs = [];
    }

    return oldIndex;
  },

  scrollToActiveSong: function() {
    setTimeout(function() {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 300)
  },

  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = `${this.currentSong.path}`;

    audio.play();
    this.activeSong();
    this.scrollToActiveSong();

  },

  activeSong: function() {
    const allTitles = $$('.title');
    const allSongs = $$('.song');
    console.log(allTitles, allSongs);

    for(var i = 0; i < allSongs.length; i++) {
      allSongs[i].classList.remove('active');
    }

    for(var i = 0; i < allTitles.length; i++) {
        if (allTitles[i].textContent === heading.textContent) {
          console.log(allTitles[i].textContent === heading.textContent);
          allSongs[i].classList.add('active');
        }
    }
  },


  start: function() {
    // Dinh nghia thuoc tinh
    this.defineProperties();

    // Render ra bai hat
    this.render();

    // Xu ly su kien
    this.handleEvents();

    
    // Tai bai hat hien tai
    this.loadCurrentSong();

    // Active Song;
    this.activeSong();
    
  }
}

app.start();