export const actions = {
	async GET_MUSIC() {
		try {
			const data = await this.$axios.$get('api/music');
			return data;
		} catch (err) {
			console.error(err);
		}
	},
	async ADD_MUSIC({ commit }, formData) {
		try {
			const fd = new FormData();
			const now = Date.now();

			fd.append('title', formData.title);
			fd.append('author', formData.author);
			fd.append('created', now);
			fd.append('stars', formData.stars);
			fd.append('originalFileName', formData.music.name);
			fd.append('music', formData.music);

			return await this.$axios.$post('api/music', fd);
		} catch (err) {
			console.error(err);
		}
	},
	async UPDATE_MUSIC({ commit }, { title, author, stars, id }) {
		try {
			return await this.$axios.$put('/api/music/' + id, {
				title,
				author,
				stars,
			});
		} catch (err) {
			console.error(err);
		}
	},
	async REMOVE_MUSIC({ commit }, id) {
		try {
			return await this.$axios.$delete('/api/music/' + id);
		} catch (err) {
			console.error(err);
		}
	},
};
