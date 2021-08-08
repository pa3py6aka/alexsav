<template>
    <main role="main" class="inner cover">
        <h1 class="cover-heading">Hello!</h1>
        <p class="lead">This is my sandbox/work server. I'm testing here many new technologies.</p>
    </main>
</template>

<script>
    export default {
        name: "HomePage",
        metaInfo: {
            title: 'Alexsav.ru - My Beautiful Home Page'
        },
        activated() {
            console.log('activated');
            this.$store.state.navbar_mb_auto = true;
        },
        deactivated() {
            this.$store.state.navbar_mb_auto = false;
        }
    }
</script>
