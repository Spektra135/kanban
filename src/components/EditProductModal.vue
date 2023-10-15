<template>
  <div class="modal" v-if="isModalEditOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>

      <h2>Редактирование продукта</h2>

      <form class="form" @submit.prevent="saveChanges">
        <label class="form__label" for="editedCategory">Категория:</label>
        <input class="form__input" type="text" v-model="editedProduct.category" id="editedCategory" required>

        <label class="form__label" for="createdImg">Изображение (измените ссылку на изображение продукта): </label>
        <input class="form__input" type="text" v-model="editedProduct.image" id="createdImg" required>

        <label class="form__label" for="editedTitle">Название:</label>
        <input class="form__input" type="text" v-model="editedProduct.title" id="editedTitle" required>

        <label class="form__label" for="editedPrice">Цена: </label>
        <input class="form__input" type="text" v-model="editedProduct.price" id="editedPrice" required>

        <label class="form__label" for="editedDescription">Описание:</label>
        <textarea class="form__textarea" v-model="editedProduct.description" id="editedDescription" required></textarea>

        <button class="btn form__btn" type="submit">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EditProductModal',
    props: {
      isModalEditOpen: Boolean,
      editedProduct: Object,
    },
    methods: {
      closeModal() {
        this.$emit('closeModal');
      },
      saveChanges() {
        // Отправляем событие с обновленными данными продукта
        this.$emit('saveChanges', this.editedProduct);
        this.closeModal();
      },
    },
  };
</script>