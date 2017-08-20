/**
 * Module Utils
 *
 * @module Utils
 * @class CanvasInfo
 * @constructor
 */
const canvasInfo = {
    /**
     *type can be 'pen' line' 'rect' 'circle' 'text' 'clear' ''
     *@property type
     *@type string
     */
    type: null,
    /**
     *@property start
     *@type [Number,Number]
     */
    start: [0, 0],
    /**
     *@property end
     *@type [Number,Number]
     */
    end: [0, 0],
    /**
     *@property width
     *@type Number
     */
    width: 0,
    /**
     *@property fontSize
     *@type Number
     */
    fontSize: 0,
    /**
     *@property text
     *@type String
     */
    text: '',
    /**
     *@property color
     *@type String|rgb()
     */
    color: '#FFFFFF',
    /**
     *@property isFill
     *@type boolean
     */
    isFill: false,
    /**
     *@property canvas
     *@type object
     */
    canvas: null
}

/**
 *生成canvas（画板）的信息
 *@method makeCanvasInfo
 *@param {Object} 有type，ox,oy,ex,ey,width,fontSize,text,color,isFill,canvas等属性
 *@return {Object} 返回生成的canvasinfo信息
 */
export const makeCanvasInfo = ({
    type,
    ox,
    oy,
    ex,
    ey,
    width,
    fontSize,
    text,
    color,
    isFill,
    canvas
}) => {
    let canvasInfo = {
        color: {}
    }
    canvasInfo.type = type;
    (isFill) ? canvasInfo.isFill = isFill : '';
    (ox && oy) ? canvasInfo.start = [ox, oy] : '';
    (ex && ey) ? canvasInfo.end = [ex, ey] : '';
    (width) ? canvasInfo.width = width : '';
    (fontSize) ? canvasInfo.fontSize = fontSize : '';
    (text) ? canvasInfo.text = text : ''
    if (color) {
        canvasInfo.color.hex = color.hex
        canvasInfo.color.a = color.a
    }
    (canvas) ? canvasInfo.canvas = canvas : null
    return canvasInfo
}