<template>
    <div class="manager">

        <h2 class="text-center mt-4">Добавить музыку</h2>
			<v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
            <v-container>
                <v-row class="justify-center">
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="title" :rules="[rules.title]" label="Название" prepend-icon="mdi-playlist-music"></v-text-field> 
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="author" :rules="[rules.author]" label="Автор" prepend-icon="mdi-account-music"></v-text-field> 
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-col cols="12" sm="6">
                        <v-file-input
                            v-model="music"
                            show-size
                            label="Файл музыки"
                            :rules="[rules.music]"
                            accept="audio/*"
                            prepend-icon="mdi-download"
                        ></v-file-input>
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-col cols="12" sm="6">
                        <v-rating
                            v-model="stars"
                            empty-icon="mdi-star-outline"
                            full-icon="mdi-star"
                            half-icon="mdi-star-half-full"
                            hover
                            length="5"
                            value="3"
                            size="30"
                            color="primary"
                            class="text-center"
                        ></v-rating>
                    </v-col>
                </v-row>
               <v-row class="justify-center mt-8">
                  <v-col cols="12" sm="6">
                        <v-btn
                            block 
                            large 
                            outlined 
                            color="primary" 
                            :loading="loadingAdd" 
                            :disabled="!valid"
							type="submit"
                        >
                            Добавить
                        </v-btn>                    
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
			

		<v-skeleton-loader
          type="table"
		  v-if="contentLoaded !== true"
		  :loading="contentLoading"
		  transition="fade-transition"
        ></v-skeleton-loader>

		<v-data-table
			v-show="contentLoaded"
			:headers="headers"
			:items="musicData"
			sort-by="created"
			:sort-desc="sortDesc"
			class="elevation-1 mt-16"
			:no-data-text="noDataText"
			:footer-props="footerProps"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Твоя музыка</v-toolbar-title>
					<v-spacer></v-spacer>
				</v-toolbar>
			</template>

			<template v-slot:item.created="{ item }">
				<span>
					<v-icon small>mdi-calendar-range</v-icon>
					<span>{{ formatDate(item.created) }}</span>
				</span>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-dialog
					v-model="dialogMusicEdit"
					max-width="700px"
					:retain-focus="false"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							v-bind="attrs"
							v-on="on"
							@click="editItem(item._id)"
						>
							<v-icon class="mr-2"> mdi-pencil </v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title>
							<span class="headline">Редактировать песню</span>
						</v-card-title>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field
											v-model="editItemName"
											label="Название песни"
										></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field
											v-model="editItemAuthor"
											label="Автор песни"
										></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-rating
											v-model="editItemStars"
											empty-icon="mdi-star-outline"
											full-icon="mdi-star"
											half-icon="mdi-star-half-full"
											hover
											length="5"
											value="3"
											size="40"
											color="primary"
											label="Рейтинг"
											class="text-center"
										></v-rating>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="blue darken-1"
								text
								@click="dialogEditClose"
							>
								Отмена
							</v-btn>
							<v-btn
								color="blue darken-1"
								text
								:loading="loadingAdd"
								:disabled="loadingAdd"
								@click="dialogEditSave"
							>
								Сохранить
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				<v-dialog
					v-model="dialogMusicDelete"
					max-width="500px"
					:retain-focus="false"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							icon
							v-bind="attrs"
							v-on="on"
							@click="deleteItem(item._id)"
						>
							<v-icon> mdi-delete </v-icon>
						</v-btn>
					</template>
					<v-card>
						<v-card-title class="headline"
							>Ты уверен, что хочешь удалить её?</v-card-title
						>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="closeDelete()"
								>Я пошутил!</v-btn
							>
							<v-btn
								color="blue darken-1"
								text
								@click="deleteItemConfirm()"
								><span class="red--text">Удалить</span></v-btn
							>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>
		</v-data-table>
			

        <v-snackbar
			v-model="snackbarAddSuccess"
			color="primary"
			timeout="2000"
			elevation="4"
			multi-line
			outlined
			top
			light
			transition="slide-y-transition"
		>
			<span>Песня добавлена!</span>
		</v-snackbar>
        <v-snackbar
			v-model="snackbarEditSuccess"
			color="primary"
			timeout="2000"
			elevation="4"
			multi-line
			outlined
			top
			light
			transition="slide-y-transition"
		>
			<span>Песня изменена!</span>
		</v-snackbar>
        <v-snackbar
			v-model="snackbarDeleteSuccess"
			color="primary"
			timeout="2000"
			elevation="4"
			multi-line
			outlined
			top
			light
			transition="slide-y-transition"
		>
			<span>Песня удалена!</span>
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
			<span>Что-то пошло не так..</span>
		</v-snackbar>
    </div>
