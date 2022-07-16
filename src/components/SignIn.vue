<template>
    <div class="columns is-centered py-6">
      <div class="column is-4 field">
        <article class="message is-success" v-if="isSuccess">
          <div class="message-body">
            Thanks for signing up. Now you can login.
          </div>
        </article>
        <h4 class="subtitle is-4">
          Sign {{ isSignUp ? 'up' : 'in' }}
        </h4>
        <div class="control">
          <input
            v-model="username"
            @input="clearError ([ 'username', 'userExists' ])"
            @keyup.enter="submit"
            class="input is-large"
            :class="{ 'is-danger': isError ( 'username' ) || isError ( 'userExists' )}"
            placeholder="Username"
          />
          <p class="help is-danger" v-if="isError ( 'username' )">
            User name shouldn't be empty
          </p>
          <p class="help is-danger" v-if="isError ( 'userExists' )">
            A user with this name already exists
          </p>
        </div>
        <div class="control">
          <input
            v-model="password"
            @input="clearError([ 'password', 'passwordsNotMatch' ])"
            @keyup.enter="submit"
            class="input is-large mt-3"
            :class="{ 'is-danger': isError ( 'password' ) || isError ( 'passwordsNotMatch' )}"
            type="password"
            placeholder="Password"
          />
          <p class="help is-danger" v-if="isError ( 'password' )">
            Password shouldn't be empty
          </p>
        </div>
        <div class="control" v-if="isSignUp">
          <input
            v-model="passwordRepeat"
            @input="clearError()"
            @keyup.enter="submit"
            class="input is-large mt-3"
            :class="{ 'is-danger': isError ( 'passwordsNotMatch' )}"
            type="password"
            placeholder="Confirm password"
          />
          <p class="help is-danger" v-if="isError ( 'passwordsNotMatch' )">
            Those passwords didn’t match
          </p>
        </div>
        <div class="buttons mt-3"
             :class="{ 'is-flex-direction-row-reverse': isSignUp }">
            <button
              @click="onButtonClik ( 'login' )"
              class="button"
              :class="[ !isSignUp ? 'is-primary is-light' : 'is-text' ]"
              :disabled="!isSignUp && !!errors.length"
            >
              Log in
            </button>
            <button
              @click="onButtonClik"
              class="button"
              :class="[ isSignUp ? 'is-primary is-light' : 'is-text' ]"
              :disabled="isSignUp && !!errors.length"
            >
              Create an account
            </button>
        </div>
        <p class="help is-danger" v-if="isError ( 'badSignIn' )">
            Couldn't sign in, please check your details
        </p>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'SignIn',
    data() {
        return {
            username: '',
            password: '',
            passwordRepeat: '',
            isSignUp: false,
            users: [],
            errors: [],
            isSuccess: false
        }
    },
    computed: {
      user() {
        return ({
          name: this.username,
          password: window.btoa ( this.password )
        });
      }
    },
    mounted() {
      try {
        this.users = JSON.parse ( window.localStorage.getItem ( 'ficxUsers' )) || [];
      }
      catch ( e ) {
        console.log ( e );
      }
    },
    methods: {
      onButtonClik ( button='login' ) {
        if ( button === 'login' && this.isSignUp ) {
          this.isSignUp = false;
          this.errors = [];
        }
        else if ( button === 'login' ) {
          this.login();
        }
        else if ( this.isSignUp ) {
          this.signup();
        }
        else {
          this.isSignUp = true;
          this.clearError();
        }
      },
      submit() {
        if ( this.isSignUp ) {
          this.signup();
        }
        else {
          this.login();
        }
      },
      login() {
        this.validate();
        if ( !this.errors.length && this.getUser() ) {
          if ( this.getUser() ) {
            this.$emit ( 'success', true );
            window.localStorage.setItem ( 'ficxIsLogged', this.user );
          }
        }
      },
      signup() {
        this.validate();
        if ( !this.errors.length ) {
          this.users.push ({ ...this.user });
          this.storeUsers();
          this.isSignUp = false;
          this.isSuccess = true;
          this.username = '';
          this.password = '';
          this.passwordRepeat = '';
        }
      },
      getUser() {
        return this.users.find (({ name }) => name === this.username.trim() );
      },
      storeUsers() {
        window.localStorage.setItem ( 'ficxUsers', JSON.stringify ( this.users ));
      },
      validate() {
        this.clearError();
        if ( !this.username.trim() ) {
          this.errors.push ( 'username' );
        }
        if ( !this.password.trim() ) {
          this.errors.push ( 'password' );
        }
        if ( this.errors.length ) {
          return;
        }
        if ( this.isSignUp ) {
          if ( this.getUser() ) {
            this.errors.push ( 'userExists' );
          }
          else if ( this.password !== this.passwordRepeat ) {
            this.errors.push ( 'passwordsNotMatch' );
          }
        }
        else {
          const password = window.atob ( this.getUser()?.password || '' );
          if ( this.password.trim() !== password ) {
            this.errors.push ( 'badSignIn' );
          }
        }
      },
      clearError ( fieldName ) {
        if ( fieldName ) {
          this.errors = this.errors.filter (
            err => Array.isArray ( fieldName ) ? !fieldName.includes ( err ) : err !== fieldName
          );
        }
        else {
          this.errors = [];
        }
      },
      isError ( fieldName ) {
        return !!this.errors.find ( err => err === fieldName );
      }
    }
  }
</script>

<style scoped>
  .buttons {
    justify-content: space-between;
  }
</style>
