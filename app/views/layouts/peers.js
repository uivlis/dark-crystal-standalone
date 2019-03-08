const nest = require('depnest')
const { h } = require('mutant')

const NavBar = require('../../components/NavBar')

exports.gives = nest('app.views.layouts.peers')
exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first'
})

exports.create = (api) => {
  console.log("LOADS")
  return nest('app.views.layouts.peers', layoutPeersIndex)

  function layoutPeersIndex (request, children = []) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        request
      }),
      ...children
    ])
  }
}