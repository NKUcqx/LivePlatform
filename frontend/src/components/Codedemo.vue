<template>
    <div class="container">
        <h1>CodeMirror Component</h1>
        <main v-cloak id="app">
            <div class="cm-container">
                <codemirror :value="code" @change="change" :options="options"></codemirror>
            </div>
            <select name="mode" v-model="mode">
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
    // clike:'int main(void) {\n\t\t// your code goes here\n\t\treturn 0;\n}',
    sql: '-- your code goes here',
    5: '#app{\n\t\theight:100px;\n\t\twidth:100px;\n}',
    htmlmixed: '<!DOCTYPE html>\n<html>'
}
import codemirror from './codemirror'

export default {
    components: {
        codemirror
    },
    data () {
        return {
            mode: 'javascript'
        }
    },
    computed: {
        code: function () {
            if (this.mode === 'text/x-c++src') { return codes[1] } else if (this.mode === 'text/x-c') { return codes[2] } else if (this.mode === 'text/x-csharp') { return codes[3] } else if (this.mode === 'text/x-java') { return codes[4] } else if (this.mode === 'text/css') { return codes[5] } else {
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
    methods: {
        change: function (code) {
            console.log('change', code)
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
</style>