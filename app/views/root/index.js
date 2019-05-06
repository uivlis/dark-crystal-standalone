const nest = require('depnest')
const { h } = require('mutant')
const { join } = require('path')

exports.gives = nest('views.root.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'app.actions.shards.fetch': 'first',
  'router.sync.goTo': 'first'
})

exports.create = (api) => {
  return nest('views.root.index', rootIndex)

  function rootIndex () {
    setTimeout(() => api.router.sync.goTo('/secrets'), 2000)

    api.app.actions.secrets.fetch()
    api.app.actions.shards.fetch()

    return h('Root -index', [
      h('img', {
        src: join(__dirname, '..', '..', '..', 'lib', 'electron', 'assets', 'icon-fade_660x660.png'),
        'ev-click': () => api.router.sync.goTo('/secrets')
      }),
      h('div.spinner', [
        h('i.fa.fa-spinner.fa-pulse.fa-2x')
      ])
    ])
  }
}