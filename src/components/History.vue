<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">History</p>
                <button class="delete" aria-label="close" @click="$emit ( 'close' )"></button>
            </header>
            <section class="modal-card-body">
                <table class="table is-small is-fullwidth">
                    <tr v-for="entry in history.slice().reverse()" :key="entry">
                        <td><a @click="$emit ( 'goto', entry )">{{ entry }}</a></td>
                    </tr>
                </table>
            </section>
            <footer class="modal-card-foot">
                <button class="button" @click="$emit ( 'close' )">Close</button>
                <button class="button is-text" @click="$emit ( 'clear' )">Clear</button>
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'History',
        props: [ 'history' ]
    }
</script>

<style scoped>
    .table tr:last-child td {
        border: 0;
    }
</style>
