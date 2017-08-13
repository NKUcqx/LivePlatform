<template>
    <textarea></textarea>
</template>

<script>
// import { wsConnect, wsSend, wsClose } from '../utils/websockets'
import CodeMirror from 'codemirror'
require('../../node_modules/codemirror/lib/codemirror.css')
// require('../../entry.js')

export default {
    props: {
        WIDTH: Number,
        HEIGHT: Number,
        value: String,
        options: {
            type: Object,
            default: function () {
                return {
                    mode: 'text/javascript',
                    lineNumbers: true,
                    lineWrapping: true
                }
            }
        }
    },
    data: function () {
        return {
            editor: null,
            skipNextChangeEvent: false,
            socket: ''
        }
    },
    mounted: function () {
        var _this = this
        console.log(this.options)
        this.editor = CodeMirror.fromTextArea(this.$el, this.options)
        this.editor.setSize('100%', '100%')
        this.editor.on('change', function (cm) {
            var nowvalue = cm.getValue()
            // wsSend(_this.socket, nowvalue)
            // _this.socket.emit('updateMessage',)
            if (_this.skipNextChangeEvent) {
                _this.skipNextChangeEvent = false
                return
            }
            if (_this.$emit) {
                _this.$emit('change', cm.getValue())
                _this.$emit('input', cm.getValue())
            }
        })
        // this.socket=io.connect('http://localhost:8002')
        /* this.socket = wsConnect('/canvaschannel/', (e) => {
            console.log('websocket start')
            if (_this.editor.getValue() !== e.data) {
                _this.editor.setValue(e.data)
                console.log('e.data是' + e.data)
                console.log('cm.getValue是' + _this.editor.getValue())
            }
        }) */
    },
    watch: {
        'value': function (newVal, oldVal) {
            var editorValue = this.editor.getValue()
            if (newVal !== editorValue) {
                this.skipNextChangeEvent = true
                var scrollInfo = this.editor.getScrollInfo()
                this.editor.setValue(newVal)
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
        },
        'options': function (newOptions, oldVal) {
            if (typeof newOptions === 'object') {
                for (var optionName in newOptions) {
                    if (newOptions.hasOwnProperty(optionName)) {
                        this.editor.setOption(optionName, newOptions[optionName])
                    }
                }
            }
        },
        'HEIGHT': function (newVal, oldVal) {
            this.editor.setSize(this.WIDTH.toString() + 'px', this.HEIGHT.toString() + 'px')
        }
    },
    beforeDestroy: function () {
        if (this.editor) {
            this.editor.toTextArea()
        }
    }
}
</script>

<style>
    .CodeMirror-code {
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        font-size: 15px;
    }
</style>
