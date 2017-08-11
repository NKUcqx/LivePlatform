<template>
<div>
    <div id="relative" ref="relative"></div>
    <div id="switch" :style="position">
    <Poptip trigger="hover" content="Canvas" class="poptip" v-if="isWork">
        <span class="switch-item" id="canvas-item"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
    </Poptip>
    <Poptip trigger="hover" content="PPT" class="poptip" v-if="isWork">
        <span class="switch-item" id="ppt-item"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
    </Poptip>
    <Poptip trigger="hover" content="Code" class="poptip" v-if="isWork">
        <span class="switch-item" id="code-item"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
    </Poptip>
    <Poptip trigger="hover" content="Close" class="poptip">
        <span class="switch-item" id="close-button" @click="closePanel"><Icon type="ios-close-empty" size="5" class="icon"></Icon></span>
    </Poptip>
    </div>
</div>
</template>

<script>
    export default {
        props: {
            isWork: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                distance: 26,
                position: {
                    left: '50px',
                    top: '50px'
                }
            }
        },
        methods: {
            closePanel () {
                this.$emit('close', '')
            }
        },
        mounted () {
            this.distance = (this.isWork) ? 78 : 26
            this.position.left = (this.$refs.relative.offsetLeft - this.distance).toString() + 'px'
            this.position.top = (this.$refs.relative.offsetTop + 3).toString() + 'px'
            window.addEventListener('resize', () => {
                this.position.left = (this.$refs.relative.offsetLeft - this.distance).toString() + 'px'
                this.position.top = (this.$refs.relative.offsetTop + 3).toString() + 'px'
            })
        }
    }
</script>

<style scoped>
    #relative {
        width: 0;
        height: 0;
        float: right;
    }
    #switch {
        display: block;
        position: absolute;
        height: 14px;
        z-index: 999;
    }
    .switch-item {
        display: inline-block;
        height: 14px;
        width: 14px;
        border-radius: 50%;
    }
    .switch-item:hover {
        cursor: pointer;
    }
    #canvas-item {
        background-color: rgb(25,190,107);
    }
    #ppt-item {
        background-color: rgb(255,153,0);
    }
    #code-item {
        background-color: rgb(45,140,240);
    }
    #close-button {
        margin-left: 6px;
        background-color: rgb(237,63,20);
    }
    .poptip {
        text-align: center;
    }
    .icon {
        color: black;
        display: none;
    }
    .switch-item:hover>.icon {
        display: inline;
    }
</style>