<template>
	<div id="canvas" ref="canvas">
        <div id="relative" @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
            <Button type="ghost" :size="SIZE" shape="circle" icon="wrench" id="tool-button"></Button>
        </div>
		<!--div :style="btnPosition" id="show-tool" ref="showTool"  @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
			<Button type="ghost" :size="SIZE" shape="circle" icon="wrench" id="tool-button"></Button>
		</div-->
		<Row >
		<div ref="toolbar" id="tool-bar" :style="toolBarPosition" v-if="this.toolBar" @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
			<Poptip trigger="hover" content="choose pen" placement="top"  class="buttons">
				<Button :size="SIZE" :type="checkType('pen')" shape="circle" icon="edit" @click="changeType('pen')" class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose line" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('line')" shape="circle" icon="minus-round" @click="changeType('line')"  class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose rect" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('rect')" shape="circle" icon="android-checkbox-outline-blank" @click="changeType('rect')" class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose circle" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('circle')" shape="circle" icon="android-radio-button-off" @click="changeType('circle')" class="buttons" ></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose rubber" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('rubber')" shape="circle" icon="android-checkbox-blank" @click="changeType('rubber')" class="buttons" ></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose text" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('text')" shape="circle" icon="compose" @click="changeType('text')" class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFill" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkFill()" shape="circle" icon="android-star-half" @click="changeFill()" class="buttons"></Button>
			</Poptip>
			<br>
			<Poptip trigger="hover" content="color picker" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="android-color-palette" @click="colorPicker()"  class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" content="clear" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="refresh" @click="clearBoard()"  class="buttons"></Button>
		    </Poptip>
		    <Poptip trigger="hover" :content="getWidth" placement="bottom"   class="buttons">
		    	<Button :size="SIZE" type="default" shape="circle" icon="plus" @click="addWidth()"  class="buttons"></Button>
		    </Poptip>
		    <Poptip trigger="hover" :content="getWidth" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="minus" @click="minusWidth()"  class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFontSize" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="plus-round" @click="addFontSize()"  class="buttons"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFontSize" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="minus-round" @click="minusFontSize()" class="buttons"></Button>
			</Poptip>
		</div>
		<Modal v-model="showColorPicker" :width="250" :closable="false" id="modal">
	        <div style="text-align:center">
	            <color-picker v-model="canvas.color"></color-picker>
	        </div>
	        <div slot="footer"></div>
	    </Modal>
	    <Col span="24" id="draw-board">
			<canvas ref="board" id="board"></canvas>
			<Input :on-keydown="testText()" ref="text" id="text" v-model="canvas.text" v-if="canvas.isInput" autofocus :style="position" type="textarea" autosize></Input>
		</Col>
		</Row>
	</div>
</template>

<script>
import { Sketch } from 'vue-color'
import { wsConnect, wsSend, wsClose } from '../../utils/websockets'
import { makeCanvasInfo } from '../../utils/messages'
const defaultProps = {
    hex: '#194d33',
    hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
    hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
    rgba: { r: 25, g: 77, b: 51, a: 1 },
    a: 1
}

