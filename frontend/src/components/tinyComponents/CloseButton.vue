<template>
<div>
<div id="close-buttons">
    <div id="relative" ref="relative">
        <div id="switch">
            <Poptip trigger="hover" content="PPT" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="canvas-item" @click="changePanel(0)"><Icon type="ios-checkmark-empty" size="5" class="icon" :class="(showIcon(0))?'show':''"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Code" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="ppt-item" @click="changePanel(1)"><Icon type="ios-checkmark-empty" size="5" class="icon" :class="(showIcon(1))?'show':''"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Canvas" class="poptip" v-if="isWork" placement="bottom">
                <span class="switch-item" id="code-item" @click="changePanel(2)"><Icon type="ios-checkmark-empty" size="5" class="icon" :class="(showIcon(2))?'show':''"></Icon></span>
            </Poptip>
            <Poptip trigger="hover" content="Close" class="poptip" id="close-piptip" placement="bottom">
                <span class="switch-item" id="close-button" @click="closePanel"><Icon type="ios-close-empty" size="5" class="icon"></Icon></span>
            </Poptip>
        </div>
    </div>
</div>
</div>
</template>

<script>
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
import { CONST } from '../../utils/const'
/**
 *关闭按钮
 *@class CloseButton
 *@constructor
 */
export default {
    props: {
        isWork: {
            type: Boolean,
            default: false
        },
        AUTHORITY: {
            type: Boolean,
            default: false
        },
        INIT: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // 0 means ppt 1 means code 2 means canvas
            state: 0
        }
    },
    methods: {
        /**
         *获得现在的状态（是ppt还是代码编辑器还是画板）
         *@method getHistory
         *@return {Number} 返回0或1或2，0代表ppt，1代表代码编辑器，2代表白板
         */
        getHistory () {
            return this.state
        },
        /**
         *发送现在的状态
         *@event reloadClear
         */
        reloadClear () {
            this.send(this.state)
        },
        /**
         *发送信息
         *@event send
         *@param {Object} data
         */
        send (data) {
            this.$emit('send', data)
        },
        /**
         *接收信息
         *@event receive
         *@param {Object} data
         */
        receive (data) {
            this.state = data.data
            this.$emit('change', this.state)
        },
        /**
         *现在正在操作的按钮上显示 √
         *@event showIcon
         *@param {Number} index
         */
        showIcon (index) {
            if (index === this.state) {
                return true
            }
            return false
        },
        /**
         *关闭面板
         *@event closePanel
         */
        closePanel () {
            this.$emit('close', '')
        },
        /**
         *切换面板，换一个面板显示
         *@event changePanel
         *@param {Number} index
         */
        changePanel (index) {
            if (this.AUTHORITY) {
                this.state = index
                this.$emit('change', this.state)
                this.send(index)
            } else {
                this.$Message.warning(CONST.permission)
            }
        }
    },
    mounted () {
        this.state = this.INIT
    }
}
</script>

<style scoped>
    #close-buttons #relative {
        width: 0;
        height: 0;
        float: right;
    }
    #close-buttons #switch {
        display: block;
        position: relative;
        top: 3px;
        left: -78px;
        height: 14px;
        z-index: 400;
        width: 75px;
    }
    #close-buttons .switch-item {
        display: inline-block;
        height: 14px;
        width: 14px;
        border-radius: 50%;
    }
    #close-buttons .switch-item:hover {
        cursor: pointer;
    }
    #close-buttons #canvas-item {
        background-color: rgb(25,190,107,0.8);
    }
    #close-buttons #ppt-item {
        background-color: rgb(255,153,0,0.8);
    }
    #close-buttons #code-item {
        background-color: rgb(45,140,240,0.8);
    }
    #close-buttons #close-button {
        margin-left: 6px;
        background-color: rgb(237,63,20,0.8);
    }
    #close-buttons #close-piptip {
        float: right;
    }
    #close-buttons .poptip {
        text-align: center;
    }
    #close-buttons .icon {
        color: black;
        display: none;
    }
    #close-buttons .switch-item:hover>.icon {
        display: inline;
    }

    #close-buttons .show {
        display: inline;
    }
</style>