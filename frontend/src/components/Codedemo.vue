<template>
    <div class="container">
        <h1>CodeMirror Component</h1>
        <main v-cloak id="app">
            <div class="cm-container">
                <textarea @change="change" id="codemirror"></textarea>
            </div>
            <select name="mode" id="select" @change="changelan" v-model="mode">
                <option value="javascript">javascript</option>
                <option value="vue">vue</option>
                <option value="text/x-c++src">C++</option>
                <option value="text/x-c">C</option>
                <option value="text/x-csharp">C#</option>
                <option value="text/x-java">Java</option>
                <option value="sql">sql</option>
                <option value="text/css">css</option>
                <option value="htmlmixed">html</option>
            </select>
        </main>
    </div>
</template>

<script>
import { wsConnect, wsSend, wsClose } from '../utils/websockets'
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
            default: 400
        },
        HEIGHT: {
            type: Number,
            default: 600
        }
    },
    data () {
        return {
            mode: 'javascript',
            socket: '',
            skipNextChangeEvent: false,
            position1: {
                width: '400px',
                height: '600px',
                margin: '0 auto'
            },
            position2: {
                width: '400px',
                height: '300px',
                margin: '0 auto'
            },
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
        }
    },
    ready: function () {
        var _this = this
        this.editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), _this.options)
        this.editor.setValue(_this.value)
        this.editor.on('change', function (cm) {
            if (_this.skipNextChangeEvent) {
                _this.skipNextChangeEvent = false
                return
            }
            _this.value = cm.getValue()
            if (_this.$emit) {
                _this.$emit('change', cm.getValue())
            }
        })
    },
    mounted: function () {
        var _this = this
        this.editor = CodeMirror.fromTextArea(document.getElementById('codemirror'), _this.options)
        this.editor.on('change', function (cm) {
            //console.log(i)
            //console.log(op)
            _this.send(cm.getValue())
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
        this.socket = wsConnect('/websocket/', (e) => {
            var select = document.getElementById('select')
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].value === e.data) {
                    select.options[i].selected = true
                    break
                }
            }
        })
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
                tabSize: 2,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'}
            }
            console.log('options.mode:' + this.options.mode)
            this.value = 'code here'
            wsSend(this.socket, value)
        },
        send (data) {
            this.$emit('send', data)
            console.log('codesend' + data)
        },
        receive (data) {
            // code(data.data)
            // console.log('codereceive'+data.data)
            this.editor.setValue(data.data)
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

body {
  padding: 30px;
  font-family: Helvetica, Arial, sans-serif;
}

h1, h2 {
  font-weight: 300;
}

.container {
  margin: 0 auto;
  max-width: 720px;
  max-height: 450px;
}

.cm-container {
  border: #ddd solid 1px;
  margin-bottom: 10px;
  text-align: left;
}

footer {
  margin-top: 20px;
  padding-top: 10px;
  border-top: #dedede solid 1px;
}

.CodeMirror-code {
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}
</style>
