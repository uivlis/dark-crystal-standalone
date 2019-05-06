const nest = require('depnest')
const { h, computed, Value } = require('mutant')

const Avatar = require('../../components/Avatar')
const Backward = require('../../components/Backward')

exports.gives = nest('views.peers.show')

exports.needs = nest({
  'app.actions.shards.fetch': 'first',
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.obs.imageUrl': 'first',
  'about.obs.name': 'first'
})

exports.create = (api) => {
  return nest('views.peers.show', peersShow)

  // This design isn't right. I've put together something to show for the moment.
  // %%TODO%%: Redesign the peersShow interface and the shardsShow interface

  function peersShow (request, children = []) {
    const state = {
      id: request.peer.id
    }

    return h('Peers -show', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.container', [
        h('section.profile', [
          h('div.left', [
            Avatar({
              id: state.id,
              imageUrl: api.about.obs.imageUrl,
              size: 6
            })
          ]),
          h('div.right', [
            h('div.name', api.about.obs.name(state.id))
          ])
        ]),
        computed(api.app.actions.shards.fetch(), (shards) => {
          if (!shards.length) return h('i.fa.fa-spinner.fa-pulse.fa-2x')

          const peer = shards.find(s => s.id === state.id)

          if (!peer) return h('section', [ h('p', 'No shards mate') ])
          else return peer.shards.map((shard) => {
            return h('section.shard', { title: shard.root, 'ev-click': () => api.router.sync.goTo({ path: `/shards/${shard.id}`, shard: { ...shard, peerId: peer.id } }) }, [
              h('div.left', [
                h('div.sentAt', shard.sentAt)
              ]),
              h('div.right', [
                h('div.state', shard.state)
              ])
            ])
          })
        })
      ])
    ])
  }
}