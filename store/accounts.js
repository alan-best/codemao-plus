export const state = () => ({
  list:
    JSON.parse(localStorage.getItem("accounts") || "[]")
})
export const mutations = {
  add(state, obj) {
    state.list.push(obj);
  },
  remove(state, index) {
    state.list.splice(index, 1)
  },
  modify(state, {index, obj}) {
    Object.assign(state.list[index], obj);
  },
  load(state, array) {
    state.list = [...array];
    console.log("loaded accounts")
  }
}
