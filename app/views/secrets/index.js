const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, computed, Array: MutantArray, map, throttle } = require('mutant')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.index', secretsIndex)

  function secretsIndex (request) {
    return h('Secrets -index', [
      map(api.app.actions.secrets.fetch(), (secret) => (
        h('section.secret', [
          h('div.main', [
            h('div.top', {
              'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
            }, [
              h('div.name', secret.name),
              h('div.started', secret.createdAt)
            ]),
            h('div.bottom', [
              h('div.recipients', [
                secret.recipients.map(feedId => api.about.html.avatar(feedId))
              ]),
              h('div.state', [
                h('span.recps', secret.shards.filter(s => s.body).length),
                h('span', '/'),
                h('span.quorum', secret.quorum)
              ])
            ])
          ]),
          h('div.right', {
            'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
          }, [ h('i.fa.fa-chevron-right') ])
        ])
      ), { comparer }),
      h('section.secret', [
        h('div.main', {
          'ev-click': () => api.router.sync.goTo({ path: `/secrets/new` })
        }, [
          h('div.new', [
            h('i.fa.fa-plus.fa-lg')
          ])
        ])
      ])
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