export default {
    components: {
        'color-picker': Sketch
    },
    props: {
        WIDTH: {
            type: Number,
            default: 800
        },
        HEIGHT: {
            type: Number,
            default: 600
        },
        SIZE: {
            type: Number,
            default: ''
        }
    },
    watch: {
        'WIDTH': function (newVal, oldVal) {
            /* let imgData = this.context.getImageData(0, 0, oldVal, oldVal * 0.65)
            this.$refs.board.width = this.WIDTH
            this.$refs.board.height = this.HEIGHT
            this.context.putImageData(imgData, 0, 0, 0, 0, this.WIDTH, this.HEIGHT) */
            var nc = document.createElement('canvas')
            nc.width = this.$refs.board.width
            nc.height = this.$refs.board.height
            nc.getContext('2d').drawImage(this.$refs.board, 0, 0)
            this.$refs.board.width = this.WIDTH
            this.$refs.board.height = this.HEIGHT
            this.context.drawImage(nc, 0, 0, this.WIDTH, this.HEIGHT)
        }
    },
    data () {
        return {
            socket: null,
            toolBar: false,
            showColorPicker: false,
            types: ['pen', 'line', 'circle', 'rect', 'rubber', 'text'],
            type: 'pen',
            context: null,
            canvas: {
                width: 3,
                fontSize: 20,
                color: defaultProps,
                penOriginPoint: null,
                lastImageData: null,
                isFill: false,
                isInput: false,
                text: ''
            },
            position: {
                position: 'absolute',
                left: '30px',
                top: '30px',
                zIndex: 999,
                width: '100px'
            },
            btnPosition: {
                position: 'absolute',
                left: '30px',
                top: '30px',
                zIndex: 400
            },
            toolBarPosition: {
                position: 'absolute',
                zIndex: 999
            }
        }
    },
    computed: {
        getWidth () {
            return 'width: ' + this.canvas.width.toString()
        },
        getFontSize () {
            return 'fontSize: ' + this.canvas.fontSize.toString()
        },
        getFill () {
            return (this.canvas.isFill) ? 'fill' : 'stroke'
        }
    },
    methods: {
        showToolBar () {
            this.toolBar = true
        },
        hideToolBar () {
            this.toolBar = false
        },
        widthSliderFomat (val) {
            return 'width: ' + val + 'px'
        },
        fontSliderFomat (val) {
            return 'font: ' + val + 'px'
        },
        colorPicker () {
            this.showColorPicker = true
        },
        checkType (type) {
            return (this.type === type) ? 'primary' : 'ghost'
        },
        changeType (type) {
            this.type = type
        },
        checkFill () {
            return (this.canvas.isFill) ? 'primary' : 'ghost'
        },
        changeFill () {
            this.canvas.isFill = !(this.canvas.isFill)
        },
        addWidth () {
            (this.canvas.width < 24) ? (this.canvas.width++) : ''
        },
        minusWidth () {
            (this.canvas.width > 1) ? (this.canvas.width--) : ''
        },
        addFontSize () {
            (this.canvas.fontSize < 35) ? (this.canvas.fontSize++) : ''
        },
        minusFontSize () {
            (this.canvas.fontSize > 15) ? (this.canvas.fontSize--) : ''
        },
        send (data) {
            this.$emit('send', data)
        },
        receive (data) {
            this.draw(data.data)
        },
        testText () {
            if (this.canvas.text.indexOf('\n') >= 0) {
                try {
                    this.putText()
                } catch (e) {
                    console.log(e)
                }
            }
        },
        drawLine (ox, oy, ex, ey) {
            const context = this.context
            context.beginPath()
            context.moveTo(ox, oy)
            context.lineTo(ex, ey)
            context.stroke()
            context.closePath()
        },
        drawCircle (ox, oy, ex, ey, isFill = false) {
            const context = this.context
            const [ dx, dy ] = [ ex - ox, ey - oy ]
            const [ cx, cy ] = [ (ex + ox) / 2, (ey + oy) / 2 ]
            const radius = (Math.sqrt(dx * dx + dy * dy)) / 2
            context.beginPath()
            context.arc(cx, cy, radius, 0, 2 * Math.PI, true);
            (isFill) ? context.fill() : context.stroke()
            context.closePath()
        },
        drawRect (ox, oy, ex, ey, isFill = false) {
            const context = this.context
            const [ dx, dy ] = [ ex - ox, ey - oy ]
            context.beginPath()
            context.rect(ox, oy, dx, dy);
            (isFill) ? context.fill() : context.stroke()
            context.closePath()
        },
        drawText (ox, oy, fontSize, text, isFill = false) {
            this.context.font = fontSize.toString() + 'px Georgia';
            (isFill) ? this.context.fillText(text, ox, oy) : this.context.strokeText(text, ox, oy)
        },
        drawClear () {
            this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT)
        },
        setProperty (width, color, alpha) {
            const context = this.context
            context.strokeStyle = color
            context.fillStyle = color
            context.lineWidth = width
            context.globalAlpha = alpha
        },
        initPenProperty () {
            const context = this.context
            context.lineCap = 'round'
            if (this.type === 'pen' && this.canvas.color.a < 1) {
                context.lineCap = 'butt'
            }
            if (this.type !== 'text') {
                this.canvas.isInput = false
            }
        },
        commandpen (action, { x, y, buttons }) {
            this.initPenProperty()
            const canvas = this.canvas
            this.setProperty(canvas.width, canvas.color.hex, canvas.color.a)
            switch (action) {
                case 'mousedown':
                    this.canvas.penOriginPoint = [x, y]
                    break
                case 'mousemove':
                    if (buttons !== 1) {
                        return
                    }
                    const [ox, oy] = canvas.penOriginPoint
                    this.drawLine(ox, oy, x, y)
                    this.send(makeCanvasInfo({
                        type: this.type,
                        ox: ox / this.WIDTH,
                        oy: oy / this.HEIGHT,
                        ex: x / this.WIDTH,
                        ey: y / this.HEIGHT,
                        width: canvas.width / this.WIDTH,
                        color: canvas.color
                    }))
                    canvas.penOriginPoint = [x, y]
                    break
                case 'mouseup':
                    canvas.penOriginPoint = null
                    break
            }
        },

        commandline (action, { x, y, buttons }) {
            this.initPenProperty()
            const canvas = this.canvas
            this.setProperty(canvas.width, canvas.color.hex, canvas.color.a)
            switch (action) {
                case 'mousedown':
                    canvas.penOriginPoint = [x, y]
                    canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
                    break
                case 'mousemove':
                    if (canvas.penOriginPoint == null) {
                        return
                    }
                    this.context.putImageData(canvas.lastImageData, 0, 0)
                    const [ ox, oy ] = canvas.penOriginPoint
                    this.drawLine(ox, oy, x, y)
                    break
                case 'mouseup':
                    this.send(makeCanvasInfo({
                        type: this.type,
                        ox: canvas.penOriginPoint[0] / this.WIDTH,
                        oy: canvas.penOriginPoint[1] / this.HEIGHT,
                        ex: x / this.WIDTH,
                        ey: y / this.HEIGHT,
                        width: canvas.width / this.WIDTH,
                        color: canvas.color
                    }))
                    canvas.penOriginPoint = null
                    canvas.lastImageData = null
                    break
            }
        },

        commandcircle (action, { x, y, buttons }) {
            this.initPenProperty()
            const canvas = this.canvas
            this.setProperty(canvas.width, canvas.color.hex, canvas.color.a)
            switch (action) {
                case 'mousedown':
                    canvas.penOriginPoint = [x, y]
                    canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
                    break
                case 'mousemove':
                    if (canvas.penOriginPoint == null) {
                        return
                    }
                    this.context.putImageData(canvas.lastImageData, 0, 0)
                    const [ ox, oy ] = canvas.penOriginPoint
                    this.drawCircle(ox, oy, x, y, canvas.isFill)
                    break
                case 'mouseup':
                    this.send(makeCanvasInfo({
                        type: this.type,
                        ox: canvas.penOriginPoint[0] / this.WIDTH,
                        oy: canvas.penOriginPoint[1] / this.HEIGHT,
                        ex: x / this.WIDTH,
                        ey: y / this.HEIGHT,
                        width: canvas.width / this.WIDTH,
                        color: canvas.color,
                        isFill: canvas.isFill
                    }))
                    canvas.penOriginPoint = null
                    canvas.lastImageData = null
                    break
            }
        },

        commandrect (action, { x, y, buttons }) {
            this.initPenProperty()
            const canvas = this.canvas
            this.setProperty(canvas.width, canvas.color.hex, canvas.color.a)
            switch (action) {
                case 'mousedown':
                    canvas.penOriginPoint = [x, y]
                    canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
                    break
                case 'mousemove':
                    if (canvas.penOriginPoint == null) {
                        return
                    }
                    this.context.putImageData(canvas.lastImageData, 0, 0)
                    const [ ox, oy ] = canvas.penOriginPoint
                    this.drawRect(ox, oy, x, y, canvas.isFill)
                    break
                case 'mouseup':
                    this.send(makeCanvasInfo({
                        type: this.type,
                        ox: canvas.penOriginPoint[0] / this.WIDTH,
                        oy: canvas.penOriginPoint[1] / this.HEIGHT,
                        ex: x / this.WIDTH,
                        ey: y / this.HEIGHT,
                        width: canvas.width / this.WIDTH,
                        color: canvas.color,
                        isFill: canvas.isFill
                    }))
                    canvas.penOriginPoint = null
                    canvas.lastImageData = null
                    break
            }
        },

        commandrubber (action, { x, y, buttons }) {
            this.initPenProperty()
            const canvas = this.canvas
            switch (action) {
                case 'mousedown':
                    canvas.penOriginPoint = [x, y]
                    break
                case 'mousemove':
                    if (buttons !== 1) {
                        return
                    }
                    this.setProperty(Math.floor(canvas.width * 2), 'white', 1)
                    const [ox, oy] = canvas.penOriginPoint
                    this.drawLine(ox, oy, x, y)
                    this.send(makeCanvasInfo({
                        type: this.type,
                        ox: ox / this.WIDTH,
                        oy: oy / this.HEIGHT,
                        ex: x / this.WIDTH,
                        ey: y / this.HEIGHT,
                        width: canvas.width / this.WIDTH
                    }))
                    canvas.penOriginPoint = [x, y]
                    break
                case 'mouseup':
                    canvas.penOriginPoint = null
                    break
            }
        },

        commandtext (action, event) {
            this.initPenProperty()
            const canvas = this.canvas
            this.setProperty(canvas.width, canvas.color.hex, canvas.color.a)
            switch (action) {
                case 'mousedown':
                    if (this.canvas.isInput === true) {
                        this.putText()
                    } else {
                        this.canvas.text = ''
                        this.canvas.isInput = true
                        this.canvas.penOriginPoint = [event.x, event.y]
                    }
                    this.position.left = (event.x + this.$refs.board.offsetLeft).toString() + 'px'
                    this.position.top = (event.y + this.$refs.board.offsetTop - 12).toString() + 'px'
                    break
            }
        },

        putText () {
            const canvas = this.canvas
            if (canvas.isInput) {
                this.context.lineWidth = 1
                const [ox, oy] = canvas.penOriginPoint
                this.drawText(ox, oy, canvas.fontSize, canvas.text, canvas.isFill)
                this.send(makeCanvasInfo({
                    type: this.type,
                    ox: ox / this.WIDTH,
                    oy: oy / this.HEIGHT,
                    fontSize: canvas.fontSize / this.WIDTH,
                    color: canvas.color,
                    isFill: canvas.isFill,
                    text: canvas.text
                }))
                this.canvas.isInput = false
                // this.$refs.text.focus()
            }
        },

        clearBoard () {
            this.drawClear()
            this.send(makeCanvasInfo({
                type: 'clear'
            }))
        },

        draw (canvasInfo) {
            switch (canvasInfo.type) {
                case 'pen':
                    this.context.lineCap = (canvasInfo.color.a < 1) ? 'butt' : 'round'
                case 'line' :
                    this.setProperty(canvasInfo.width * this.WIDTH, canvasInfo.color.hex, canvasInfo.color.a)
                    this.drawLine(canvasInfo.start[0] * this.WIDTH, canvasInfo.start[1] * this.HEIGHT, canvasInfo.end[0] * this.WIDTH, canvasInfo.end[1] * this.HEIGHT)
                    break
                case 'circle':
                    this.setProperty(canvasInfo.width * this.WIDTH, canvasInfo.color.hex, canvasInfo.color.a)
                    this.drawCircle(canvasInfo.start[0] * this.WIDTH, canvasInfo.start[1] * this.HEIGHT, canvasInfo.end[0] * this.WIDTH, canvasInfo.end[1] * this.HEIGHT, canvasInfo.isFill)
                    break
                case 'rect':
                    this.setProperty(canvasInfo.width * this.WIDTH, canvasInfo.color.hex, canvasInfo.color.a)
                    this.drawRect(canvasInfo.start[0] * this.WIDTH, canvasInfo.start[1] * this.HEIGHT, canvasInfo.end[0] * this.WIDTH, canvasInfo.end[1] * this.HEIGHT, canvasInfo.isFill)
                    break
                case 'rubber':
                    this.setProperty(canvasInfo.width * 2 * this.WIDTH, 'white', 1)
                    this.drawLine(canvasInfo.start[0] * this.WIDTH, canvasInfo.start[1] * this.HEIGHT, canvasInfo.end[0] * this.WIDTH, canvasInfo.end[1] * this.HEIGHT)
                    break
                case 'text':
                    this.setProperty(1, canvasInfo.color.hex, canvasInfo.color.a)
                    this.drawText(canvasInfo.start[0] * this.WIDTH, canvasInfo.start[1] * this.HEIGHT, canvasInfo.fontSize * this.WIDTH, canvasInfo.text, canvasInfo.isFill)
                    break
                case 'clear':
                    this.drawClear()
            }
        }
    },
    mounted () {
        this.$refs.board.width = this.WIDTH
        this.$refs.board.height = this.HEIGHT
        if (true) {
            ['mousemove', 'mousedown', 'mouseup'].map((eventName) => {
                this.$refs.board.addEventListener(eventName, ({ offsetX: x, offsetY: y, buttons }) => {
                    this[`command${this.type}`](eventName, { x, y, buttons })
                })
            })
        }
        /* window.addEventListener('resize', () => {
            this.btnPosition.left = (this.$refs.canvas.offsetLeft + 5).toString() + 'px'
            this.btnPosition.top = (this.$refs.canvas.offsetTop + 5).toString() + 'px'
        }) */
        /* this.btnPosition.left = (this.$refs.canvas.offsetLeft + 5).toString() + 'px'
        this.btnPosition.top = (this.$refs.canvas.offsetTop + 5).toString() + 'px' */
        this.context = this.$refs.board.getContext('2d')
    }
}
</script>

<style scoped>
    #relative {
        width: 0;
        height: 0;
        float: left;
    }

    #tool-button {
        position: relative;
        top: 5px;
        left: 5px;
        z-index: 999;
        color: #5cadff;
        cursor: pointer;
    }

    #canvas{
        width: 100%;
        height: 100%;
    }

    #draw-board {

    }
    #board {
    }
    .buttons {
        display: inline-block;
    }

    #tool-button:hover {
        color: gray;
    }
    #tool-bar{
        padding-left: 50px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 5px;
	}
</style>
