<template>
    <div class="container">
        <main v-cloak id="app">
            <div class="cm-container">
                <textarea @change="change" id="codemirror"></textarea>
            </div>
            <div id="relative">
                <select name="mode" id="select" @change="changelan" v-model="mode" :disabled="!AUTHORITY">
                    <option value='javascript' class="option">javascript</option>
                    <option value='vue' class="option">vue</option>
                    <option value='text/x-c++src' class="option">C++</option>
                    <option value='text/x-c' class="option">C</option>
                    <option value='text/x-csharp' class="option">C#</option>
                    <option value='text/x-java' class="option">Java</option>
                    <option value='sql' class="option">sql</option>
                    <option value='text/css' class="option">css</option>
                    <option value='htmlmixed' class="option">html</option>
                    <option value='python' class="option">python</option>
                </select>
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
var CodeMirror = require('../../node_modules/codemirror/lib/codemirror.js')
require('../../node_modules/codemirror/lib/codemirror.css')

// require htmlmixed mode
require('../../node_modules/codemirror/mode/vue/vue.js')
require('../../node_modules/codemirror/mode/javascript/javascript.js')
require('../../node_modules/codemirror/mode/clike/clike.js')
require('../../node_modules/codemirror/mode/css/css.js')
require('../../node_modules/codemirror/mode/xml/xml.js')
require('../../node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
require('../../node_modules/codemirror/mode/sql/sql.js')
require('../../node_modules/codemirror/mode/python/python.js')

// require hint addon for javacript
require('../../node_modules/codemirror/addon/hint/show-hint.js')
require('../../node_modules/codemirror/addon/hint/show-hint.css')
require('../../node_modules/codemirror/addon/hint/javascript-hint.js')
require('../../node_modules/codemirror/addon/hint/anyword-hint.js')
require('../../node_modules/codemirror/addon/hint/css-hint.js')
require('../../node_modules/codemirror/addon/hint/html-hint.js')
require('../../node_modules/codemirror/addon/hint/sql-hint.js')
require('../../node_modules/codemirror/addon/hint/xml-hint.js')

require('../../node_modules/codemirror/theme/neo.css')
/**
 *代码编辑器
 *@class CodeMirror
 *@constructor
 */
export default {
    props: {
        /**
         *@element WIDTH
         */
        WIDTH: {
            /**
             *@attribute type
             *@default Number
             */
            type: Number,
            /**
             *@attribute default
             *@default 400
             */
            default: 400
        },
        /**
         *@element HEIGHT
         */
        HEIGHT: {
            /**
             *@attribute type
             *@default Number
             */
            type: Number,
            /**
             *@attribute default
             *@default 260
             */
            default: 260
        },
        /**
         *@element CREATORID
         */
        CREATORID: {
            /**
             *@attribute type
             *@default Number
             */
            type: Number,
            /**
             *@attribute default
             *@default 0
             */
            default: 0
        },
        /**
         *@element CREATORID
         */
        AUTHORITY: {
            /**
             *@attribute type
             *@default Boolean
             */
            type: Boolean,
            /**
             *@attribute default
             *@default false
             */
            default: false
        }
    },
    data () {
        return {
            /**
             *@property editor
             *@type Object
             *@default null
             */
            editor: null,
            /**
             *@property mode
             *@type String
             *@default 'javascript'
             */
            mode: 'javascript',
            /**
             *@property socket
             *@type Object
             *@defult ''
             */
            socket: '',
            /**
             *@property skipNextChangeEvent
             *@type Boolean
             *@default false
             */
            skipNextChangeEvent: false,
            /**
             *@property value
             *@type Type
             *@default String
             */
            value: String,
            /**
             *@property options
             *@type Object
             */
            options: {
                /**
                 *@attribute mode
                 *@type String
                 *@default 'text/javascript'
                 */
                mode: 'text/javascript',
                /**
                 *@attribute tabSize
                 *@type Number
                 *@default 4
                 */
                tabSize: 4,
                /**
                 *@attribute lineNumbers
                 *@type Boolean
                 *@default true
                 */
                lineNumbers: true,
                /**
                 *@attribute lineWrapping
                 *@type Boolean
                 *@default true
                 */
                lineWrapping: true,
                /**
                 *@attribute extraKeys
                 *@type Dictionary
                 *@default true
                 */
                extraKeys: {'Ctrl': 'autocomplete'},
                /**
                 *@attribute readOnly
                 *@type Boolean
                 */
                readOnly: (this.AUTHORITY) ? false : true,
                /**
                 *@attribute theme
                 *@type String
                 */
                theme: 'neo'
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser'
        })
    },
    /**
     *响应codemirror文本区内的事件，并且调整文本区宽高的大小
     *@event mounted
     */
    mounted: function () {
        /*
        你现在如果需要对比当前用户是不是房间的创建者，只需要判断user.userid === CREATERID
        */
        /**
         * @property _this
         * @default this
         * @static
         * @private
         */
        var _this = this
        this.editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), _this.options)
        // this.editor.setValue('please code here')
        /**
         *响应codemirror文本区的内容改变的事件，利用socketio发送信息
         *@event onchange
         *@bubbles editor.on('change')
         */
        this.editor.on('change', function (cm) {
            _this.send({
                type: 'code',
                data: cm.getValue()
            })
        })
        /**
         *响应codemirror中光标选中的事件，利用socketio发送信息
         *@event oncursorActivity
         *@bubbles editor.on('cursorActivity')
         */
        this.editor.on('cursorActivity', function () {
            // console.log(_this.editor.getCursor("anchor"))
            // console.log(_this.editor.getCursor("head"))
            _this.send({
                type: 'cursor',
                data: {
                    from: _this.editor.getCursor('anchor'),
                    to: _this.editor.getCursor('head')
                }
            })
        })
        this.editor.setSize(this.WIDTH, this.HEIGHT)
    },
    methods: {
        /**
         *获取codemirror文本框里的值
         *@method getHistory
         *@return {Object} 返回type为'code'以及取到的值
         */
        getHistory: function () {
            return {
                type: 'code',
                data: this.editor.getValue()
            }
        },
        /**
         *发送codemirror文本框里的值
         *@method reloadClear
         *@return {Object} 返回type为'code'以及取到的值
         */
        reloadClear () {
            this.send({
                type: 'code',
                data: this.editor.getValue()
            })
        },
        /**
         *打印文本框内容已更改且更改后的信息
         *@event change
         */
        change: function (code) {
            console.log('change', code)
            // this.send({data:code})
        },
        /**
         *响应更改语言选择的信息，获取现在所选语言，将codemirror的mode设为这个语言，并用socketio发送消息
         *@event changelan
         */
        changelan: function () {
            var _this = this
            var select = document.getElementById('select')
            var value = null
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].selected === true) {
                    value = select.options[i].value
                    break
                }
            }
            this.options = {
                mode: value,
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'},
                readOnly: (this.AUTHORITY) ? false : true
            }
            console.log('options.mode:' + this.options.mode)
            this.value = 'code here'
            // wsSend(this.socket, value)
            this.send({
                type: 'lang',
                data: value
            })
        },
        /**
         *发送消息，判断用户是否有权限发送信息，有就发送成功，没有就发送失败
         *@event send
         *@param {Object} data（想要发送的信息）
         */
        send (data) {
            console.log('userid是' + this.user.userid)
            console.log('AUTHORITY is' + this.AUTHORITY)
            if (this.AUTHORITY) {
                this.$emit('send', data)
                console.log('codesend' + data)
                console.log('sendsuccess')
            }
        },
        /**
         *接收消息，并按照消息的type属性进行分类处理
         *@event receive
         *@param {Object} data（接受的信息）
         */
        receive (data) {
            // code(data.data)
            // console.log('codereceive'+data.data)
            console.log('receive' + data.data.type)
            if (data.data.type === 'code') {
                this.editor.setValue(data.data.data)
                console.log('setValue' + data.data.data)
            } else if (data.data.type === 'lang') {
                var select = document.getElementById('select')
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === data.data.data) {
                        select.options[i].selected = true
                        break
                    }
                }
            } else {
                this.editor.setSelection({ line: data.data.data.from.line, ch: data.data.data.from.ch }, { line: data.data.data.to.line, ch: data.data.data.to.ch })
            }
        }
    },
    watch: {
        /**
         *实现文档的滚动处理（如果行数太多，控制将文档滚动到适当位置）
         *@event watchvalue
         *@param {String} newVal
         *@param {String} oldVal
         */
        value: function (newVal, oldVal) {
            var editorValue = this.editor.getValue()
            if (newVal !== editorValue) {
                this.skipNextChangeEvent = true
                var scrollInfo = this.editor.getScrollInfo()
                // this.editor.setValue(newVal)
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
        },
        /**
         *实现codemirror文本框内的语言转换
         *@event watchoptions
         *@param {Object} newOptions
         *@param {String} oldVal
         */
        options: function (newOptions, oldVal) {
            if (typeof newOptions === 'object') {
                for (var optionName in newOptions) {
                    if (newOptions.hasOwnProperty(optionName)) {
                        this.editor.setOption(optionName, newOptions[optionName])
                    }
                }
            }
        },
        /**
         *实现codemirror文本框长宽调节
         *@event watchHEIGHT
         *@param {String} newVal
         *@param {String} oldVal
         */
        HEIGHT: function (newVal, oldVal) {
            this.editor.setSize(this.WIDTH, this.HEIGHT)
        }
    },
    /**
     *销毁前将现在的数据清空，防止第二次使用
     *@event beforeDestroy
     */
    beforeDestroy: function () {
        if (this.editor) {
            this.editor.toTextArea()
        }
    }
}
</script>
<style scoped>
[v-cloak] {
  display: none;
}

.container {
  margin: 0 auto;
}

.cm-container {
  border: #ddd solid 1px;
  text-align: left;
}

.CodeMirror-code {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}

#relative {
    float: right;
    width: 0;
    height: 0;
}

#select {
    width: 80px;
    height: 30px;
    background-color: white;
    border: 1px rgb(219,219,219) solid;
    position: relative;
    top: -36px;
    left: -83px;
}

.option {
    color: #5cadff;
}

#code-mirror {
    overflow: hidden !important;
}
</style>
