import Vue from '@vitejs/plugin-vue'
import Icons from 'vite-plugin-icons'
import path from 'path'

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [
    Vue(),
    Icons()
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  }
}
