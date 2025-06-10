export default {
  failed: 'Action failed',
  success: 'Action was successful',

  save: '保存',
  cancel: '取消',
  ok: '确定',
  close: "关闭",

  username: '用户名',
  password: '密码',

  copy: "复制",
  paste: "粘贴",
  selectPaste: "选中粘贴",

  edit: '编辑',
  add: '添加',
  apply: '应用',
  update: '更新',
  delete: '删除',
  search: '搜索',
  reset: '重置',
  refresh: '刷新',
  connect: '连接',
  upload: '上传',
  download: '下载',
  select: '选择',
  selectAll: '全选',
  selectNone: '全不选',
  selectInvert: '反选',
  selectFile: '选择文件',
  selectFolder: '选择文件夹',
  mark: "备注",

  confirm: "确认",

  selectLanguage: '选择语言',

  //
  settings: "设置",
  management: "管理",

  //navi
  navigator: {
    home: "首页",
    assistant: "引导",
    wsl: "WSL",
    nodes: "节点",
    nodesMg: "节点管理",
    dockerNode: "Docker节点",
    terminal: "终端节点",
    settings: "设置"
  },

  verifyMessage: {
    dataNotNull: "必填数据不能为空",
    dataLenNotMax: "数据长度不能超过:",
    dataLenNotMin: "数据长度不能超过:",
  },

  assistant: {
    local: "本地",
    remote: "远程",
    settings: "管理服务",
    install: "安装",

    addService: "添加服务",
    installed: "已安装",
    notInstalled: "未安装",
    needUpgrade: "需要升级",
    addSubSystem: "添加子系统",
    addPackage: "添加模块",
    start: "启动",
    stop: "停止",
    bgStart: "后台运行",

    upgradeSuccess: "升级成功",
    upgradeFail: "升级失败",
    startSuccess: "启动成功",
    startFail: "启动失败",
    stopSuccess: "停止成功",
    stopFail: "停止失败",
    installing: "正在安装",
    installSuccess: "安装成功",
    installFail: "安装失败",
    installMessage: "子系统安装完成，正在初始化..."
  },

  asslocal: {
    install: "安装",
    settings: "设置",
    panel: "面板",
    notInstalled: "未安装",
    management: "管理",

  },

  panel: {
    containers: {
      create: "创建",
    },
    container: {
      run: "运行",
      stop: "停止",
      restart: "重启",
      delete: "删除",
      terminal: "终端",
      export: "导出",
      settings: "设置",
    },
    settings: {
      settings: "设置",
      save: "保存",
      add: "添加",
      basicSettings: "基本设置",
      registry: "仓库",
      registryMirrors: "镜像代理",
      registryProxy: "镜像代理",
      proxySetting: "网络代理设置",
      proxyMode: "代理模式",
      systemMode: "跟随系统",
      manualMode: "手动模式",
      disableMode: "禁用",

      rmDialogTitle: "添加镜像代理",
      rDialogTitle: "添加仓库",

      dnsParseError: "DNS字符串解析失败",
      fileNotExist: "文件不存在",
      saveSuccess: "配置保存成功",
      saveFail: "配置保存失败",
    }
  },

  wsl: {

    officialTutorial: "官方教程",

    tabs: {
      subSys: "子系统",
      create: "创建新子系统",
      settings: "设置"
    },

    run: "运行",
    stop: "停止",
    restart: "重启",
    delete: "删除",
    terminal: "终端",
    export: "导出",
    move: "迁移",

    wslCreate: "WSL 创建",
    create: "创建",
    wslName: "名称",
    rootPrivilege: "使用Root权限",
    startNow: "安装时设置用户名密码，请开启",

    wslDistribution: "WSL 发行版",
    distributionName: "",
    customImage: "自定义镜像",
    localImagePath: "选择本地镜像文件(非必选)",
    username: "用户名",
    password: "密码",

    display: "显示",
    edit: "编辑",

    startSuccess: "启动成功",
    startFail: "启动失败",
    stopSuccess: "停止成功",
    stopFail: "停止失败",
    restartSuccess: "重启成功",
    restartFail: "重启失败",
    deleteMessage: "确认删除吗？",
    deleteSuccess: "删除成功",
    deleteFail: "删除失败",
    exporting: "正在导出",
    exportSuccess: "导出成功",
    exportFail: "导出失败",
    moving: "正在迁移",
    movingSuccess: "迁移成功",
    movingFail: "迁移失败",
    configModifySuccess: "配置修改成功",
    configModifyFail: "配置修改失败",

    nameNotNull: "名称不能为空或超过长度",
    distributionNotNull: "WSL发行版不能为空",
    localImageNotNull: "本地镜像文件不能为空"


  },

  // Node
  node: {
    addServiceTitle: "添加服务",
    editServiceTitle: "编辑服务",
    serviceManagement: "服务管理",
    addService: "添加服务",
    local: "本地",
    remote: "远程",
    localNode: "本地节点",
    remoteNode: "远程节点",
    dockerPanel: "docker面板",

    serviceName: "服务名称",
    serviceType: "服务类型",
    connectionType: "连接类型",
    protocol: "协议",
    address: "地址",
    port: "端口",
    serviceStatus: "服务状态",
    action: "操作",
    mark: "备注",

    addNode: "添加节点",
    nodeName: "节点名称",
    authType: "认证方式",
    password: "密码",
    key: "密钥",
    selectKeyFile: "选择密钥文件",
    keyFileHint: "密钥已隐藏",

    nodeUrl: "节点URL",
    nodePort: "节点端口",
    nodeUserName: "节点用户名",
    nodePassword: "节点密码",
    nodeDescription: "节点描述",
    nodeStatus: "节点状态",
    nodeStatusOnline: "在线",
    nodeStatusOffline: "离线",
    nodeStatusError: "错误",

    portRange: "端口范围",

    connectMessage: "是否要进行此连接？",
    connectError: "缺少必要的连接参数",
    connectError1: "查找路由失败",
    deleteMessage: "确认删除吗？",
    fileReadError: "文件读取失败",
  },

  //Docker Node
  dockerNode: {

    addServiceTitle: "添加 Docker/Podman 服务",
    editServiceTitle: "编辑 Docker/Podman 服务",
    addService: "添加服务",
    local: "本地",
    remote: "远程",
    localNode: "本地节点",
    remoteNode: "远程节点",

    serviceName: "服务名称",
    serviceType: "服务类型",
    connectionType: "连接类型",
    address: "地址",
    port: "端口",
    serviceStatus: "服务状态",
    action: "操作",
    mark: "备注",

    addNode: "添加节点",
    nodeName: "节点名称",
    nodeUrl: "节点URL",
    nodePort: "节点端口",
    nodeUserName: "节点用户名",
    nodePassword: "节点密码",
    nodeDescription: "节点描述",
    nodeStatus: "节点状态",
    nodeStatusOnline: "在线",
    nodeStatusOffline: "离线",
    nodeStatusError: "错误",

    connectMessage: "是否要进行此连接？",
    connectError: "缺少必要的连接参数",
    deleteMessage: "确认删除吗？"
  },

  container: {


  },

  terminal: {
    globalSettingsTitle: "终端节点全局设置",

    closeMessage: "确认关闭吗？",
  },

  xterm: {

    termInitError: "终端初始化失败",

    nodePtyInitError: "node-pty 未初始化",


  },

  cmdBar: {
    addCmdGroup: "添加 CMD 组",
    editCmdGroup: "编辑 CMD 组",
    groupName: "组名",

    label: "标签",
    sendString: "命令文本",
    mark: "备注",

    addCmd: "添加 CMD",
    editCmd: "编辑 CMD",



    deleteMessage: "确认删除吗？",
  },

  filesystem: {
    title: "文件系统",

    name: "名称",
    attr: "属性",
    modifyTime: "修改日期",
    size: "大小",
    action: "操作",

    parentFolder: "上级目录",
    createFolder: "创建文件夹",
    createFile: "创建文件",
    uploadFolder: "上传文件夹",
    uploadFile: "上传文件",
    batchDownload: "批量下载",
    refresh: "刷新",
    batchDelete: "批量删除",
    fullscreen: "全屏",
    fullWidth: "全宽",
    rename: "重命名",

    enter: "输入",
    modify: "修改",
    folderName: "文件夹名",
    fileName: "文件名",

    modifyNameHint: "内容未改变，无需修改",

    sftpError: "SFTP错误",
    initError: "初始化失败",
    createFolderSuccess: "创建文件夹成功",
    createFolderError: "创建文件夹失败",
    createFileSuccess: "创建文件成功",
    createFileError: "创建文件失败",
    renameSuccess: "重命名成功",
    renameError: "重命名失败",
    downloadFileStart: "文件开始下载",
    downloadingFile: "文件下载中...",
    downloadFileSuccess: "文件下载成功",
    downloadFileError: "文件下载失败",
    downloadFolderSuccess: "文件夹下载成功",
    downloadFolderError: "文件夹下载失败",
    downloadingFolder: "文件夹下载中...",
    uploadFileSuccess: "文件上传成功",
    uploadFileError: "文件上传失败",
    uploadFileStart: "文件开始上传",
    uploadingFile: "文件上传中...",
    uploadFolderSuccess: "文件夹上传成功",
    uploadFolderError: "文件夹上传失败",
    uploadingFolder: "文件夹上传中...",
    deleteFileSuccess: "文件删除成功",
    deleteFileError: "文件删除成功",
    deleteFolderSuccess: "文件夹删除成功",
    deleteFolderError: "文件夹删除失败",

    deleteMessage: "确认删除吗？",
  },

  setting: {
    theme: {
      auto: "自动模式",
      light: "浅色模式",
      dark: "深色模式",
    }
  },

  // db
  database: {
    initError: '数据库初始化失败',
    initSuccess: '数据库初始化成功',
    initTableError: '表初始化失败',
    initTableSuccess: '表初始化成功',
    connectionError: '数据库连接失败',
    connectionSuccess: '数据库连接成功',

    accessSuccess: "访问成功",
    accessFail: "访问失败",
    addSuccess: "添加成功",
    addFail: "添加失败",
    writeSuccess: "写入成功",
    writeError: "写入失败",
    updateSuccess: "更新成功",
    updateError: "更新失败",
    deleteSuccess: "删除成功",
    deleteFail: "删除失败",
  }
}
