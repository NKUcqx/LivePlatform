<template>
    <div class="container">
        <main v-cloak id="app">
            <div class="cm-container">
                <textarea @change="change" id="codemirror"></textarea>
            </div>
            <div id="relative">
                <select name="mode" id="select" @change="changelan" v-model="mode">
                    <option value="javascript" class="option">javascript</option>
                    <option value="vue" class="option">vue</option>
                    <option value="text/x-c++src" class="option">C++</option>
                    <option value="text/x-c" class="option">C</option>
                    <option value="text/x-csharp" class="option">C#</option>
                    <option value="text/x-java" class="option">Java</option>
                    <option value="sql" class="option">sql</option>
                    <option value="text/css" class="option">css</option>
                    <option value="htmlmixed" class="option">html</option>
                </select>
            </div>
        </main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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

// require hint addon for javacript
require('../../node_modules/codemirror/addon/hint/show-hint.js')
require('../../node_modules/codemirror/addon/hint/show-hint.css')
require('../../node_modules/codemirror/addon/hint/javascript-hint.js')
require('../../node_modules/codemirror/addon/hint/anyword-hint.js')
require('../../node_modules/codemirror/addon/hint/css-hint.js')
require('../../node_modules/codemirror/addon/hint/html-hint.js')
require('../../node_modules/codemirror/addon/hint/sql-hint.js')
const codes = {
    javascript: 'var component = {\n\t\tname: "write here"\n}\n\n',
    vue: '<template>\n<codemirror :value="code"></codemirror>\n</template>\n\n',
    1: '#include<iostream>\nusing namespace std;\n',
    2: '#include<stdlib.h>\n',
    3: 'static void main(string[] args)\n{\n}\n',
    4: 'public class HelloWorld\n{\n\t\tpublic static void main(String args[])\n\t\t{\n\t\t\t\tSystem.out.println("HelloWorld!");\n\t\t}\n}',
    sql: '-- your code goes here',
    5: '#app{\n\t\theight:100px;\n\t\twidth:100px;\n}',
    htmlmixed: '<!DOCTYPE html>\n<html>'
}

export default {
    props: {
        WIDTH: {
            type: Number,
            default: 600
        },
        HEIGHT: {
            type: Number,
            default: 400
        },
        CREATORID: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            editor: null,
            mode: 'javascript',
            socket: '',
            skipNextChangeEvent: false,
            value: String,
            options: {
                mode: 'text/javascript',
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'}
            }
        }
    },
    computed: {
        ...mapGetters({
            user: 'getUser'
        })
    },
    mounted: function () {
        /*
        你现在如果需要对比当前用户是不是房间的创建者，只需要判断user.userid === CREATERID
        */
            console.log('creator:', this.CREATORID)
            console.log('user: ', this.user.userid)
            console.log('by gongyansong')

        var _this = this
        this.editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), _this.options)
        this.editor.on('change', function (cm) {
            // console.log(i)
            // console.log(op)
            _this.send({
                type: 'code',
                data: cm.getValue()
            })
            /* var nowvalue = cm.getValue()
            // wsSend(_this.socket, nowvalue)
            // _this.socket.emit('updateMessage',)
            if (_this.skipNextChangeEvent) {
                _this.skipNextChangeEvent = false
                return
            }
            if (_this.$emit) {
                _this.$emit('change', cm.getValue())
                _this.$emit('input', cm.getValue())
            } */
        })
        /* this.socket = wsConnect('/websocket/', (e) => {
        }) */
        this.editor.setSize(this.WIDTH, this.HEIGHT)
    },
    methods: {
        change: function (code) {
            console.log('change', code)
            // this.send({data:code})
        },
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
                mode: _this.mode,
                tabSize: 4,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'}
            }
            console.log('options.mode:' + this.options.mode)
            this.value = 'code here'
            // wsSend(this.socket, value)
            this.send({
                type: 'lang',
                data: value
            })
        },
        send (data) {
            this.$emit('send', data)
            console.log('codesend' + data)
        },
        receive (data) {
            // code(data.data)
            // console.log('codereceive'+data.data)
            console.log('receive' + data.data.type)
            if (data.data.type === 'code') {
                // this.editor.setValue(data.data.data)
                console.log('setValue' + data.data.data)
            } else {
                var select = document.getElementById('select')
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === data.data.data) {
                        select.options[i].selected = true
                        break
                    }
                }
            }
        }
    },
    watch: {
        value: function (newVal, oldVal) {
            var editorValue = this.editor.getValue()
            if (newVal !== editorValue) {
                this.skipNextChangeEvent = true
                var scrollInfo = this.editor.getScrollInfo()
                // this.editor.setValue(newVal)
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
        },
        options: function (newOptions, oldVal) {
            if (typeof newOptions === 'object') {
                for (var optionName in newOptions) {
                    if (newOptions.hasOwnProperty(optionName)) {
                        this.editor.setOption(optionName, newOptions[optionName])
                    }
                }
            }
        },
        HEIGHT: function (newVal, oldVal) {
            this.editor.setSize(this.WIDTH, this.HEIGHT)
        }
    },
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
</style>
