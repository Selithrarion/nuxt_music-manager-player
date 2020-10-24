import colors from 'vuetify/es5/util/colors';

export default {
	head: {
		titleTemplate: '%s - nuxt_music-manager',
		title: 'nuxt_music-manager',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{ hid: 'description', name: 'description', content: '' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},
	css: [],
	plugins: [],
	components: true,
	buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify', '@nuxtjs/axios'],
	modules: ['@nuxtjs/pwa'],
	axios: {
		baseURL: process.env.BASE_URL,
	},
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		theme: {
			light: true,
			themes: {
				light: {
					primary: colors.lime.accent4,
					accent: colors.blueGrey.darken3,
					secondary: colors.lightGreen.darken1,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3,
				},
			},
		},
	},
	build: {
		extend(config, ctx) {
			config.module.rules.push({
				test: /\.(ogg|mp3|mp4|wav|mpe?g)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			});
		},
	},
	env: {
		appName: 'NuxtMusicPlayer',
	},
	serverMiddleware: [
		{
			path: '/',
			handler: '~/api/index.js',
		},
	],
	pageTransition: 'v-fade-transition',
};
