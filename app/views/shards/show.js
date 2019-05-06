const nest = require('depnest')
const { h, computed, Value } = require('mutant')

const History = require('../../components/History')
const Avatar = require('../../components/Avatar')
const Backward = require('../../components/Backward')
const Tabs = require('../../components/Tabs')

exports.gives = nest('views.shards.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.obs.imageUrl': 'first'
})

exports.create = (api) => {
  return nest('views.shards.show', shardsShow)

  // This design isn't right. I've put together something to show for the moment.
  // %%TODO%%: Redesign the peersShow interface and the shardsShow interface

  function shardsShow (request, children = []) {
    const { shard } = request

    const state = {
      tab: Value('history')
    }

    console.log(shard)

    return h('Shards -show', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.container', [
        h('section.details', [
          h('div.local', [
            Avatar({
              id: shard.peerId,
              size: 5,
              imageUrl: api.about.obs.imageUrl,
              onClick: api.router.sync.goTo({ path: `/peers/${shard.peerId}`, peer: { id: shard.peerId } })
            })
          ])
        ]),
        h('section.tabs', [
          Tabs({ tabs: [
            { name: 'history', onClick: () => state.tab.set('history'), class: computed(state.tab, tab => tab === 'history' ? 'active' : '') },
            { name: 'actions', onClick: () => state.tab.set('actions'), class: computed(state.tab, tab => tab === 'actions' ? 'active' : '') }
          ]})
        ]),
        computed(state.tab, tab => {
          if (tab === 'history') return History()
          else if (tab === 'actions')  return Actions({ state })
          else return null
        })
      ])
    ])
  }
}

function Actions (state) {
  return h('whatevs', [
    JSON.stringify(state)
  ])
}