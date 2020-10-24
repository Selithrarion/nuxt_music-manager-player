<template>
	<div class="app">	   
		<v-card class="mt-6">
			<v-card-text>
				<v-form v-model="valid" class="mt-6" ref="form" @submit.prevent="onSubmit">
					<v-container>
						<v-row class="justify-center">
							<v-col cols="12" sm="6">
								<v-text-field v-model="login" placeholder="TestUser" :rules="[rules.login]" outlined label="Логин"></v-text-field> 
							</v-col>
						</v-row>
						<v-row class="justify-center">
							<v-col cols="12" sm="6">
								<v-text-field v-model="password" type="password" placeholder="TestUser" :rules="rules.password" outlined label="Пароль"></v-text-field> 
							</v-col>
						</v-row>
						<v-row class="justify-center">
							<v-col cols="12" sm="6">
								<v-btn
									color="primary" 
									:loading="loadingLogin" 
									:disabled="!valid"
									type="submit"
								>
									Войти
								</v-btn>                    
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</v-card-text>
		</v-card>
		
		<v-snackbar
			v-model="snackbarLogin"
			color="error"
			timeout="2000"
			elevation="4"
			multi-line
			outlined
			top
			light
			transition="slide-y-transition"
		>
			<span>Нужно залогиниться (логин и пароль - TestUser)</span>
		</v-snackbar>
		<v-snackbar
			v-model="snackbarError"
			color="error"
			timeout="2000"
			elevation="4"
			multi-line
			outlined
			top
			light
			transition="slide-y-transition"
		>
			<span>{{messageError}}</span>
		</v-snackbar>
	</div>   
</template>

<script>
export default {
	layout: 'empty',
	data() {
		return {
			login: '',
			password: '',
			valid: false,
			loadingLogin: false,
			rules: {
				login: v => !!v,
				password: [
					v => !!v,
					v => (v.length > 6) || 'Пароль должен быть длиннее 6-ти символов'
				]
				
			},
			snackbarLogin: false,
			snackbarError: false,
			messageError: '',
		}
	},
	methods: {
		async onSubmit() {
			if(this.valid) {
				this.loadingLogin = true;
				try {
					const formData = {
						login: this.login,
						password: this.password
					}
					await this.$store.dispatch('LOGIN', formData)
					this.$router.push('/player')
				} catch(err) {
					this.messageError = err.message
					this.snackbarError = true
					this.loadingLogin = false
					
				}
			}
		},
	},
	mounted() {
		const { message } = this.$route.query;
		switch (message) {
			case 'login':
				this.snackbarLogin = true;
				break;
			default:
				break;
		}
	},
	head: {
		title: `Логин | ${process.env.appName}`,
	},
}
</script>