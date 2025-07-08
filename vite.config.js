// liff/vite.config.js
export default {
    root: './',
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: `http://localhost:3000`,
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist'
    } 
};