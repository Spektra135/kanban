import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {API_BASE_URL} from "@/config";

Vue.use(Vuex);

export  default new Vuex.Store({
    state: {
        isModalCreateOpen: false,
        isModalEditOpen: false,
        editedProduct: {},
        createdProduct: {},
        isCardsLoading: false,
        isCardsLoadingFailing: false,
        isCardCreating: false,
        isCardCreatingFailing: false,
        isCardEditing: false,
        isCardEditingFailing: false,
        isCardDeleting: false,
        isCardDeletingFailing: false,
        list1: [],
        list2: [],
        list3: [],
    },
    mutations: {
        SET_CARDS_LOADING(state, isLoading) {
            state.isCardsLoading = isLoading;
        },
        SET_CARDS_LOADING_FAILING(state, isFailing) {
            state.isCardsLoadingFailing = isFailing;
        },
        SET_CARD_CREATING(state, isCreating) {
            state.isCardCreating = isCreating;
        },
        SET_CARD_CREATING_FAILING(state, isFailing) {
            state.isCardCreatingFailing = isFailing;
        },
        SET_CARD_EDITING(state, isEditing) {
            state.isCardEditing = isEditing;
        },
        SET_CARD_EDITING_FAILING(state, isFailing) {
            state.isCardEditingFailing = isFailing;
        },
        SET_CARD_DELETING(state, isDeleting) {
            state.isCardDeleting = isDeleting;
        },
        SET_CARD_DELETING_FAILING(state, isFailing) {
            state.isCardDeletingFailing = isFailing;
        },
        SET_LIST1(state, list) {
            state.list1 = list;
        },
        UPDATE_LIST1(state, { index, product }) {
            // Обновляем продукт в list1 (первая колонка) по индексу
            state.list1.splice(index, 1, product);
        },
        UPDATE_LIST2(state, { index, product }) {
            // Обновляем продукт в list2 (вторая колонка) по индексу
            state.list2.splice(index, 1, product);
        },
        UPDATE_LIST3(state, { index, product }) {
            // Обновляем продукт в list3 (третья колонка) по индексу
            state.list3.splice(index, 1, product);
        },
        SET_MODAL_CREATE_OPEN(state, isOpen) {
            state.isModalCreateOpen = isOpen;
        },
        SET_MODAL_EDIT_OPEN(state, isOpen) {
            state.isModalEditOpen = isOpen;
        },
        RESET_MODAL_DATA(state) {
            state.editedProduct = {};
            state.createdProduct = {};
        },
        SET_EDITED_PRODUCT(state, product) {
            // Обновление состояния для установки редактируемого продукта
            state.editedProduct = { ...product };
        },
        DELETE_PRODUCT(state, id) {
            state.list1 = state.list1.filter(item => item.id !== id);
            state.list2 = state.list2.filter(item => item.id !== id);
            state.list3 = state.list3.filter(item => item.id !== id);
        },
        MOVE_CARD(state, { product, sourceList, targetList }) {
            const index = sourceList.indexOf(product);

            if (index !== -1 && !state.isModalEditOpen) {
                // Перемещаем карточку только если она не редактируется
                sourceList.splice(index, 1); // Убираем карточку из исходной колонки
                targetList.unshift(product); // Добавляем карточку в целевую колонку
            }
        },
        SORT_LIST_BY_RATING(state, { list, sortDirection }) {
            if (sortDirection === "asc") {
                list.sort((a, b) => a.rating.rate - b.rating.rate);
            } else if (sortDirection === "desc") {
                list.sort((a, b) => b.rating.rate - a.rating.rate);
            }
        }
    },
    getters: {
        getList1: (state) => state.list1,
        getList2: (state) => state.list2,
        getList3: (state) => state.list3,
        getIsCardsLoading: (state) => state.isCardsLoading,
        getIsCardsLoadingFailing: (state) => state.isCardsLoadingFailing,
        getIsCardCreating: (state) => state.isCardCreating,
        getIsCardCreatingFailing: (state) => state.isCardCreatingFailing,
        getIsCardEditing: (state) => state.isCardEditing,
        getIsCardEditingFailing: (state) => state.isCardEditingFailing,
        getIsCardDeleting: (state) => state.isCardDeleting,
        getIsCardDeletingFailing: (state) => state.isCardDeletingFailing,
        getIsModalCreateOpen: (state) => state.isModalCreateOpen,
        getIsModalEditOpen: (state) => state.isModalEditOpen,
        getEditedProduct: (state) => state.editedProduct,
        getCreatedProduct: (state) => state.createdProduct,
    },
    actions: {
        loadProducts(context) {
            context.commit('SET_CARDS_LOADING', true);
            axios
                .get(API_BASE_URL)
                .then((response) => {
                    context.commit('SET_LIST1', response.data);
                    context.commit('SET_CARDS_LOADING', false);
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке продуктов:', error);
                    context.commit('SET_CARDS_LOADING_FAILING', true);
                    context.commit('SET_CARDS_LOADING', false);
                });
        },

        createProduct({ commit }) {
            // Открываем модальное окно для создания продукта
            commit('SET_MODAL_CREATE_OPEN', true);
        },

        saveCreateProduct(context) {
            context.commit('SET_CARD_CREATING', true);
            axios.post(API_BASE_URL, {
                title: context.state.createdProduct.title,
                price: context.state.createdProduct.price,
                description: context.state.createdProduct.description,
                image: context.state.createdProduct.image,
                category: context.state.createdProduct.category,
            })
                .then((response) => {
                    let newProduct = {
                        ...response.data,
                        rating: {
                            rate: 0,
                            count: 0,
                        },
                    };
                    context.commit('SET_LIST1', [newProduct, ...context.state.list1]); // Обновляем список продуктов
                    context.commit('SET_CARD_CREATING', false); // Сбрасываем флаг создания продукта
                })
                .catch((error) => {
                    console.error('Ошибка создания продукта:', error);
                    context.commit('SET_CARD_CREATING', false)
                    context.commit('SET_CARD_CREATING_FAILING', true)
                    setTimeout(() => {
                        context.commit('SET_CARD_CREATING_FAILING', false)
                    }, 3000);
                });
        },

        closeModal( {commit} ) {
            // Закрываем модальное окно
            setTimeout(() => {
                commit('SET_MODAL_CREATE_OPEN', false);
                commit('SET_MODAL_EDIT_OPEN', false);
            }, 0);
            // Сбрасываем данные при закрытии модального окна
            commit('RESET_MODAL_DATA');
        },

        sortListByRating({commit} ,{ list, sortDirection }) {
            commit('SORT_LIST_BY_RATING',{ list, sortDirection });
        },

        editProduct({ commit }, product) {
            // Вызов мутации для открытия модального окна и отображения в соответствующих полях данных о редактируемом продукте
            commit('SET_MODAL_EDIT_OPEN', true);
            commit('SET_EDITED_PRODUCT', { ...product });
        },

        saveChanges({ commit, state }, editedProduct) {
            commit('SET_CARD_EDITING', true);

            axios.patch(API_BASE_URL + `/${editedProduct.id}`, editedProduct)
                .then(() => {
                    // Находим индекс редактированного продукта в списках
                    const indexList1 = state.list1.findIndex(item => item.id === editedProduct.id);
                    const indexList2 = state.list2.findIndex(item => item.id === editedProduct.id);
                    const indexList3 = state.list3.findIndex(item => item.id === editedProduct.id);

                    // Вызываем мутацию для обновления списка, в котором находится редактированный продукт
                    if (indexList1 !== -1) {
                        commit('UPDATE_LIST1', { index: indexList1, product: editedProduct });
                    } else if (indexList2 !== -1) {
                        commit('UPDATE_LIST2', { index: indexList2, product: editedProduct });
                    } else if (indexList3 !== -1) {
                        commit('UPDATE_LIST3', { index: indexList3, product: editedProduct });
                    }
                    commit('SET_CARD_EDITING', false);
                })
                .catch(error => {
                    console.error('Ошибка при редактировании продукта:', error);
                    commit('SET_CARD_EDITING', false);
                    commit('SET_CARD_EDITING_FAILING', true);
                    setTimeout(() => {
                        commit('SET_CARD_EDITING_FAILING', false);
                    }, 3000);
                });
        },

        deleteProduct({ commit, state }, id) {
            commit('SET_CARD_DELETING', true);
            axios.patch(API_BASE_URL + `/${id}`)
                .then((json) => {
                    if (id < 21) {
                        commit('DELETE_PRODUCT', json.data.id);
                    } else {
                        commit('DELETE_PRODUCT', id);
                    }
                    commit('SET_CARD_DELETING', false);
                })
                .catch(error => {
                    // Обрабатываем ошибку и устанавливаем флаги в состояние
                    console.error('Ошибка при редактировании продукта:', error);
                    commit('SET_CARD_DELETING', false);
                    commit('SET_CARD_DELETING_FAILING', true);
                    setTimeout(() => {
                        commit('SET_CARD_DELETING_FAILING', false);
                    }, 3000);
                });

        },

        moveCard({ commit }, { product, sourceList, targetList }) {
            commit('MOVE_CARD', { product, sourceList, targetList });
        },
    },
});
