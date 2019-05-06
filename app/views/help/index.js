const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('views.help.index')

exports.needs = nest({
  'message.async.publish': 'first',
  'sbot.obs.connection': 'first',
  'router.sync.goTo': 'first'
})

exports.create = (api) => {
  return nest('views.help.index', helpIndex)

  function helpIndex (request) {
    return h('Help -index', [
      'HELP'
    ])
  }
}
