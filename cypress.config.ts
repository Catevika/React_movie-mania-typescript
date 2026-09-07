import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';

export default defineConfig({
  projectId: '9cmqr5',
	e2e: {
		setupNodeEvents(on) {
			on('file:preprocessor', vitePreprocessor());
		},
		baseUrl: 'http://localhost:5173/',
		watchForFileChanges: false
	}
});

