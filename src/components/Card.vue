<template>
    <div class="card">
        <div class="card-image">
            <a :href="link" target="_blank">
                <figure class="image is-4by3">
                    <img :src="src" loading="lazy" />
                </figure>
            </a>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-6">{{ title }}</p>
                </div>
            </div>
            <div class="content">
                <time :datetime="datetime" class="is-size-7">{{datetime}}</time>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Card',
        props: [ 'image' ],
        data: () => ({
            src: '',
            datetime: '',
            title: '',
            link: '#'
        }),
        mounted() {
            const { images, title, trending_datetime, url } = this.image;
            this.src = images.downsized.url;
            this.datetime = trending_datetime;
            this.title = title;
            this.link = url;
        }
    }
</script>

<style scoped>
    figure.image {
        background: url(../assets/loading.gif) center center no-repeat;
        background-size: cover;
    }
</style>
