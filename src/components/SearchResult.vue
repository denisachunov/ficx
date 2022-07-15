<template>
  <div class="container">
    <div class="columns is-multiline is-mobile is-centered">
      <div
        v-for="img in images"
        class="column is-one-quarter"
        :key="img.id"
      >
        <Card
          v-if="img.type === 'gif'"
          :image="img"
        />
      </div>
      <div v-if="!images.length" class="is-size-3">
        We couldn't find a match for <strong>{{ search }}</strong>.<br />
        Please check your search for any typos or spelling errors - or try a different search term.
      </div>
    </div>
  </div>
</template>

<script>
  import Card from './Card';
  export default {
    name: 'SearchResult',
    props: {
      images: {
        type: Array,
        default: () => []
      },
      searchText: String
    },
    data() {
      return {
        search: this.searchText
      }
    },
    components: {
      Card
    }
  }
</script>
