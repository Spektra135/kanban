<template>
  <div class="modal" v-if="isModalCreateOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Создание нового продукта</h2>
      <form class="form" @submit.prevent="saveCreateProduct">
        <label class="form__label" for="createdCategory">Категория:</label>
        <input class="form__input" type="text" v-model="createdProduct.category" id="createdCategory" required>

        <label class="form__label" for="createdTitle">Название:</label>
        <input class="form__input" type="text" v-model="createdProduct.title" id="createdTitle" required>

        <label class="form__label" for="createdImg">Изображение (введите ссылку на изображение продукта): </label>
        <input class="form__input" type="text" v-model="createdProduct.image" id="createdImg" required>

        <label class="form__label" for="createdPrice">Цена:</label>
        <input class="form__input" type="text" v-model:change="createdProduct.price" id="createdPrice" required>

        <label class="form__label" for="editedDescription">Описание:</label>
        <textarea class="form__textarea" v-model="createdProduct.description" id="editedDescription" required></textarea>

        <button class="btn form__btn" type="submit">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CreateProductModal',
    props: {
      isModalCreateOpen: Boolean,
      createdProduct: Object,
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      saveCreateProduct() {
        // Отправляем событие с обновленными данными продукта
        this.$emit('saveCreateProduct', this.createdProduct);
        this.closeModal();
      },
    },
  };
</script>
