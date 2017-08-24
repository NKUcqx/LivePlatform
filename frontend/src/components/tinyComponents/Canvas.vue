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
				<Button :size="SIZE" :type="checkType('pen')" shape="circle" icon="edit" @click="changeType('pen')" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose line" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('line')" shape="circle" icon="minus-round" @click="changeType('line')"  class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose rect" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('rect')" shape="circle" icon="android-checkbox-outline-blank" @click="changeType('rect')" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose circle" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('circle')" shape="circle" icon="android-radio-button-off" @click="changeType('circle')" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose rubber" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('rubber')" shape="circle" icon="android-checkbox-blank" @click="changeType('rubber')" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="choose text" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkType('text')" shape="circle" icon="compose" @click="changeType('text')" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFill" placement="top"   class="buttons">
				<Button :size="SIZE" :type="checkFill()" shape="circle" icon="android-star-half" @click="changeFill()" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<br>
			<Poptip trigger="hover" content="color picker" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="android-color-palette" @click="colorPicker()"  class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" content="clear" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="refresh" @click="clearBoard()"  class="buttons" :Disabled="!AUTHORITY"></Button>
		    </Poptip>
		    <Poptip trigger="hover" :content="getWidth" placement="bottom"   class="buttons">
		    	<Button :size="SIZE" type="default" shape="circle" icon="plus" @click="addWidth()" class="buttons" :Disabled="!AUTHORITY"></Button>
		    </Poptip>
		    <Poptip trigger="hover" :content="getWidth" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="minus" @click="minusWidth()" class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFontSize" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="plus-circled" @click="addFontSize()"  class="buttons" :Disabled="!AUTHORITY"></Button>
			</Poptip>
			<Poptip trigger="hover" :content="getFontSize" placement="bottom"   class="buttons">
				<Button :size="SIZE" type="default" shape="circle" icon="minus-circled" @click="minusFontSize()" class="buttons" :Disabled="!AUTHORITY"></Button>
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
/**
 *Module TinyComponents
 *
 *@module TinyComponents
 *@requires Utils
 */
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

/**
 *画板
 *@class Canvas
 *@constructor
 */
