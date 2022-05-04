

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const song = $('.song')
const playlist = $('.playlist')


 const app = {
     currentIndex: 0,
     isPlaying: false,
     isRandom: false,
     isRepeat: false,
     songs: [
        {
            name :'Ảo Ảnh',
            singer: 'Trung Hoa',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/song1.jpg'
        },
        {
            name :'Maps',
            singer: 'Maroon 5',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/song2.jpg'
        },
        {
            name :'Orb Sak Snea',
            singer: 'Vô danh',
            path: './assets/music/song3.mp3',
            image:'./assets/img/song3.jpg'
        },
        {
            name :'Star Sky',
            singer: 'Two Steps From Hell',
            path: './assets/music/song4.mp3',
            image:'./assets/img/song4.jpg'
        },
        {
            name :'Victory',
            singer: 'Two Steps From Hell',
            path: './assets/music/song5.mp3',
            image:'./assets/img/song5.jpg'
        },
        {
            name :'Vui Lắm Nha',
            singer: 'Remix',
            path: './assets/music/song6.mp3',
            image:'./assets/img/song6.jpg'
        },
        {
            name :'We Dont talk Anymore',
            singer: 'Charlie Puth',
            path: './assets/music/song7.mp3',
            image:'./assets/img/song7.jpg'
        }

    ],
     render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                      `
               })
               playlist.innerHTML= htmls.join('')
       
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWith = cd.offsetWidth

        // Xử lý cd quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
             duration: 10000, //10s
             iterations: Infinity
              
        })
        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWith = cdWith - scrollTop

            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0
            cd.style.opacity = newCdWith / cdWith
        }

        // xử lý khi play
        playBtn.onclick = function() {
            if (_this.isPlaying) {             
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi song đc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song đc pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // tiến độ bài hát
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
            
        }

        // tua bài hát
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next bài
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        // khi prev bài
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        // random bật/tắt
        randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
        }

        // phát lại
        repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)   
        }

        // next khi end bài
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {              
                nextBtn.click()
            }
        }

        // lắng nghe hành vi click vào list

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)') 
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()  
                               
            }
        }
    }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe các sự kiện
        this.handleEvents()

        // tải thông tin bài hát
        this.loadCurrentSong()

        // render playlist
        this.render()          
    }
 }

 app.start()
