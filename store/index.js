export const state = () => ({
	login: '',
	password: '',
});

export const mutations = {
	SET_USER(state, { login, password }) {
		state.login = { login };
		state.password = { password };
	},
};

export const actions = {
	LOGIN({ commit }, { login, password }) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (login === 'TestUser' && password === 'TestUser') {
					resolve('Успешный логин');
					commit('SET_USER', { login, password });
				} else {
					reject(
						new Error(
							'Неверный логин или пароль. Нужно использовать только TestUser и TestUser'
						)
					);
				}
			}, 500);
		});
	},
};
