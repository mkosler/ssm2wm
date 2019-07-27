const tileSize = 64
let width = 6
let height = 6
let mode = 'paint'
let selectedTileId = 0
let selectedLayer = 1
let selectedEditorTile = null
let levelId = ''
let levels = {}
let editorSvg = null
const mapWidth = 1280
const mapHeight = 720
const padding = 10

const createEditor = (width, height) => {
    document.querySelector('#editor').innerHTML = ''

    let draw = SVG('editor')
        .size(width * tileSize, height * tileSize)

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let layer1Rect = draw.rect(tileSize, tileSize)
                .fill({
                    color: '#f00',
                    opacity: 0
                })

            let layer2Rect = draw.rect(tileSize, tileSize)
                .fill({
                    color: '#f00',
                    opacity: 0
                })

            let layer3Rect = draw.rect(tileSize, tileSize)
                .fill({
                    color: '#f00',
                    opacity: 0
                })
                .stroke({
                    color: '#000',
                    opacity: 0.5,
                    width: 1
                })

            let g = draw.group()

            g.add(layer1Rect)
            g.add(layer2Rect)
            g.add(layer3Rect)

            g.move(x * tileSize, y * tileSize)
                .click(function () {
                    if (mode === 'paint') {
                        const str = selectedTileId.toString().padStart(3, '0')

                        if (selectedLayer === 1) {
                            layer1Rect.fill({
                                color: `kenney/PNG/mapTile_${str}.png`,
                                opacity: 1
                            })
                        } else if (selectedLayer === 2) {
                            layer2Rect.fill({
                                color: `kenney/PNG/mapTile_${str}.png`,
                                opacity: 1
                            })
                        } else {
                            layer3Rect.fill({
                                color: `kenney/PNG/mapTile_${str}.png`,
                                opacity: 1
                            })
                        }
                    } else {
                        selectedEditorTile = this

                        if (this.data('levelId')) {
                            levelId = this.data('levelId')
                        }

                        document.querySelector('.modal').classList.add('show-modal')
                    }
                })
        }
    }

    editorSvg = draw
}

document.querySelector('#width').addEventListener('input', (e) => {
    width = Number(e.srcElement.value)
})

document.querySelector('#height').addEventListener('input', (e) => {
    height = Number(e.srcElement.value)
})

document.querySelector('form').addEventListener('submit', () => false)

document.querySelector('#createButton').addEventListener('click', (e) => {
    e.preventDefault()

    createEditor(width, height)
})

document.querySelectorAll('input[type=radio][name=mode]').forEach((o) => {
    o.addEventListener('change', (e) => {
        mode = e.srcElement.value
    })
})

document.querySelectorAll('input[type=radio][name=layer]').forEach((o) => {
    o.addEventListener('change', (e) => {
        selectedLayer = Number(e.srcElement.value)
    })
})

document.querySelector('#levelId').addEventListener('change', (e) => {
    levelId = e.srcElement.value
})

document.querySelector('.close-button').addEventListener('click', (e) => {
    document.querySelector('.modal').classList.remove('show-modal')
})

document.querySelector('#assign').addEventListener('click', (e) => {
    if (selectedEditorTile) {
        selectedEditorTile.data('levelId', levelId)

        const gid = selectedEditorTile.attr('id')

        levels[gid] = { id: levelId }
    }

    levelId = ''

    document.querySelector('.modal').classList.remove('show-modal')
})

document.querySelector('#generate').addEventListener('click', (e) => {
    e.preventDefault()

    document.querySelector('#map').innerHTML = ''

    let draw = SVG('map').size(mapWidth, mapHeight)

    draw.rect(mapWidth, mapHeight)
        .fill('#b6ccf0')

    let mapRect = draw.rect(mapWidth - padding * 2, mapHeight - padding * 2)
        .fill('#fff')
        .stroke('#000')
        .radius(10)
        .move(padding, padding)

    const lx = mapRect.width() * 0.7 + mapRect.x()
    const lh = mapRect.height() - padding * 2

    let barrier = draw.line(lx, mapRect.y() + padding, lx, mapRect.y() + padding + lh)
        .stroke('#ccc')

    let levelText = draw.text(function (add) {
        let levelsArray = Object.values(levels)

        for (const [index, l] of levelsArray.entries()) {
            add.tspan(`${index + 1}: ${l.id}`).newLine()
        }
    }).font({
        family: 'sans-serif',
        size: 14
    }).move(barrier.x() + padding * 2, barrier.y() + padding)

    let importGroup = draw.group()

    importGroup.svg(editorSvg.svg())
        .move(mapRect.x() + padding, mapRect.y() + padding)

    importGroup.select('rect')
        .stroke({
            color: '#fff',
            opacity: 0
        })

    canvg('canvas', draw.svg())
})

createEditor(width, height)

let draw = SVG('tilesheet').size(1000, 500)
    .attr({ viewBox: '0 0 2000 1000' })

draw.image('kenney/Tilesheet/mapPack_tilesheet.png')

for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 12; y++) {
        draw.rect(tileSize, tileSize)
            .fill({ color: '#fff', opacity: 0 })
            .stroke({ color: '#333', opacity: 0, width: 1 })
            .data('tileId', ((y * 15) + x) + 1)
            .move(x * tileSize, y * tileSize)
            .mouseover(function () {
                this.stroke({
                    color: '#333',
                    opacity: 1,
                    width: 1
                })
            })
            .mouseout(function () {
                this.stroke({
                    color: '#333',
                    opacity: 0,
                    width: 1
                })
            })
            .click(function () {
                selectedTileId = this.data('tileId')
            })
    }
}