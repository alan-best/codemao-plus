export const state = () => ({
  list: []
})
export const mutations = {
  addTask(state, obj) {
    state.list.push(obj);
  },
  removeTask(state, key) {
    state.list.splice(state.list.map(i => i.key).indexOf(key), 1)
  },
  setProcess(state, {key, process}) {
    state.list[state.list.map(i => i.key).indexOf(key)].process = process;
  }
}
