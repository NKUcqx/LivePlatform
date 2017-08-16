<template>
<div>
    <div id="relative" ref="relative">
        <div id="switch">
            <Poptip trigger="hover" content="PPT" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="canvas-item" @click="changePanel(0)"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Code" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="ppt-item" @click="changePanel(1)"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Canvas" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="code-item" @click="changePanel(2)"><Icon type="ios-checkmark-empty" size="5" class="icon"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Close" class="poptip" id="close-piptip" placement="bottom">
                <span class="switch-item" id="close-button" @click="closePanel"><Icon type="ios-close-empty" size="5" class="icon"></Icon></span>
            </Poptip>
        </div>
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
            }
        },
        methods: {
            closePanel () {
                this.$emit('close', '')
            },
            changePanel (index) {
                this.$emit('change', index)
            }
        },
        mounted () {
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
        position: relative;
        top: 3px;
        left: -78px;
        height: 14px;
        z-index: 400;
        width: 75px;
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
    #close-piptip {
        float: right;
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