import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'
import { existsSync } from 'fs'
import type { VitePluginConfig as UnoCSSConfig } from 'unocss/vite'
import jiti from 'jiti'
import defu from 'defu'

export default defineConfig(() => {
  const configFiles = [
    'user/unocss.config.ts',
    'theme/unocss.config.ts',
  ]

  let unocssConfig: UnoCSSConfig = {
    configDeps: []
  }

  configFiles.forEach((configFile) => {
    const path = resolve(configFile)
    console.log(path)
    if (existsSync(path)) {
      unocssConfig.configDeps!.push(path)

      let uConfig: UnoCSSConfig | { default: UnoCSSConfig } = jiti(__filename)(path) as UnoCSSConfig | { default: UnoCSSConfig }
      if ('default' in uConfig)
        uConfig = uConfig.default

      unocssConfig = defu(unocssConfig, uConfig)
    }
  })

  console.log(unocssConfig)

  return {
    plugins: [
      UnoCSS(unocssConfig)
    ]
  }
})
