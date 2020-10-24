<template>
  <v-card class="player-panel">
    <v-list>
      <v-list-item
        v-for="(track, index) in music"
        :key="track.created"
        :class="{selected: track === selectedTrack}"
        v-ripple="{ class: `white--text` }"
        @click="trackSelect(track)"
        @dblclick="playTrack()"
      >
        <v-list-item-content>
          <v-list-item-title>
            <span class="player-panel__index">{{ index | trackNumber }}</span>
            {{ track.author }} - {{ track.title }}
          </v-list-item-title>
        </v-list-item-content>
        <v-spacer></v-spacer>
        {{ track.howl.duration() | trackMinutes }}
      </v-list-item>
    </v-list>
  </v-card>
</template>
 
<script>
  export default {
    props: {
      music: Array,
      selectedTrack: Object
    },
    filters: {
      trackNumber(value) {
        return value + 1
      },
      trackMinutes(value) {
        if (!value || typeof value !== "number") return "00:00"
        let min = parseInt(value / 60)
        let sec = parseInt(value % 60)
        min = min < 10 ? "0" + min : min
        sec = sec < 10 ? "0" + sec : sec
        value = min + ":" + sec
        return value
      }
    },
    methods: {
      trackSelect(track) {
        this.$emit('trackselect', track)
      },
      playTrack(index) {
        this.$emit('trackplay', index)
      }
    }
  }
</script>

<style scoped>
.player-panel__index {
  padding: .5rem .8rem
}
.selected {
  transition: all 200ms ease-out;
  background-color: var(--primary-color);
}
</style>