const { createFilter } = require('@rollup/pluginutils')
const { chmod } = require('fs/promises')
const { join } = require('path')
const MagicString = require('magic-string')

module.exports = function shebang({
  include = ['**/*.js'],
  exclude,
  regexp = /^\s*#!.*\n*/,
  shebang = '#!/usr/bin/env node',
  separator = '\n\n',
  mode = 0o755,
  insert = true,
  preserve = true,
  executable = true
} = {}) {
  const scripts = new Set()
  const shebangs = new Map()
  const filter = createFilter(include, exclude)

  if (typeof shebang === 'function') shebang = shebang()
  mode &= ~process.umask()

  return {
    name: 'shebang-bin',

    transform(code, id) {
      if (!filter(id)) return

      const match = code.match(regexp)
      if (!match) return

      const [preserved] = match
      const { index } = match
      const magicString = new MagicString(code)
      magicString.remove(index, preserved.length)
      shebangs.set(id, preserved)

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ includeContent: true, hires: true })
      }
    },

    renderChunk(code, { isEntry, facadeModuleId, fileName }, { file, dir, sourcemap }) {
      if (!isEntry || !facadeModuleId || !filter(facadeModuleId)) return

      if (executable) {
        scripts.add(file || join(dir || process.cwd(), fileName))
      }

      if (preserve) {
        const preserved = shebangs.get(facadeModuleId)
        if (preserved) return prepend(preserved)
      }

      if (insert) return prepend(`${shebang}${separator}`)

      function prepend(prefix) {
        if (!sourcemap) {
          return `${prefix}${code}`
        }

        const magicString = new MagicString(code)
        magicString.prepend(`${prefix}${code}`)

        return {
          code: magicString.toString(),
          map: magicString.generateMap({ includeContent: true, hires: true })
        }
      }
    },

    async writeBundle() {
      await Promise.all(
        [...scripts].map(file => chmod(file, mode))
      )
    }
  }
}
