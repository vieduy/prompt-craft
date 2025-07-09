import react from "@vitejs/plugin-react";
import "dotenv/config";
import path from "node:path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import injectHTML from "vite-plugin-html-inject";
import tsConfigPaths from "vite-tsconfig-paths";

type Extension = {
	name: string;
	version: string;
	config: Record<string, unknown>;
};

enum ExtensionName {
	FIREBASE_AUTH = "firebase-auth",
	STACK_AUTH = "stack-auth"
}

const listExtensions = (): Extension[] => {
	if (process.env.DATABUTTON_EXTENSIONS) {
		try {
			return JSON.parse(process.env.DATABUTTON_EXTENSIONS) as Extension[];
		} catch (err: unknown) {
			console.error("Error parsing DATABUTTON_EXTENSIONS", err);
			console.error(process.env.DATABUTTON_EXTENSIONS);
			return [];
		}
	}

	return [];
};

const extensions = listExtensions();

const getExtensionConfig = (name: string): string => {
	const extension = extensions.find((it) => it.name === name);

	if (!extension) {
		console.warn(`Extension ${name} not found`);
	}

	return JSON.stringify(extension?.config);
};

const buildVariables = () => {
	const appId = process.env.DATABUTTON_PROJECT_ID;

	// Determine if we're in production
	const isProduction = process.env.NODE_ENV === 'production';
	
	// API Configuration
	let apiUrl = "http://localhost:8000"; // Default for development
	let apiHost = "";
	let apiPrefixPath = "";
	
	if (isProduction) {
		// In production, use environment variable or assume API is on same domain
		if (process.env.VITE_API_URL) {
			apiUrl = process.env.VITE_API_URL;
			try {
				const url = new URL(process.env.VITE_API_URL);
				apiHost = url.host;
				apiPrefixPath = url.pathname || "/api";
			} catch (error) {
				console.warn("Failed to parse VITE_API_URL:", error);
			}
		} else {
			// Default: assume API is hosted on same domain as frontend
			apiHost = "platform.poc.vng.ai";
			apiPrefixPath = "/api";
			apiUrl = `https://${apiHost}${apiPrefixPath}`;
		}
	}
	
	// WebSocket URL configuration
	let wsApiUrl = "ws://localhost:8000"; // Default for development
	if (isProduction) {
		if (process.env.VITE_WS_API_URL) {
			wsApiUrl = process.env.VITE_WS_API_URL;
		} else {
			// Convert API URL to WebSocket URL
			wsApiUrl = apiUrl.replace(/^https?:\/\//, 'wss://');
		}
	}

	const defines: Record<string, string> = {
		__APP_ID__: JSON.stringify(appId),
		__API_PATH__: JSON.stringify(""),
		__API_HOST__: JSON.stringify(apiHost),
		__API_PREFIX_PATH__: JSON.stringify(apiPrefixPath),
		__API_URL__: JSON.stringify(apiUrl),
		__WS_API_URL__: JSON.stringify(wsApiUrl),
		__APP_BASE_PATH__: JSON.stringify("/"),
		__APP_TITLE__: JSON.stringify("Databutton"),
		__APP_FAVICON_LIGHT__: JSON.stringify("/favicon-light.svg"),
		__APP_FAVICON_DARK__: JSON.stringify("/favicon-dark.svg"),
		__APP_DEPLOY_USERNAME__: JSON.stringify(""),
		__APP_DEPLOY_APPNAME__: JSON.stringify(""),
		__APP_DEPLOY_CUSTOM_DOMAIN__: JSON.stringify(""),
		__STACK_AUTH_CONFIG__: JSON.stringify(getExtensionConfig(ExtensionName.STACK_AUTH)),
		__FIREBASE_CONFIG__: JSON.stringify(
			getExtensionConfig(ExtensionName.FIREBASE_AUTH),
		),
	};

	return defines;
};

// https://vite.dev/config/
export default defineConfig({
	define: buildVariables(),
	plugins: [react(), splitVendorChunkPlugin(), tsConfigPaths(), injectHTML()],
	server: {
		proxy: {
			"/routes": {
				target: process.env.VITE_API_URL || "http://127.0.0.1:8000",
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			resolve: {
				alias: {
					"@": path.resolve(__dirname, "./src"),
				},
			},
		},
	},
});
