<template>
  <div id="app" ref="appHeading">
    <div class="has-text-centered">
      <div class="columns is-centered">
        <a href="/">
          <h1 class="title is-1">Ficx test app</h1>
        </a>
      </div>
      <button
        v-if="isUserSignedIn && history.length"
        @click="isHistoryVisible = true"
        class="button is-small is-text"
      >
        History
      </button>
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
      />
      <history v-if="isHistoryVisible"
               :history="history"
               @close="isHistoryVisible = false"
               @goto="goToHistoryEntry"
               @clear="clearHistory" />
    </template>
    <sign-in v-else @success="success => isUserSignedIn = success" />
  </div>
</template>

<script>
  import SearchInput from './components/SearchInput';
  import SearchResult from './components/SearchResult';
  import SignIn from './components/SignIn';
  import History from './components/History';
  import getData from './transport';
  import { HISTORY_SIZE } from './const';
  import { isEqual } from 'lodash';
  export default {
    name: 'App',
    components: {
      SearchInput,
      SearchResult,
      SignIn,
      History
    },
    data() {
      return {
        searchText: '',
        images: [],
        showResults: false,
        page: 1,
        isLoading: false,
        isUserSignedIn: window.localStorage.getItem ( 'ficxIsLogged' ),
        history: [],
        isHistoryVisible: false
      }
    },
    mounted() {
      try {
        this.history = JSON.parse ( window.localStorage.getItem ( 'ficxHistory' )) || [];
      }
      catch ( e ) {
        console.log ( e );
      }
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
            this.clearHistory();
          }
        }
      },
      history ( newVal, oldVal ) {
        if ( !isEqual ( newVal, oldVal )) {
          window.localStorage.setItem ( 'ficxHistory', JSON.stringify ( newVal ));
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener ( 'scroll', this.onScroll );
      this.clearHistory();
      this.isUserSignedIn = false;
    },
    methods: {
      async handleSearch() {
        const { searchText } = this;
        if ( searchText.trim().length ) {
          this.isLoading = true;
          this.showResults = false;
          this.images = await getData ( searchText );
          this.addToHistory();
          this.isLoading = false;
          this.showResults = true;
        }
      },
      addToHistory() {
        this.history = this.history.filter ( entry => entry !== this.searchText );
        if ( this.history.length >= HISTORY_SIZE ) {
          this.history.shift();
        }
        this.history.push ( this.searchText );
      },
      clearHistory() {
        this.history = [];
        this.isHistoryVisible = false;
      },
      goToHistoryEntry ( str ) {
        this.searchText = str;
        this.isHistoryVisible = false;
        this.handleSearch();
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
            if ( this.searchText.trim() && ( bottomApp - innerHeight ) < 150 && !this.isLoading ) {
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