</template>






<script>
import {mapActions} from 'vuex'

export default {
	middleware: ['auth'],
    async asyncData({store}) {
		const musicData = await store.dispatch('manager/GET_MUSIC')
		return {musicData}
    },
    data() {
        return {
            title: '',
            author: '',
            stars: 1,
            music: null,
            valid: false,
            loadingAdd: false,
			snackbarAddSuccess: false,
			snackbarEditSuccess: false,
			snackbarDeleteSuccess: false,
			snackbarError: false,
			
			rules: {
				title: v => !!v || 'Название обязательно',
				author: v => !!v || 'Ты забыл про автора',
				music: v => !!v
			},
			musicData: [],
			dialogMusicEdit: false,
			dialogMusicDelete: false,
			sortDesc: true,
			noDataText: 'Музыки нет',
			footerProps: {
				'items-per-page-text': 'Строк на страницу',
				'items-per-page-all-text': 'Все',
			},
			headers: [
				{
					text: 'Название',
					align: 'start',
					value: 'title',
				},
				{
					text: 'Автор',
					value: 'author',
				},
				{
					text: 'Добавлена',
					value: 'created',
				},
				{
					text: 'Рейтинг',
					value: 'stars'
				},
				{ text: 'Действия', value: 'actions', sortable: false },
			],
			editItemIndex: 0,
			editItemId: '',
			editItemName: '',
			editItemAuthor: '',
			editItemMusic: null,
			editItemStars: 1,

			contentLoaded: false,
			contentLoading: true,
		};
	},
	methods: {
		...mapActions({
			getMusic: 'manager/GET_MUSIC',
			addMusic: 'manager/ADD_MUSIC',
			updateMusic: 'manager/UPDATE_MUSIC',
			removeMusic: 'manager/REMOVE_MUSIC',
		}),

		async onSubmit() {
			if(this.valid) {
				this.loadingAdd = true;
				try {
					const formData = {
						title: this.title,
						author: this.author,
						music: this.music,
						stars: this.stars,
					};
					
					await this.addMusic(formData)

					this.$refs.form.reset()
					this.loadingAdd = false
					this.musicData = await this.getMusic()
					this.snackbarAddSuccess = true
				} catch(err) {
					this.snackbarError = true
					this.loadingAdd = false
					console.log(err)
				}
			}
		},

		editItem(id) {
			this.editItemId = id;
			this.editItemIndex = this.musicData.findIndex((song) => song._id === id);
			this.editItemName = this.musicData[this.editItemIndex].title;
			this.editItemAuthor = this.musicData[this.editItemIndex].author;
			this.editItemMusic = this.musicData[this.editItemIndex].music;
			this.editItemStars = this.musicData[this.editItemIndex].stars;
			this.dialogMusicEdit = true;
		},
		dialogEditClose() {
			this.dialogMusicEdit = false;
		},
		async dialogEditSave() {
			this.musicData[this.editItemIndex].title = this.editItemName
			this.musicData[this.editItemIndex].author = this.editItemAuthor
			this.musicData[this.editItemIndex].stars = this.editItemStars
			this.loadingAdd = true;
			try {
				const formData = {
					title: this.editItemName,
					author: this.editItemAuthor,
					stars: this.editItemStars,
					id: this.editItemId,
				};
				await this.updateMusic(formData);
				this.loadingAdd = false;
				this.snackbarEditSuccess = true
			} catch (err) {
				this.snackbarError = true
				this.loadingAdd = false;
				console.log(err)
			}
			this.dialogMusicEdit = false;
		},
		deleteItem(id) {
			this.editItemId = id;
			this.editItemIndex = this.musicData.findIndex((song) => song._id === id);
			this.dialogMusicDelete = true;
		},
		async deleteItemConfirm() {
			try {
				await this.removeMusic(this.editItemId);
				this.musicData = this.musicData.filter(
					(music) => music._id !== this.editItemId
				);
				this.dialogMusicDelete = false;
				this.snackbarDeleteSuccess = true
			} catch (err) {
				this.snackbarError = true
				this.loadingAdd = false;
				console.log(err)
			}
		},
		closeDelete() {
			this.dialogMusicDelete = false;
		},
		formatDate(date) {
			return new Date(Number(date)).toLocaleDateString()
		}
	},
	head: {
		title: `Менеджер | ${process.env.appName}`,
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
