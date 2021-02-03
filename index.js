// 定义表情与相关资源的键值对，表情动画数据会根据 key 进行访问。
const stickers = {
  bomb: {
    path: './3145-bomb.json'
  },
  pumpkin: {
    path: './43215-pumpkins-sticker-4.json'
  },
  heart: {
    path: './16968-heart-explode.json'
  },
  pao: {
    path: './42027-2021.json'
  },
}

// 获取 DOM 控件
const panelEle = document.querySelector('.panel') //消息面板元素
const chooseStickerBtn = document.querySelector('.chooseSticker') //选择表情按钮
const stickersEle = document.querySelector('.stickers') //弹出的表情选择框
const msgInputEle = document.querySelector('.messageInput') //消息输入框
const sendBtn = document.querySelector('.send') //发送按钮

// 初始化表情面板，也可以在表情选择窗弹出时再初始化
Object.keys(stickers).forEach((key) => {
  const lottieEle = stickersEle.appendChild(document.createElement('span'))
  // 对每个表情创建 lottie 播放器
  const player = lottie.loadAnimation({
    container: lottieEle, //播放器要挂载到的容器
    renderer: 'svg', //可以选择是使用 svg 还是 canvas 渲染动画
    loop: true, // 是否循环播放，由于此处是在表情选择弹出层中预览动画，所以支持循环播放
    autoplay: false, //是否自动播放，这里设置为了否，后边让它在鼠标划过时再播放动画。
    path: stickers[key].path //动画 json 文件路径，直接从对象中获取。
  })

  // 当选择表情时，发送消息，并设置类型为 sticker 表情消息
  lottieEle.addEventListener('click', () => {
    appendMsg(key, 'sticker')
  })

  // 当鼠标划过时，播放动画预览
  lottieEle.addEventListener('mouseover', () => {
    player.play()
  })
  // 当鼠标划过时，停止动画预览
  lottieEle.addEventListener('mouseleave', () => {
    player.stop()
  })
})


// 点击选择表情按钮时，展示表情弹窗
chooseStickerBtn.addEventListener('click', () => {
  stickersEle.classList.toggle('show')
})

// 点击发送按钮时，发送普通消息
sendBtn.addEventListener('click', () => {
  const msg = msgInputEle.value
  if (msg) {
    appendMsg(msg)
  }
})

/**
 * 追加消息到消息列表，如果是普通消息则直接追加，如果是表情消息则播放动画
 * 如果选择是“地雷”表情，播放爆炸动画并给消息添加震动效果动画
 * @param {string} msg
 * @param {string} type
 */
function appendMsg(msg, type) {
  // 创建消息元素
  const msgEle = panelEle.appendChild(document.createElement('div'))
  msgEle.classList.add('message', 'mine') // 设置为“我“发送的样式
  msgEle.innerHTML = `
      <img class="avatar" src="./me.png" alt="" />
      <p><span>${type === 'sticker' ? '' : msg}</span></p>
    `

  // 处理表情消息，播放相关动画
  if (type === 'sticker') {
    playSticker(msg, msgEle)

    if (msg === 'bomb') {
      // 播放爆炸动画
      setTimeout(() => {
        playExplosion(msgEle)
      }, 800)

      // 晃动消息列表
      shakeMessages()
    }
    if(msg==='pao'){
       // 播放爆炸动画
       setTimeout(() => {
        playExplosion2(msgEle)
      }, 800)
    }
  }
  // 滚动到最新消息
  panelEle.scrollTop = panelEle.scrollHeight
  msgInputEle.value = ''
}

/**
 * 播放表情动画
 * @param {string} key
 * @param {HTMLElement} msgEle
 */
function playSticker(key, msgEle) {
  // 表情消息，创建 lottie 动画
  const lottieEle = msgEle.querySelector('span')
  lottieEle.style.width = '40px'
  lottieEle.style.height = '40px'
  lottie.loadAnimation({
    container: lottieEle,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: stickers[key].path
  })
}

function playExplosion(anchor) {
  const explosionAnimeEle = anchor.appendChild(document.createElement('div'))
  explosionAnimeEle.style.position = 'absolute'
  explosionAnimeEle.style.width = '200px'
  explosionAnimeEle.style.height = '100px'
  explosionAnimeEle.style.right = 0
  explosionAnimeEle.style.bottom = 0

  const explosionPlayer = lottie.loadAnimation({
    container: explosionAnimeEle,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './9990-explosion.json'
  })
  explosionPlayer.setSpeed(0.3) //速度设置为 0.3 倍速
  //设置事件监听："complete", 播放完成后，销毁爆炸相关的动画和元素
  explosionPlayer.addEventListener('complete', () => {
    explosionPlayer.destroy()
    explosionAnimeEle.remove()
  })
}


function playExplosion2(anchor) {
  const explosionAnimeEle = anchor.appendChild(document.createElement('div'))
  explosionAnimeEle.style.position = 'absolute'
  explosionAnimeEle.style.width = '300px'
  explosionAnimeEle.style.height = '600px'
  explosionAnimeEle.style.right = 0
  explosionAnimeEle.style.bottom = 0

  const explosionPlayer = lottie.loadAnimation({
    container: explosionAnimeEle,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './42027-2021.json'
  })
  explosionPlayer.setSpeed(0.3) //速度设置为 0.3 倍速s
  //设置事件监听："complete", 播放完成后，销毁爆炸相关的动画和元素
  explosionPlayer.addEventListener('complete', () => {
    explosionPlayer.destroy()
    explosionAnimeEle.remove()
  })
}


/**
 * 对最新的 5 条消息添加晃动动画
 * @param {HTMLElement} panelEle
 */
function shakeMessages() {
  ;[...panelEle.children]
    .reverse()
    .slice(0, 5)
    .forEach((messageEle) => {
      const avatarEle = messageEle.querySelector('img')
      const msgContentEle = messageEle.querySelector('p')
      avatarEle.classList.remove('shake')
      msgContentEle.classList.remove('shake')
      setTimeout(() => {
        avatarEle.classList.add('shake')
        msgContentEle.classList.add('shake')
      }, 700)
    })
}
