<template>
    <footer class="mastfoot mt-auto">
        <div class="inner">
            <p>&copy;copyright {{ year }}, some rights might be reserved.</p>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "MainFooter",
        data() {
            return {
                year: new Date().getFullYear()
            }
        },
    }
</script>
