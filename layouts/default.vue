<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			fixed
			app
		>
			<v-list nav>
				<v-list-item
					v-for="(item, i) in items"
					:key="i"
					:to="item.to"
					router
					exact
>
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title v-text="item.title" />
					</v-list-item-content>
				</v-list-item>
			</v-list>

		</v-navigation-drawer>

		<v-app-bar flat app>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title v-text="title" />
			<v-spacer />
		</v-app-bar>

		<v-main>
			<v-container>
				<nuxt />
			</v-container>
		</v-main>

		<v-footer v-if="this.$route.path !== '/player'" app>
			<span>&copy; {{ new Date().getFullYear() }}</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			clipped: false,
			drawer: false,
			fixed: false,
			items: [
				{
					icon: 'mdi-apps',
					title: 'Главная',
					to: '/',
				},
				{
					icon: 'mdi-chart-bubble',
					title: 'Менеджер',
					to: '/manager',
				},
				{
					icon: 'mdi-music-note',
					title: 'Плеер',
					to: '/player',
				},
			],
			title: "Менеджер музыки"
		}
	},
}
</script>
<style>
:root {
	--primary-color: #C6FF00;
}
</style>
