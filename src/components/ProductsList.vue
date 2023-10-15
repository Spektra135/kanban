<template>
  <div class="container">
    <button class="btn btn-create" @click="createProduct">Создать новый продукт</button>

    <CreateProductModal
        :isModalCreateOpen="getIsModalCreateOpen"
        :createdProduct="getCreatedProduct"
        @closeModal="closeModal"
        @saveCreateProduct="saveCreateProduct"
    />

    <div v-if="getIsCardsLoading">
      <img src="../assets/img/svg/spinner.gif">
      <p>Загружаем продукты ...</p>
    </div>

    <div v-else-if="getIsCardsLoadingFailing">
      <p>Не удалось загрузить продукты</p>
    </div>

    <div v-else-if="getIsCardCreating">
      <img src="../assets/img/svg/spinner.gif">
      <p>Сохранение нового продукта...</p>
    </div>

    <div v-else-if="getIsCardCreatingFailing">
      <p>Не удалось создать новый продукт</p>
    </div>

    <div v-else-if="getIsCardEditing">
      <img src="../assets/img/svg/spinner.gif">
      <p>Редактирование продукта...</p>
    </div>

    <div v-else-if="getIsCardEditingFailing">
      <p>Не удалось отредактировать продукт</p>
    </div>

    <div v-else-if="getIsCardDeleting">
      <img src="../assets/img/svg/spinner.gif">
      <p>Удаление продукта...</p>
    </div>

    <div v-else-if="getIsCardDeletingFailing">
      <p>Не удалось удалить продукт</p>
    </div>

    <div v-else class="product-list">
      <div class="product-list__column">
        <h4 class="title product-list__column-1">Начальная стадия</h4>

        <label for="sortList1">Сортировка по рейтингу: </label>
        <select class="product-list__select-sort" @change="sortListByRating({list: getList1, sortDirection: $event.target.value})" id="sortList1">
          <option value="" hidden>Выбрать</option>
          <option value="asc">по возрастанию</option>
          <option value="desc">по убыванию</option>
        </select>

        <draggable ref="list1Draggable" class="list-group" :list="getList1" group="products">
          <div
              class="product-card__wrapper product-list__column-1"
              v-for="product in getList1"
              :key="product.id"
              @click="moveCard({product, sourceList: getList1, targetList: getList2 })"
          >
            <ProductItem
                :product="product"
                :cardDeleting="getIsCardDeleting"
                :cardDeletingFailing="getIsCardEditingFailing"
                @deleteProduct="deleteProduct(product.id)"
                @editProduct="editProduct(product)"
            />

            <EditProductModal
                :isModalEditOpen="getIsModalEditOpen"
                :editedProduct="getEditedProduct"
                @closeModal="closeModal"
                @saveChanges="saveChanges"
            />
          </div>
        </draggable>
      </div>

      <p class="arrow">⇄</p>

      <div class="product-list__column">
        <h4 class="title product-list__column-2">Средняя стадия</h4>

        <label for="sortList2">Сортировка по рейтингу: </label>
        <select class="product-list__select-sort" @change="sortListByRating({list: getList2, sortDirection: $event.target.value})" id="sortList2">
          <option value="" hidden>Выбрать</option>
          <option value="asc">по возрастанию</option>
          <option value="desc">по убыванию</option>
        </select>

        <draggable ref="list2Draggable" class="list-group" :list="getList2" group="products">
          <div
              class="product-card__wrapper product-list__column-2"
              v-for="product in getList2"
              :key="product.id"
              @click="moveCard({product, sourceList: getList2, targetList: getList3 })"
          >

            <ProductItem
                :product="product"
                :cardDeleting="getIsCardDeleting"
                :cardDeletingFailing="getIsCardEditingFailing"
                @deleteProduct="deleteProduct(product.id)"
                @editProduct="editProduct(product)"
            />

            <EditProductModal
                :isModalEditOpen="getIsModalEditOpen"
                :editedProduct="getEditedProduct"
                @closeModal="closeModal"
                @saveChanges="saveChanges"
            />
          </div>
        </draggable>
      </div>

      <p class="arrow">⇄</p>

      <div class="product-list__column">
        <h4 class="title product-list__column-3">Финальная стадия</h4>

        <label for="sortList3">Сортировка по рейтингу: </label>
        <select class="product-list__select-sort" @change="sortListByRating({list: getList3, sortDirection: $event.target.value})" id="sortList3">
          <option value="" hidden>Выбрать</option>
          <option value="asc">по возрастанию</option>
          <option value="desc">по убыванию</option>
        </select>

        <draggable ref="list3Draggable" class="list-group" :list="getList3" group="products">
          <div
              class="product-card__wrapper product-list__column-3"
              v-for="product in getList3"
              :key="product.id"
          >
            <ProductItem
                :product="product"
                :cardDeleting="getIsCardDeleting"
                :cardDeletingFailing="getIsCardEditingFailing"
                @deleteProduct="deleteProduct(product.id)"
                @editProduct="editProduct(product)"
            />

            <EditProductModal
                :isModalEditOpen="getIsModalEditOpen"
                :editedProduct="getEditedProduct"
                @closeModal="closeModal"
                @saveChanges="saveChanges"
            />
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import ProductItem from './ProductItem.vue';
import EditProductModal from './EditProductModal.vue';
import CreateProductModal from './CreateProductModal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "ProductsList",
  components: { draggable, ProductItem, EditProductModal, CreateProductModal },
  mounted() {
    this.loadProducts();
  },
  computed: {
    ...mapGetters([
      'getList1',
      'getList2',
      'getList3',

      'getIsCardsLoading',
      'getIsCardsLoadingFailing',

      'getIsModalCreateOpen',
      'getIsModalEditOpen',

      'getIsCardCreating',
      'getIsCardCreatingFailing',

      'getIsCardEditing',
      'getIsCardEditingFailing',

      'getIsCardDeleting',
      'getIsCardDeletingFailing',

      'getEditedProduct',
      'getCreatedProduct',
    ]),
  },
  methods: {
    ...mapActions([
        'loadProducts',
      'createProduct',
      'saveCreateProduct',
      'closeModal',
      'sortListByRating',
      'editProduct',
      'saveChanges',
      'deleteProduct',
      'moveCard'
    ]),
  },

};
</script>
