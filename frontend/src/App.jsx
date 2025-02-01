import { useEffect } from 'react'
import { Tldraw, useEditor, track, exportToBlob } from 'tldraw'
import 'tldraw/tldraw.css'
import './custom-ui.css'

const CustomUi = track(() => {
	const editor = useEditor()
	console.log(editor)

	const exportImage = async () => {
		const shapeIds = editor.getCurrentPageShapeIds()
		if (shapeIds.size === 0) return alert('No shapes on the canvas')
		const blob = await exportToBlob({
			editor,
			ids: [...shapeIds],
			format: 'png',
			opts: { background: true },
		})

		const imageUrl = window.URL.createObjectURL(blob)
		const imagePreview = document.getElementById('image-preview')
		imagePreview.innerHTML = `<img src="${imageUrl}" alt="Canvas Export" style="max-width: 100%; max-height: 100%;" />`
	}

	useEffect(() => {
		const handleKeyUp = (e) => {
			switch (e.key) {
				case 'Delete':
				case 'Backspace': {
					editor.deleteShapes(editor.getSelectedShapeIds())
					break
				}
				case 'v': {
					editor.setCurrentTool('select')
					break
				}
				case 'e': {
					editor.setCurrentTool('eraser')
					break
				}
				case 'x':
				case 'p':
				case 'b':
				case 'd': {
					editor.setCurrentTool('draw')
					break
				}
			}
		}

		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keyup', handleKeyUp)
		}
	})

	return (
		<div className="custom-layout">
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'select'}
					onClick={() => editor.setCurrentTool('select')}
				>
					Select
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'draw'}
					onClick={() => editor.setCurrentTool('draw')}
				>
					Pencil
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'eraser'}
					onClick={() => editor.setCurrentTool('eraser')}
				>
					Eraser
				</button>
				<button
					className="custom-button"
					onClick={exportImage}
				>
					Export canvas as image
				</button>
			</div>
		</div>
	)
})

function onMount(editor) {
    // Lock the camera
    editor.setCameraOptions({
      // Disable zooming completely
      minZoom: 1,
      maxZoom: 1,
      zoomSpeed: 0,
      
      // Disable panning
      panSpeed: 0,
      
      // Lock the camera
      isLocked: true,
      
    //   constraints: {
    //     // Prevent any automatic zooming
    //     maxZoom: 1,
    //     minZoom: 1,
        
    //     // Set initial zoom to exactly 1
    //     initialZoom: 1,
        
    //     // Prevent any movement
    //     behavior: 'none'
    //   }
    })

    // Reset camera to initial position
    editor.setCamera({ x: 0, y: 0, z: 1 })
  }
export default function App() {
	return (
		<div style={{ padding: '20px' }}>
			<div style={{
				height: '500px',
				width: '800px',
				border: '1px solid #ccc',
				borderRadius: '8px',
				overflow: 'hidden'
			}}>
				<Tldraw hideUi
					onMount={onMount}
					>
					<CustomUi />
				</Tldraw>
			</div>
			<div style={{
				marginTop: '20px',
				padding: '20px',
				border: '1px solid #ccc',
				borderRadius: '8px',
				minHeight: '200px',
				maxWidth: '800px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}} id="image-preview">
				<p>Generated image will appear here</p>
			</div>
		</div>
	)
}