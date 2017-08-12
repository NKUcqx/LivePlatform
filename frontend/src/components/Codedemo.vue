<template>
  <div class="container">
    <main v-cloak id="app">
      <div class="cm-container">
        <codemirror id="textarea" :value="code" @change="change" :options="options" :WIDTH="this.WIDTH" :HEIGHT="this.HEIGHT"></codemirror>
        <div id="relative" ref="relative">
             <Select name="mode" id="select" @change="changelan" v-model="mode" placement="top">
                <Option value="javascript">JS</Option>
                <Option value="vue">vue</Option>
                <Option value="text/x-c++src">C++</Option>
                <Option value="text/x-c">C</Option>
                <Option value="text/x-csharp">C#</Option>
                <Option value="text/x-java">Java</Option>
                <Option value="sql">sql</Option>
                <Option value="text/css">css</Option>
                <Option value="htmlmixed">html</Option>
            </Select>
        </div>
    </div>
    </main>
  </div>
</template>

<script>
import { wsConnect, wsSend, wsClose } from '../utils/websockets'
import codemirror from './codemirror'

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
    components: {
        codemirror
    },
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
    watch: {
        'this.$refs.relative.offsetLeft': function (newVal, oldVal) {
            console.log(newVal)
            this.position.left = (newVal).toString() + 'px'
        },
        'this.$refs.relative.offsetTop': function (newVal, oldVal) {
            this.position.top = (newVal).toString() + 'px'
        }
    },
    data () {
        return {
            mode: 'javascript',
            socket: ''
        }
    },
    computed: {
        code: function () {
            if (this.mode === 'text/x-c++src') {
                return codes[1]
            } else if (this.mode === 'text/x-c') {
                return codes[2]
            } else if (this.mode === 'text/x-csharp') {
                return codes[3]
            } else if (this.mode === 'text/x-java') {
                return codes[4]
            } else if (this.mode === 'text/css') {
                return codes[5]
            } else {
                return codes[this.mode]
            }
        },
        options: function () {
            return {
                mode: this.mode,
                tabSize: 2,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'}
            }
        }
    },
    mounted: function () {
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
        },
        changelan: function () {
            var select = document.getElementById('select')
            var value = null
            for (var i = 0; i < select.options.length; i++) {
                if (select.options[i].selected === true) {
                    value = select.options[i].value
                    break
                }
            }
            wsSend(this.socket, value)
        }
    }
}
</script>
<style scoped>
[v-cloak] {
  display: none;
}

#relative {
    display: block;
    width: 0;
    height: 0;
    border: 1px solid red;
    float: right;
}

#select {
    position: relative;
    width: 70px;
    height: 36px;
    top: -36px;
    left: -80px;
    z-index: 999;
    clear: both;
    float: left;
}

.container {
    margin: 0 auto;
    width: 100%;
}

.cm-container {
    text-align: left;
}
</style>