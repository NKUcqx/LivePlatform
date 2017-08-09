// type can be 'pen' line' 'rect' 'circle' 'text' 'clear' ''
const canvasInfo = {
    type: null,
    start: [0, 0],
    end: [0, 0],
    width: 0,
    fontSize: 0,
    text: '',
    color: '#FFFFFF',
    isFill: false
}

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
    isFill
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
    return canvasInfo
}