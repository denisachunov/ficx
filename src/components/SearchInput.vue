<template>
    <div class="columns is-centered py-6">
      <div class="column is-half has-addons field">
        <div class="control is-expanded has-icons-right">
          <input 
            :value="value"
            @input="$emit ( 'input', $event.target.value )"
            @keyup.enter="$emit ( 'click' )"
            class="input is-large"
            placeholder="Type any text to search gif"
            ref="search"
            :disabled="isLoading"
          />
          <a @click="handleClear" class="icon is-small is-right" v-if="value.length">
            <i class="fas fa-times"></i>
          </a>
        </div>
        <div class="control">
          <a class="button is-info is-large" @click="$emit ( 'click' )" :class="{ 'is-loading': isLoading }">
            <i class="fas fa-search"></i>
          </a>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'SearchInput',
    props: {
      value: String,
      isLoading: Boolean
    },
    methods: {
      handleClear() {
        this.$emit ( 'clear' );
        this.$refs.search.focus();
      }
    }
  }
</script>

<style scoped>
  a.icon.is-small.is-right {
    pointer-events: all;
  }
</style>
