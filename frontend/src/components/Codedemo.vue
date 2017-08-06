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
        </select>
    </main>
  </div>
</template>

<script>
// require htmlmixed mode
require('../../node_modules/codemirror/mode/vue/vue.js')
require('../../node_modules/codemirror/mode/javascript/javascript.js')

// require hint addon for javacript
require('../../node_modules/codemirror/addon/hint/show-hint.js')
require('../../node_modules/codemirror/addon/hint/show-hint.css')
require('../../node_modules/codemirror/addon/hint/javascript-hint.js')
const codes = {
    javascript: 'var component = {\n\t\tname: "write here"\n}\n\n',
    vue: '<template>\n<codemirror :value="code"></codemirror>\n</template>\n\n'
}
import codemirror from './codemirror'
  export default {
    components: {
      codemirror
    },
    data() {
        return {
            mode: 'javascript'
        }
    },
    computed: {
        code: function () {
            return codes[this.mode]
        },
        options: function () {
            return {
                mode: this.mode,
                tabSize: 2,
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {'Ctrl': 'autocomplete'},
            }
        }
    },
    methods: {
        change: function (code) {
            console.log('change', code)
        }
    },
    install:function (Vue) {
    Vue.component('codemirror', CmComponent)
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