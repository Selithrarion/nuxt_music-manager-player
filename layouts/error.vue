<template>
	<v-app>
		<v-container>
			<v-row class="justify-center mt-6">
				<v-col cols="12" sm="6">
					<h1 v-if="error.statusCode === 404" class="text-center">
						{{ pageNotFound }}
					</h1>
					<h1 v-else class="text-center">
						{{ otherError }}
					</h1>
					<NuxtLink to="/" >
						<v-btn block class="mt-4" color="primary">Перейти к странице логина</v-btn>
					</NuxtLink>
				</v-col>
			</v-row>
		</v-container>
		
	</v-app>
</template>

<script>
export default {
	layout: 'empty',
	props: {
		error: {
			type: Object,
			default: null,
		},
	},
	data() {
	return {
			pageNotFound: 'Страница не найдена :(',
			otherError: 'Случилась какая-то ошибка',
		}
	},
	head() {
		const title =
			this.error.statusCode === 404 ? this.pageNotFound : this.otherError
		return title
	},
}
</script>

<style scoped>
h1 {
	font-size: 20px;
}
</style>
