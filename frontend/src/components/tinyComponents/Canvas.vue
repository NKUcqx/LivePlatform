<template>
	<div id="canvas">
		<Radio-group v-model="type" type="button">
	        <Radio label="pen"></Radio>
	        <Radio label="line"></Radio>
	        <Radio label="circle"></Radio>
	        <Radio label="rect"></Radio>
	        <Radio label="rubber"></Radio>
	        <Radio label="text"></Radio>
	    </Radio-group>
	    <i-switch v-model="canvas.isFill">
	        <span slot="open">fill</span>
	        <span slot="close">stroke</span>
	    </i-switch>
	    <Button @click="clearBoard()">Clear</Button>
	    <Slider v-model="canvas.width" :max="14" :min="2" :step="1" :tip-format="widthSliderFomat"></Slider>
	    <Slider v-model="canvas.fontSize" :max="35" :min="15" :step="2" :tip-format="fontSliderFomat"></Slider>
	    <color-picker v-model="canvas.color"></color-picker>
	    <div>
			<canvas ref="board" :width="WIDTH" :height="HEIGHT" id="board"></canvas>
			<Input :on-keydown="testText()" ref="text" v-model="canvas.text" v-if="canvas.isInput" autofocus :style="position" type="textarea" autosize></Input>
		</div>
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
	data(){
		return {
			types: ['pen', 'line', 'circle', 'rect', 'rubber', 'text'],
			type: 'pen',
			context: null,
			canvas: {
				width: 3,
				fontSize: 20,
				color: defaultProps,
				penOriginPoint: null,
				lastImageData: null,
				isFill: true,
				isInput: false, 
				text: '',
			},
			WIDTH: 500,
			HEIGHT: 500,
			position: {
				position: 'absolute',
				left: '30px',
				top: '30px',
				zIndex: 999,
				width: '100px',
			},
		}
	},
	computed: {
		
	},
	methods: {
		widthSliderFomat(val) {
			return "width: "+val+"px"
		},
		fontSliderFomat(val) {
			return "font: "+val+"px"
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
    		console.log(action)
			switch (action) {
				case 'mousedown':
					if(this.canvas.isInput === true){
						this.context.lineWidth = 1
						this.context.font = '30px Georgia'
						const [ox, oy] = this.canvas.penOriginPoint;
						(this.canvas.isFill)? this.context.fillText(this.canvas.text, ox, oy) : this.context.strokeText(this.canvas.text, ox, oy)
						this.canvas.isInput = false
						//this.$refs.text.focus()
					}
					else {
						this.canvas.text = ''
						this.canvas.isInput = true
						this.canvas.penOriginPoint = [event.x, event.y]
					}
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
			/*this.$refs.text.addEventListener('keydown', (event) => {
				this[`commandtext`](eventName, event)
			})*/
			this.canvas.isInput = true
			console.log(this.$refs.text)
			this.canvas.isInput = false
		}
		this.context = this.$refs.board.getContext('2d')
	}
}
</script>

<style scoped>
	#canvas {
		border: 1px solid red;
	}
	#board {
		border: 1px solid blue;
	}
</style>
