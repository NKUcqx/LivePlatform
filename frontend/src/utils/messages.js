// type can be 'pen' line' 'rect' 'circle' 'text' 'clear' ''
const canvasInfo = {
    type: null,
    start: [0, 0],
    end: [0, 0],
    width: 0,
    fontsize: 0,
    text: '',
    color: '#FFFFFF',
    isFill: false
}

export const makeCanvasInfo = ({
    type,
    ox = 0,
    oy = 0,
    ex = 0,
    ey = 0,
    width = 0,
    fontsize = 0,
    text = '',
    color = '#FFFFFF',
    isFill = false
}) => {
    canvasInfo.type = type
    canvasInfo.start = [ox, oy]
    canvasInfo.end = [ex, ey]
    canvasInfo.width = width
    canvasInfo.fontsize = width
    canvasInfo.text = text
    canvasInfo.color = color
    canvasInfo.isFill = isFill
    console.log(canvasInfo)
    return canvasInfo
}