<template>
	<div class="player-controls mt-6 mb-4 mx-auto">
		<v-toolbar flat>
			<v-spacer></v-spacer>

			<v-btn icon @click="trackShuffleToggle">
				<v-icon color="lime accent-3" v-if="this.shuffle">mdi-shuffle</v-icon>
				<v-icon color="grey lighten-1" v-else>mdi-shuffle</v-icon>
			</v-btn>

			<v-btn outlined fab small color="lime accent-3" icon @click="trackSkip('prev')">
				<v-icon>mdi-skip-previous</v-icon>
			</v-btn>

			<v-btn v-if="!trackPlaying" class="mx-4" large outlined fab color="lime accent-3" icon @click="trackPlay">
				<v-icon>mdi-play</v-icon>
			</v-btn>
			<v-btn v-if="trackPlaying" class="mx-4" large outlined fab small color="lime accent-3" icon @click="trackPause">
				<v-icon>mdi-pause</v-icon>
			</v-btn>

			<v-btn outlined fab small color="lime accent-3" icon @click="trackSkip('next')">
				<v-icon>mdi-skip-next</v-icon>
			</v-btn>

			<v-btn icon @click="trackLoopToggle">
				<v-icon color="lime accent-3" v-if="this.loop">mdi-repeat</v-icon>
				<v-icon color="grey lighten-1" v-else>mdi-repeat</v-icon>
			</v-btn>

			<v-spacer></v-spacer>

			<v-btn icon class="hidden-sm-and-down" color="grey lighten-1" @click="volumeMute">
				<template v-if="!this.trackMuted" class="hidden-sm-and-down">
					<v-icon v-if="this.trackVolume >= 50" color="grey lighten-1" class="hidden-sm-and-down">mdi-volume-high</v-icon>
					<v-icon v-else-if="this.trackVolume > 0" color="grey lighten-1" class="hidden-sm-and-down">mdi-volume-medium</v-icon>
					<v-icon v-else class="hidden-sm-and-down" color="grey lighten-1">mdi-volume-off</v-icon>
				</template>
					<v-icon v-show="this.trackMuted" color="grey lighten-1" class="hidden-sm-and-down">mdi-volume-mute</v-icon>
					</v-btn>
					<v-slider v-model="trackVolume" style="max-width: 120px" class="hidden-sm-and-down pt-5 pr-2" track-color="grey lighten-1" @input="volumeUpdate(trackVolume)" max="100" min="0"></v-slider>
			</v-toolbar>
		<v-toolbar flat height="40" class="mt-4">
			<v-progress-linear
				v-model="trackProgress"
				height="10"
				striped
				color="lime accent-3"
				@change="trackUpdateSeek()"
			></v-progress-linear>
		</v-toolbar>
	</div>
</template>
 
<script>
import {Howl, Howler} from 'howler'

	export default {
		props: {
			trackPlaying: {
				type: Boolean,
				default: false,
			},
			loop: {
				type: Boolean,
				default: false,
			},
			progress: {
				type: Number,
				default: 0,
			},
			shuffle: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				trackVolume: 50,
				trackMuted: false,
				linearProgressPercents: 0,
			}
		},
		computed: {
			trackProgress: {
				get() {
					return this.progress
				},
				set(percents) {
					this.trackUpdateSeek(percents)
				},
			}
		},
		methods: {
			trackPlay() {
				this.$emit('trackplay')
			},
			trackPause() {
				this.$emit('trackpause')
			},
			trackSkip(direction) {
				this.$emit('trackskip', direction)
			},
			volumeUpdate(trackVolume) {
				trackVolume = trackVolume / 100
				Howler.volume(trackVolume)
			},
			volumeMute() {
				Howler.mute(!this.trackMuted)
				this.trackMuted = !this.trackMuted
			},
			trackLoopToggle() {
				this.$emit('tracklooptoggle', !this.loop)
			},
			trackUpdateSeek(percents) {
				this.$emit('trackupdateseek', percents)
			},
			trackShuffleToggle() {
				this.$emit('toggleshuffle', !this.shuffle)
			}
		},
		created() {
			Howler.volume(this.trackVolume)
		}
	}
</script>

<style scoped>
.player-controls {
}


</style>