<template>
  <div id="app" ref="appHeading">
    <div class="columns is-centered">
      <a href="/">
        <h1 class="title is-1">Ficx test app</h1>
      </a>
    </div>
    <template v-if="isUserSignedIn">
      <search-input
        v-model="searchText"
        @click="handleSearch"
        @clear="handleClear"
        :isLoading="isLoading"
      />
      <search-result
        v-if="showResults"
        :images="images"
        :search-text="searchText"
      />
      <button
        class="delete is-small"
        @click="isUserSignedIn = false"
        title="Logout"
      ></button>
    </template>
    <sign-in v-else @success="success => isUserSignedIn = success" />
  </div>
</template>

<script>
  import SearchInput from './components/SearchInput';
  import SearchResult from './components/SearchResult';
  import SignIn from './components/SignIn';
  import getData from './transport';
  export default {
    name: 'App',
    components: {
      SearchInput,
      SearchResult,
      SignIn
    },
    data: () => ({
      searchText: '',
      images: [],
      showResults: false,
      page: 0,
      isLoading: false,
      isUserSignedIn: window.localStorage.getItem ( 'ficxIsLogged' )
    }),
    mounted() {
      this.$nextTick ( () => {
        window.addEventListener ( 'scroll', this.onScroll );
        this.onScroll();
      });
    },
    watch: {
      isUserSignedIn ( newVal, oldVal ) {
        if ( newVal !== oldVal ) {
          if ( newVal ) {
            window.localStorage.setItem ( 'ficxIsLogged', newVal );
          }
          else {
            window.localStorage.removeItem ( 'ficxIsLogged' );
          }
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener ( 'scroll', this.onScroll );
    },
    methods: {
      async handleSearch() {
        const { searchText } = this;
        if ( searchText.length ) {
          this.isLoading = true;
          this.showResults = false;
          this.images = await getData ( searchText );
          this.isLoading = false;
          this.showResults = true;
        }
      },
      handleClear() {
        this.showResults = false;
        this.images = [];
        this.searchText = '';
      },
      async onScroll() {
        const { appHeading } = this.$refs;
        if ( appHeading ) {
            const bottomApp = appHeading.getBoundingClientRect().bottom;
            const { innerHeight } = window;
            if (( bottomApp - innerHeight ) < 150 && !this.isLoading ) {
              this.isLoading = true;
              const nextPageData = await getData ( this.searchText, ++this.page );
              this.images.push ( ...nextPageData );
              this.isLoading = false;
            }                               
        }
      }
    }
  }
</script>

<style>
  #app {
    margin-top: 60px;
    padding-bottom: 50px;
  }
  button.delete {
    position: absolute;
    right: 1.25rem;
    top: 1.25rem;
  }
</style>