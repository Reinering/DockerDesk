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
    serviceManagement: "服务管理",






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

    initError: "初始化失败",
    createFolderSuccess: "创建文件夹成功",
    createFolderError: "创建文件夹失败",
    createFileSuccess: "创建文件成功",
    createFileError: "创建文件失败",
    renameSuccess: "重命名成功",
    renameError: "重命名失败",
    downloadFileSuccess: "文件下载成功",
    downloadFileError: "文件下载失败",
    downloadFolderSuccess: "文件夹下载成功",
    downloadFolderError: "文件夹下载失败",
    uploadFileSuccess: "文件上传成功",
    uploadFileError: "文件上传失败",
    uploadFolderSuccess: "文件夹上传成功",
    uploadFolderError: "文件夹上传失败",
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
