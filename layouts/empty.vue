<template>
	<v-app>
		<v-app-bar flat app>
			<v-toolbar-title>Менеджер музыки</v-toolbar-title>
			<v-spacer />
		</v-app-bar>

		<v-main>
			<v-container>
				<nuxt keep-alive/>
			</v-container>
		</v-main>

		<v-footer  app>
			<span>&copy; {{ new Date().getFullYear() }}</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
}
</script>