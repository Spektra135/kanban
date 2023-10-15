<template>
  <div class="product-card">
    <p class="product-card__category">Категория: {{ product.category}}</p>

    <p class="product-card__rating">
      <span class="product-card__rate">
        Рейтинг: {{ product.rating.rate }}&#9733;
      </span>

      <span class="product-card__users">
        на основании {{ product.rating.count }} оценок
      </span>
    </p>

    <h2 class="product-card__title">{{ product.title }}</h2>

    <img :src="product.image" alt="Product Image" class="product-image" />

    <p class="product-card__price">Цена: $ {{ product.price }}</p>

    <p class="product-card__description">{{ product.description }}</p>

    <div class="actions">
      <button class="btn product-card__btn-edit" @click="editProduct(product)">Редактировать</button>

      <button class="btn product-card__btn-del" @click="deleteProduct(product.id)">Удалить</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProductItem',
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
    methods: {
      deleteProduct() {
        this.$emit('deleteProduct', this.product.id);
      },
      editProduct(product) {
        return this.$emit('editProduct', product);
      },
    },
  };
</script>

