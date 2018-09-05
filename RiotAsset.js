const riot = require('riot-compiler')
const { Asset } = require('parcel-bundler')

class RiotAsset extends Asset {
  constructor (name, pkg, options) {
    super(name, pkg, options)
    this.type = 'js'
  }

  async getRiotConfig () {
    if (this.package.riot) return this.package.riot

    const config = await this.getConfig([ '.riotrc', '.riotrc.js' ])

    return config || {}
  }

  async generate () {
    const riotConfig = await this.getRiotConfig()

    const compiled = riot.compile(
      this.contents,
      riotConfig,
      this.relativeName
    )

    let code = compiled
    code = `import riot from 'riot'\n${code}`

    const parts = [
      {
        type: 'js',
        value: code
      }
    ]

    return parts
  }
}

module.exports = RiotAsset