export default {
    components: {
        'color-picker': Sketch
    },
    props: {
        WIDTH: {
            type: Number,
            default: 400
        },
        HEIGHT: {
            type: Number,
            default: 260
        },
        SIZE: {
            type: Number,
            default: ''
        },
        AUTHORITY: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        'WIDTH': function (newVal, oldVal) {
            console.log(newVal)
            let data = this.getHistory()
            this.$refs.board.width = this.WIDTH
            this.$refs.board.height = this.HEIGHT
            this.draw(data)
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
        /**
         *获得此时画布的宽度
         *@method getWidth
         *@return {String} 'width: ' + 画布的宽度
         */
        getWidth () {
            return 'width: ' + this.canvas.width.toString()
        },
        /**
         *获得此时字体的大小
         *@method getFontSize
         *@return {String} 'fontSize: ' + 字体的大小
         */
        getFontSize () {
            return 'fontSize: ' + this.canvas.fontSize.toString()
        },
        /**
         *获得此时是否要把图形的中心填满的参数
         *@method getFill
         *@return {String} 如果现在isFill的值为true，就返回'fill',否则返回'stroke'
         */
        getFill () {
            return (this.canvas.isFill) ? 'fill' : 'stroke'
        }
    },
    methods: {
        /**
         *获得过去的操作生成的现在的图像
         *@method getHistory
         *@return {Object} 返回一个canvasInfo对象，更新属性type和canvas
         */
        getHistory () {
            return makeCanvasInfo({
                type: 'history',
                canvas: this.$refs.board.toDataURL('image/png')
            })
        },
        /**
         *发送清空画板的消息，发送的消息为一个canvasInfo对象，属性type为'clear'
         *@event reloadClear
         */
        reloadClear () {
            this.send(makeCanvasInfo({
                type: 'clear'
            }))
        },
        /**
         *显示工具栏
         *@event showToolBar
         */
        showToolBar () {
            this.toolBar = true
        },
        /**
         *隐藏工具栏
         *@event hideToolBar
         */
        hideToolBar () {
            this.toolBar = false
        },
        /**
         *返回值对应的宽度的像素值
         *@method widthSliderFomat
         *@param val
         *@return {Object} 'width: ' + val + 'px'
         */
        widthSliderFomat (val) {
            return 'width: ' + val + 'px'
        },
        /**
         *返回值对应的字体大小的像素值
         *@method fontSliderFomat
         *@param val
         *@return {Object} 'font: ' + val + 'px'
         */
        fontSliderFomat (val) {
            return 'font: ' + val + 'px'
        },
        /**
         *显示颜色选择器
         *@event colorPicker
         */
        colorPicker () {
            this.showColorPicker = true
        },
        /**
         *检查现在的type和实际的type是否符合
         *@method checkType
         *@param type
         *@return {String} 返回代表相符合和不符合的两个字符串
         */
        checkType (type) {
            return (this.type === type) ? 'primary' : 'ghost'
        },
        /**
         *改变现在记录的type值
         *@event changeType
         *@param type
         */
        changeType (type) {
            this.type = type
        },
        /**
         *检查现在的isFill是否为真，及画的图形是否填充
         *@method checkFill
         *@return {String} 返回代表填充和不填充的两个字符串
         */
        checkFill () {
            return (this.canvas.isFill) ? 'primary' : 'ghost'
        },
        /**
         *修改现在的isFill值，如果现在为true，则赋值false;如果现在是false,那么赋值true
         *@event changeFill
         */
        changeFill () {
            this.canvas.isFill = !(this.canvas.isFill)
        },
        /**
         *笔触增大
         *@event addWidth
         */
        addWidth () {
            (this.canvas.width < 24) ? (this.canvas.width++) : ''
        },
        /**
         *笔触减小
         *@event minusWidth
         */
        minusWidth () {
            (this.canvas.width > 1) ? (this.canvas.width--) : ''
        },
        /**
         *字体增大
         *@event addFontSize
         */
        addFontSize () {
            (this.canvas.fontSize < 35) ? (this.canvas.fontSize++) : ''
        },
        /**
         *字体减小
         *@event minusFontSize
         */
        minusFontSize () {
            (this.canvas.fontSize > 15) ? (this.canvas.fontSize--) : ''
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
         *接收信息,依据收到的消息对画板进行操作
         *@event receive
         *@param {Object} data
         */
        receive (data) {
            this.draw(data.data)
        },
        /**
         *如果'\n'的位置大于等于0，那么就调用函数putText
         *@event testText
         */
        testText () {
            if (this.canvas.text.indexOf('\n') >= 0) {
                try {
                    this.putText()
                } catch (e) {
                    console.log(e)
                }
            }
        },
        /**
         *画直线
         *@event drawLine
         *@param {Number} ox，开始的x轴坐标
         *@param {Number} oy，开始的y轴坐标
         *@param {Number} ex，结束的x轴坐标
         *@param {Number} ey，结束的y轴坐标
         */
        drawLine (ox, oy, ex, ey) {
            const context = this.context
            context.beginPath()
            context.moveTo(ox, oy)
            context.lineTo(ex, ey)
            context.stroke()
            context.closePath()
        },
        /**
         *画圆
         *@event drawCircle
         *@param {Number} ox，开始的x轴坐标
         *@param {Number} oy，开始的y轴坐标
         *@param {Number} ex，结束的x轴坐标
         *@param {Number} ey，结束的y轴坐标
         *@param {Boolean} isFill,是否填充
         */
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
        /**
         *画矩形
         *@event drawRect
         *@param {Number} ox，开始的x轴坐标
         *@param {Number} oy，开始的y轴坐标
         *@param {Number} ex，结束的x轴坐标
         *@param {Number} ey，结束的y轴坐标
         *@param {Boolean} isFill,是否填充
         */
        drawRect (ox, oy, ex, ey, isFill = false) {
            const context = this.context
            const [ dx, dy ] = [ ex - ox, ey - oy ]
            context.beginPath()
            context.rect(ox, oy, dx, dy);
            (isFill) ? context.fill() : context.stroke()
            context.closePath()
        },
        /**
         *在画板上显示输入的text
         *@event drawText
         *@param {Number} ox，开始的x轴坐标
         *@param {Number} oy，开始的y轴坐标
         *@param {Number} fontSize，字体大小
         *@param {String} text，输入的text
         *@param {Boolean} isFill,是否填充
         */
        drawText (ox, oy, fontSize, text, isFill = false) {
            this.context.font = fontSize.toString() + 'px Georgia';
            (isFill) ? this.context.fillText(text, ox, oy) : this.context.strokeText(text, ox, oy)
        },
        /**
         *操作清空画板
         *@event drawClear
         */
        drawClear () {
            this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT)
        },
        /**
         *设置属性
         *@event setProperty
         *@param {Number} width
         *@param {String} color
         *@param {Number} alpha
         */
        setProperty (width, color, alpha) {
            const context = this.context
            context.strokeStyle = color
            context.fillStyle = color
            context.lineWidth = width
            context.globalAlpha = alpha
        },
        /**
         *初始化画笔的属性
         *@event initPenProperty
         */
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
        /**
         *实施画笔的操作
         *@event commandpen
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} { x, y, buttons }
         */
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
        /**
         *实施画直线的操作
         *@event commandline
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} { x, y, buttons }
         */
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
        /**
         *实施画圆的操作
         *@event commandcircle
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} { x, y, buttons }
         */
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
        /**
         *实施画矩形的操作
         *@event commandrect
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} { x, y, buttons }
         */
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
        /**
         *实施橡皮擦的操作
         *@event commandrubber
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} { x, y, buttons }
         */
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
        /**
         *实施文本框的操作
         *@event commandtext
         *@param {String} action，操作的名称，'mousemove', 'mousedown', 'mouseup'
         *@param {Object} event
         */
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
        /**
         *调用drawText函数，并且发送makeCanvasInfo消息
         *@event putText
         */
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

        /**
         *调用drawClear函数，并且发送makeCanvasInfo消息（type为'clear'）
         *@event clearBoard
         */
        clearBoard () {
            this.drawClear()
            this.send(makeCanvasInfo({
                type: 'clear'
            }))
        },

        /**
         *画图，处理'pen','line','circle','rect'等信息
         *@event draw
         *@param {Object} canvasInfo，画板的相关信息
         */
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
                case 'history':
                    console.log(canvasInfo)
                    let that = this
                    var image = new Image()
                    image.onload = function () {
                        that.context.drawImage(image, 0, 0, that.WIDTH, that.HEIGHT) // Or at whatever offset you like
                    }
                    image.src = canvasInfo.canvas
                    break
                case 'clear':
                    this.drawClear()
            }
        }
    },
    mounted () {
        this.$refs.board.width = this.WIDTH
        this.$refs.board.height = this.HEIGHT
        if (this.AUTHORITY) {
            ['mousemove', 'mousedown', 'mouseup'].map((eventName) => {
                this.$refs.board.addEventListener(eventName, ({ offsetX: x, offsetY: y, buttons }) => {
                    this[`command${this.type}`](eventName, { x, y, buttons })
                })
            })
        }
        this.context = this.$refs.board.getContext('2d')
    }
}
</script>

<style scoped>
    #canvas #relative {
        width: 0;
        height: 0;
        float: left;
    }

    #canvas #tool-button {
        position: relative;
        top: 5px;
        left: 5px;
        z-index: 400;
        color: #5cadff;
        cursor: pointer;
    }

    #canvas{
        width: 100%;
        height: 100%;
    }

    #canvas #draw-board {

    }
    #canvas #board {
        cursor: url(/static/img/dot.ico),auto;
    }
    #canvas .buttons {
        display: inline-block;
    }

    #canvas #tool-button:hover {
        color: gray;
    }
    #canvas #tool-bar{
        padding-left: 50px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 5px;
	}
</style>
