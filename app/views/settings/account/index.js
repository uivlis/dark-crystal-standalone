const nest = require('depnest')
const { clipboard } = require('electron')
const { h, computed } = require('mutant')

exports.gives = nest('app.views.settings.account.index')

exports.needs = nest({
  'keys.sync.id': 'first',
  'about.html.avatar': 'first',
  'about.obs.name': 'first',
  'message.async.publish': 'first',
  'about.obs.imageUrl': 'first',
  'sbot.async.addBlob': 'first',
  'sbot.obs.localPeers': 'first'
})

exports.create = (api) => {
  return nest('app.views.settings.account.index', settingsAccountIndex)

  function settingsAccountIndex (request) {
    const id = api.keys.sync.id()
    const name = api.about.obs.name(id)

    return h('Settings Account -index', [
      h('section.setting', [
        computed(api.about.obs.imageUrl(id), (blob) => (
          h('img', { src: blob })
        ))
      ]),
      h('section.setting', [
        h('span.id', 'ID: '),
        h('input', { attributes: { readonly: true }, value: id }),
        // %%TODO%%: This can be refactored into a component
        h('i.fa.fa-clipboard.fa-lg', { 'ev-click': () => clipboard.writeText(id) })
      ]),
      h('section.setting', [
        h('span.id', 'Name: '),
        h('input', { value: name }),
        h('i.fa.fa-clipboard.fa-lg', { 'ev-click': () => clipboard.writeText(name) })
      ]),
    ])
  }
}