<template>
  <div class="player">

    <v-text-field v-model="playerSearch" class="player__search ml-auto mr-4" label="Поиск" prepend-icon="mdi-search"></v-text-field>

    <player-controls
      :trackPlaying="trackPlaying"
      :loop="trackLoop"
      :progress="trackProgress"
      :shuffle="trackShuffle"
      @trackplay="trackPlay"
      @trackpause="trackPause"
      @trackskip="trackSkip"
      @tracklooptoggle="trackLoopToggle"
      @trackupdateseek="trackUpdateSeek"
      @toggleshuffle="trackShuffleToggle"
    ></player-controls>

    <v-skeleton-loader
      type="table"
		  v-if="contentLoaded !== true"
		  :loading="contentLoading"
		  transition="fade-transition"
    ></v-skeleton-loader>

    <player-panel 
      v-if="contentLoaded"
      :music="filteredDataBySearch"
      :selectedTrack="selectedTrack"
      @trackselect="trackSelect"
      @trackplay="trackPlay">
    </player-panel>
  </div>
</template>

<script>
import {Howl, Howler} from 'howler'

export default {
  middleware: ['auth'],
  async asyncData({store}) {
		const musicData = await store.dispatch('manager/GET_MUSIC')
		return {musicData}
  },

  data() {
    return {
      musicData: [],
      playerSearch: '',
      selectedTrack: null,
      trackPlaying: false,
      index: 0,
      trackLoop: false,
      trackSeek: 0,
      trackShuffle: false,
      contentLoaded: false,
      contentLoading: true,
    }
  },
  watch: {
    trackPlaying() {
      this.trackSeek = this.currentTrack.howl.seek()
      let trackUpdateSeek
      if (this.trackPlaying) {
        trackUpdateSeek = setInterval(() => {
          this.trackSeek = this.currentTrack.howl.seek()
        }, 250)
      } else {
        clearInterval(trackUpdateSeek)
      }
    },
  },
  computed: {
    currentTrack() {
      return this.musicData[this.index]
    },
    trackProgress() {
      if (this.currentTrack.howl.duration() === 0) return 0
      return (this.trackSeek / this.currentTrack.howl.duration()) * 100
    },
    filteredDataBySearch() {
      return this.musicData.filter(track => track.title.toLowerCase().includes(this.playerSearch))
    },
  },

  created() {
    this.musicData.forEach( (track) => {
    const file = track.created + track.originalFileName
    track.howl = new Howl({
      src: ['../static/' + file],
      onend: () => {
        if (this.trackLoop) {
          this.trackPlay(this.index)
        } else {
          this.trackSkip('next')
        }
      }
      })
    })
  },

  methods: {
    trackSelect(track) {
      this.selectedTrack = track
    },
    trackPlay(index) {
      const selectedTrackIndex = this.musicData.findIndex(track => track === this.selectedTrack)
      if (typeof index === 'number') {
      } else if (this.selectedTrack) {
         if (this.selectedTrack !== this.currentTrack) {
           this.trackStop()
          }
       index = selectedTrackIndex
       } else {
         index = this.index
       }
       const track = this.musicData[index].howl
       if (track.playing()) {
         return
       } else {
         track.play()
       }
      
      this.selectedTrack = this.musicData[index]
      this.trackPlaying = true
      this.index = index
    },
    trackPause() {
      this.currentTrack.howl.pause()
      this.trackPlaying = false
    },
    trackStop() {
      this.currentTrack.howl.stop()
      this.trackPlaying = false
    },

    trackSkip(direction) {
      let index = 0
      const lastIndex = this.musicData.length - 1

      if (this.trackShuffle) {
        index = Math.round(Math.random() * lastIndex)
        while (index === this.index) {
          index = Math.round(Math.random() * lastIndex)
        }
      } else if (direction === "next") {
          index = this.index + 1
          if (index >= this.musicData.length) {
            index = 0
        }
      } else {
          index = this.index - 1
          if (index < 0) {
            index = this.musicData.length - 1
        }
      }
      this.trackSkipTo(index)
    },
    trackSkipTo(index) {
      if (this.currentTrack) {
        this.currentTrack.howl.stop()
      }
      this.trackPlay(index)
    },
    trackLoopToggle(value) {
      this.trackLoop = value
    },
    trackShuffleToggle(value) {
      this.trackShuffle = value
    },
    trackUpdateSeek(percents) {
      const track = this.currentTrack.howl
      if (track.playing()) {
        track.seek((track.duration() / 100) * percents)
      }
    }
  },
  head: {
		title: `Плеер | ${process.env.appName}`,
  },
  beforeMount() {
		const readyHandler = () => {
			if (document.readyState === 'complete') {
				this.contentLoading = false;
				this.contentLoaded = true;
				document.removeEventListener('readystatechange', readyHandler);
			}
		};
		document.addEventListener('readystatechange', readyHandler);
		readyHandler();
	}
}
</script>

<style scoped>
.player__search {
  max-width: 200px;
}

</style>