<template>
	<div id="canvas" style="width:600px;height:30px;margin:50px" ref="canvas">
		<div :style="btnPosition" id="show-tool" ref="showTool"  @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
			<Button type="ghost" shape="circle" icon="wrench"></Button>
		</div>
		<Row >
		<div ref="toolbar" id="tool-bar" :style="toolBarPosition" v-if="this.toolBar" @mouseenter="showToolBar()" @mouseleave="hideToolBar()">
			<Poptip content="choose pen" placement="top"   class="buttons">
				<Button :type="checkType('pen')" shape="circle" icon="edit" @click="changeType('pen')"></Button>
			</Poptip>
			<Poptip content="choose line" placement="top"   class="buttons">
				<Button :type="checkType('line')" shape="circle" icon="minus-round" @click="changeType('line')" ></Button>
			</Poptip>
			<Poptip content="choose rect" placement="top"   class="buttons">
				<Button :type="checkType('rect')" shape="circle" icon="android-checkbox-outline-blank" @click="changeType('rect')"></Button>
			</Poptip>
			<Poptip content="choose circle" placement="top"   class="buttons">
				<Button :type="checkType('circle')" shape="circle" icon="android-radio-button-off" @click="changeType('circle')" ></Button>
			</Poptip>
			<Poptip content="choose rubber" placement="top"   class="buttons">
				<Button :type="checkType('rubber')" shape="circle" icon="android-checkbox-blank" @click="changeType('rubber')" ></Button>
			</Poptip>
			<Poptip content="choose text" placement="top"   class="buttons">
				<Button :type="checkType('text')" shape="circle" icon="compose" @click="changeType('text')"></Button>
			</Poptip>
			<Poptip :content="getFill" placement="top"   class="buttons">
				<Button :type="checkFill()" shape="circle" icon="android-star-half" @click="changeFill()"></Button>
			</Poptip>
			<br>
			<Poptip content="color picker" placement="bottom"   class="buttons">
				<Button type="default" shape="circle" icon="android-color-palette" @click="colorPicker()"  class="buttons"></Button>
			</Poptip>
			<Poptip content="clear" placement="bottom"   class="buttons">
				<Button type="default" shape="circle" icon="refresh" @click="clearBoard()"  class="buttons"></Button>
		    </Poptip>
		    <Poptip :content="getWidth" placement="bottom"   class="buttons">
		    	<Button type="default" shape="circle" icon="plus" @click="addWidth()"></Button>
		    </Poptip>
		    <Poptip :content="getWidth" placement="bottom"   class="buttons">
				<Button type="default" shape="circle" icon="minus" @click="minusWidth()"></Button>
			</Poptip>
			<Poptip :content="getFontSize" placement="bottom"   class="buttons">
				<Button type="default" shape="circle" icon="plus-round" @click="addFontSize()"></Button>
			</Poptip>
			<Poptip :content="getFontSize" placement="bottom"   class="buttons">
				<Button type="default" shape="circle" icon="minus-round" @click="minusFontSize()"></Button>
			</Poptip>
		</div>
		<Modal v-model="showColorPicker" :width="250" :closable="false" :ok-text="1" :cancel-text="2" id="modal">
	        <div style="text-align:center">
	            <color-picker v-model="canvas.color"></color-picker>
	        </div>
	        <div slot="footer"></div>
	    </Modal>
	    <Col span="24" id="draw-board">
			<canvas ref="board" id="board" :width="WIDTH" :height="HEIGHT"></canvas>
			<Input :on-keydown="testText()" ref="text" v-model="canvas.text" v-if="canvas.isInput" autofocus :style="position" type="textarea" autosize></Input>
		</Col>
		</Row>
	</div>
</template>

<script>

