export const state = {
  list: [
    // {icon: "", label: "任务管理器", process: -1}
  ]
}
export const mutations = {
  addTask(state, obj) {
    state.list.push(obj);
  },
  removeTask(state, index) {
    state.list.splice(index, 1)
  },
  setProcess(state, {index, process}) {
    state.list[index].process = process;
  }
}
