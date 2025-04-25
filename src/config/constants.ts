export const CUBE_COLORS = {
  front: '#ff0000',   // 红色
  back: '#ff8c00',    // 橙色
  top: '#ffffff',     // 白色
  bottom: '#ffff00',  // 黄色
  right: '#00ff00',   // 绿色
  left: '#0000ff'     // 蓝色
}

export const CUBE_POSITIONS = (() => {
  const positions = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x, y, z])
      }
    }
  }
  return positions
})() 