import { Sketch } from 'vue-color'

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
    		default : 600,
    	},
    	HEIGHT: {
    		type: Number,
    		default : 400,
    	}
    },
	data(){
		return {
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
				text: '',
			},
			position: {
				position: 'absolute',
				left: '30px',
				top: '30px',
				zIndex: 999,
				width: '100px',
			},
			btnPosition: {
				position: 'absolute',
				left: '30px',
				top: '30px',
				zIndex: 999,
			},
			toolBarPosition: {
				position: 'absolute',
				left: '0px',
				top: '0px',
				zIndex: 999,
			}
		}
	},
	computed: {
		getWidth(){
			return "width: "+this.canvas.width.toString()
		},
		getFontSize(){
			return "fontSize: "+this.canvas.fontSize.toString()
		},
		getFill(){
			return (this.canvas.isFill)? 'fill' : 'stroke'
		}
	},
	methods: {
		showToolBar() {
			this.toolBar = true
		},
		hideToolBar() {
			this.toolBar = false
		},
		widthSliderFomat(val) {
			return "width: "+val+"px"
		},
		fontSliderFomat(val) {
			return "font: "+val+"px"
		},
		colorPicker() {
			this.showColorPicker = true
		},
		checkType(type){
			return (this.type === type)? 'primary' : 'ghost'
		},
		changeType(type){
			this.type = type
		},
		checkFill(){
			return (this.canvas.isFill)? 'primary' : 'ghost'
		},
		changeFill(){
			this.canvas.isFill = (this.canvas.isFill)? false : true
		},
		addWidth(){
			(this.canvas.width < 24)? this.canvas.width ++ : ''
		},
		minusWidth(){
			(this.canvas.width > 1)? this.canvas.width -- : ''
		},
		addFontSize(){
			(this.canvas.fontSize < 35)? this.canvas.fontSize ++ : ''
		},
		minusFontSize(){
			(this.canvas.fontSize > 15)? this.canvas.fontSize -- : ''
		},
		testText() {
			if(this.canvas.text.indexOf("\n") >= 0){
				try{
					this.drawText()
				}
				catch(e){
					console.log(e)
				}
			}
		},
		setPenProperty(){
			const context = this.context
			context.strokeStyle = this.canvas.color.hex
			context.fillStyle = this.canvas.color.hex
			context.lineWidth = this.canvas.width
			context.globalAlpha = this.canvas.color.a
			context.lineCap='round'
			if(this.type ==='pen' && this.canvas.color.a < 1){
				context.lineCap = 'butt'
			}
			if(this.type !== 'text'){
				this.canvas.isInput = false
			}
		},
		commandpen(action, { x, y, buttons }) {
			this.setPenProperty()
			switch (action) {
				case 'mousedown':
					this.canvas.penOriginPoint = [x, y]
					break
				case 'mousemove':
					if (buttons !== 1) {
						return
					}
					const context = this.context
					context.beginPath()
					const [ox, oy] = this.canvas.penOriginPoint
					context.moveTo(ox, oy)
					context.lineTo(x, y)
					context.stroke()
					context.closePath()
					this.canvas.penOriginPoint = [x, y]
					break
				case 'mouseup':
					this.canvas.penOriginPoint = null
					break
			}
    	},

		commandline(action, { x, y, buttons }) {
			this.setPenProperty()
			switch (action) {
				case 'mousedown':
					this.canvas.penOriginPoint = [x, y]
					this.canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
					break
				case 'mousemove':
					if (this.canvas.penOriginPoint == null) {
						return
					}			
					const context = this.context
					context.putImageData(this.canvas.lastImageData, 0, 0)
					const [ ox, oy ] = this.canvas.penOriginPoint
					context.beginPath()
					context.moveTo(ox, oy)
					context.lineTo(x, y)
					context.stroke()
					context.closePath()
					break
				case 'mouseup':
					this.canvas.penOriginPoint = null
					this.canvas.lastImageData = null
					break
			}
		},

		commandcircle(action, { x, y, buttons }) {
			this.setPenProperty()
			switch (action) {
				case 'mousedown':
					this.canvas.penOriginPoint = [x, y]
					this.canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
					break
				case 'mousemove':
					if (this.canvas.penOriginPoint == null) {
						return
					}
					const context = this.context
					context.putImageData(this.canvas.lastImageData, 0, 0)
					const [ ox, oy ] = this.canvas.penOriginPoint
					const [ dx, dy ] = [ x - ox, y - oy ]
					const [ cx, cy ] = [ (x + ox)/2, (y + oy)/2 ]
					const radius = (Math.sqrt(dx * dx + dy * dy))/2
					context.beginPath()
					context.arc(cx, cy, radius, 0, 2 * Math.PI, true);
					(this.canvas.isFill)? context.fill() : context.stroke()
					context.closePath()

					break
				case 'mouseup':
					this.canvas.penOriginPoint = null
					this.canvas.lastImageData = null
					break
			}
		},

		commandrect(action, { x, y, buttons }) {
			this.setPenProperty()
			switch (action) {
				case 'mousedown':
					this.canvas.penOriginPoint = [x, y]
					this.canvas.lastImageData = this.context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
					break
				case 'mousemove':
					if (this.canvas.penOriginPoint == null) {
						return
					}
					const context = this.context
					context.putImageData(this.canvas.lastImageData, 0, 0)
					const [ ox, oy ] = this.canvas.penOriginPoint
					const [ dx, dy ] = [ x - ox, y - oy ]
					context.beginPath()				
					context.rect(ox, oy, dx, dy);
					(this.canvas.isFill)? context.fill() : context.stroke()
					context.closePath()
					break
				case 'mouseup':
					this.canvas.penOriginPoint = null
					this.canvas.lastImageData = null
					break
			}
		},

		commandrubber(action, { x, y, buttons }) {
			this.setPenProperty()
			switch (action) {
				case 'mousedown':
					this.canvas.penOriginPoint = [x, y]
					break
				case 'mousemove':
					if (buttons !== 1) {
						return
					}
					const context = this.context
					context.strokeStyle = "white"
					context.globalAlpha = 1
					context.lineWidth = this.canvas.width + 7
					context.beginPath()
					const [ox, oy] = this.canvas.penOriginPoint
					context.moveTo(ox, oy)
					context.lineTo(x, y)
					context.stroke()
					context.closePath()
					this.canvas.penOriginPoint = [x, y]
					break
				case 'mouseup':
					this.canvas.penOriginPoint = null
					break
			}
    	},

    	commandtext(action, event) {
    		this.setPenProperty()
			switch (action) {
				case 'mousedown':
					if(this.canvas.isInput === true){
						this.drawText()
					}
					else {
						this.canvas.text = ''
						this.canvas.isInput = true
						this.canvas.penOriginPoint = [event.x, event.y]
					}
					console.log(this.$refs.board.offsetLeft)
					this.position.left = (event.x + this.$refs.board.offsetLeft).toString() + 'px'
					this.position.top = (event.y + this.$refs.board.offsetTop - 12).toString() + 'px'
					break
			}
    	},

    	drawText(){
    		if(this.canvas.isInput){
				this.context.lineWidth = 1
				this.context.font = this.canvas.fontSize.toString()+'px Georgia'
				const [ox, oy] = this.canvas.penOriginPoint;
				(this.canvas.isFill)? this.context.fillText(this.canvas.text, ox, oy) : this.context.strokeText(this.canvas.text, ox, oy)
				this.canvas.isInput = false
				//this.$refs.text.focus()
			}
    	},

    	clearBoard() {
    		this.context.clearRect(0,0,this.WIDTH,this.HEIGHT)
    	}

	},
	mounted(){
		if (true) {
			['mousemove', 'mousedown', 'mouseup'].map((eventName) => {
				this.$refs.board.addEventListener(eventName, ({ offsetX: x, offsetY: y, buttons }) => {
					this[`command${this.type}`](eventName, { x, y, buttons })
				})
			});
			/*this.$refs.showTool.addEventListener('mouseover', (event) => {
				this.showToolBar()
			});
			this.$refs.showTool.addEventListener('mouseleave', (event) => {
				this.hideToolBar()
			});*/
		}

		this.btnPosition.left = (this.$refs.canvas.offsetLeft + 5).toString() + 'px'
		this.btnPosition.top = (this.$refs.canvas.offsetTop + 5).toString() + 'px'
		this.context = this.$refs.board.getContext('2d')
	}
}
</script>

<style scoped>
	#canvas {

	}

	#draw-board {

	}
	#board {
		-moz-box-shadow:4px 4px 20px #A1A1A1;
		-webkit-box-shadow:4px 4px 20px #A1A1A1; 
		box-shadow:4px 4px 20px #A1A1A1;
	}
	.buttons {
		display: inline-block;
	}
	#show-tool:hover {
		color: blue;

	}
	#tool-bar{
		padding-left: 50px;
		padding-top: 5px;
		padding-bottom: 5px;
		padding-right: 5px;
	}
</style>
