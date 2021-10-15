export const state = {
  list: []
}
export const mutations = {
  add(state, obj) {
    state.list.push(obj);
  },
  remove(state, index) {
    state.list.splice(index, 1)
  },
  modify(state, {index, obj}) {
    Object.assign(state.list[index], obj);
  }
}
