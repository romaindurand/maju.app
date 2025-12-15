// Browser fingerprinting utilities for voter identification
// Combines multiple browser characteristics to create a unique identifier

export async function generateBrowserFingerprint(): Promise<string> {
	const components: string[] = [];

	// Screen information
	components.push(`screen:${screen.width}x${screen.height}x${screen.colorDepth}`);

	// Timezone
	components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

	// Language
	components.push(`lang:${navigator.language}`);

	// Platform
	components.push(`platform:${navigator.platform}`);

	// Hardware concurrency (CPU cores)
	components.push(`cores:${navigator.hardwareConcurrency || 'unknown'}`);

	// Device memory (if available)
	if ('deviceMemory' in navigator) {
		components.push(`mem:${(navigator as any).deviceMemory}`);
	}

	// Canvas fingerprint
	const canvasFingerprint = await getCanvasFingerprint();
	components.push(`canvas:${canvasFingerprint}`);

	// WebGL fingerprint
	const webglFingerprint = getWebGLFingerprint();
	components.push(`webgl:${webglFingerprint}`);

	// Fonts detection (basic)
	const fonts = detectFonts();
	components.push(`fonts:${fonts}`);

	// Combine all components
	const fingerprintString = components.join('|');

	// Hash the fingerprint for privacy
	return await hashString(fingerprintString);
}

async function getCanvasFingerprint(): Promise<string> {
	try {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return 'no-canvas';

		canvas.width = 200;
		canvas.height = 50;

		// Draw text with specific styling
		ctx.textBaseline = 'top';
		ctx.font = '14px "Arial"';
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#f60';
		ctx.fillRect(125, 1, 62, 20);
		ctx.fillStyle = '#069';
		ctx.fillText('Maju Fingerprint 🗳️', 2, 15);
		ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
		ctx.fillText('Maju Fingerprint 🗳️', 4, 17);

		// Get canvas data
		const dataUrl = canvas.toDataURL();
		return await hashString(dataUrl);
	} catch {
		return 'canvas-error';
	}
}

function getWebGLFingerprint(): string {
	try {
		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		if (!gl) return 'no-webgl';

		const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
		if (!debugInfo) return 'no-debug-info';

		const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
		const renderer = (gl as WebGLRenderingContext).getParameter(
			debugInfo.UNMASKED_RENDERER_WEBGL
		);

		return `${vendor}~${renderer}`;
	} catch {
		return 'webgl-error';
	}
}

function detectFonts(): string {
	// Simple font detection using common fonts
	const baseFonts = ['monospace', 'sans-serif', 'serif'];
	const testFonts = [
		'Arial',
		'Verdana',
		'Times New Roman',
		'Courier New',
		'Georgia',
		'Palatino',
		'Garamond',
		'Comic Sans MS',
		'Trebuchet MS',
		'Impact'
	];

	const detected: string[] = [];
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return 'no-canvas';

	for (const font of testFonts) {
		let detected_font = false;
		for (const baseFont of baseFonts) {
			ctx.font = `72px ${baseFont}`;
			const baseWidth = ctx.measureText('mmmmmmmmmmlli').width;

			ctx.font = `72px "${font}", ${baseFont}`;
			const testWidth = ctx.measureText('mmmmmmmmmmlli').width;

			if (baseWidth !== testWidth) {
				detected_font = true;
				break;
			}
		}
		if (detected_font) {
			detected.push(font);
		}
	}

	return detected.join(',');
}

async function hashString(str: string): Promise<string> {
	// Use SubtleCrypto API for hashing
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}
