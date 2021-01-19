let CommonMixin = {
    methods: {
        showModal (name) {
            this.$bvModal.show(name);
        },
        hideModal (name) {
            this.$bvModal.hide(name);
        }
    }
};

export default CommonMixin;