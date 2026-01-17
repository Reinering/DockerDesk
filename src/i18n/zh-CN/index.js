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
  clean: "清屏",
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
    nodePanel: "节点面板",
    terminal: "终端节点",
    appstore: "应用商店",
    settings: "设置"
  },

  verifyMessage: {
    dataNotNull: "必填数据不能为空",
    dataLenNotMax: "数据长度不能超过:",
    dataLenNotMin: "数据长度不能小于:",

    invalidRepositoryName: "无效的名称",
    repositoryNameSlash: "名称斜杠错误",
    repositoryNameDoubleSlash: "名称双斜杠错误",
    invalidImageTag: "无效标签",
    tagStartChar: "标签起始字符错误",
    tagDoubleDot: "多个.",

    portRange: "端口范围内(1-65535)",
  },

  errorMessage: {
    verify: "数据校验错误",
  },

  index: {
    shortcuts: "快捷方式",

    addShortcuts: "添加快捷方式",
    editShortcuts: "编辑快捷方式",
    websiteUrl: "网站地址",
    websiteName: "网站名称",
    selectIcon: "选择图标",
    solidColor: "纯色图标",
    localIcon: "本地图标",
    getOnline: "在线获取",
    iconText: "图标文字",
    fontSize: "字体大小",
    color: "颜色",

    settings: "设置",
    shortcutsTemplate: "快捷方式模板",

    deleteMessage: "确认删除？",
    inputUrlMessage: "请输入ICON的URL",

    deleteSuccess: "删除成功",
    deleteFail: "删除失败",
    editSuccess: "编辑成功",
    editFail: "编辑失败",
    updateSuccess: "更新成功",
    updateFail: "更新失败",
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
    rebootSystem: "重启系统",
    addSubSystem: "添加子系统",
    addPackage: "添加模块",
    start: "启动",
    stop: "停止",
    bgStart: "后台运行",
    autoLaunch: "开机启动",
    launchWithApp: "随APP启动",
    startupBehavior: "启动行为",
    startWithApp: "随APP启动",
    stopWithApp: "随APP关闭",
    basicSettings: "基本设置",
    wslSettings: "WSL 设置",
    defaultInstallDir: "WSL默认安装目录",

    wslVersionHint: "版本: WSL1, 建议: WSL2",
    wslVersionHint1: "建议: WSL2",
    updating: "正在升级...",
    upgradeSuccess: "升级成功",
    upgradeFail: "升级失败",
    startSuccess: "启动成功",
    startFail: "启动失败",
    stopSuccess: "停止成功",
    stopFail: "停止失败",
    installing: "正在安装",
    installSuccess: "安装成功",
    installFail: "安装失败",
    installMessage: "子系统安装完成，正在初始化...",
    uninstalling: "正在卸载...",
    uninstallSuccess: "卸载成功",
    uninstallFail: "卸载失败",
    saveSuccess: "保存成功",
    saveFail: "保存失败",
    restarting: "正在重启...",
    restartSuccess: "重启成功",
    restartFail: "重启失败",
    getSettingError: "获取设置失败",
    setSuccess: "设置成功",
    setFail: "设置成功",
  },

  asslocal: {
    install: "安装",
    reinstall: "重新安装",
    settings: "设置",
    panel: "面板",
    notInstalled: "未安装",
    management: "管理",
    restart: "重启"

  },

  panel: {
    tabs: {
      create: "创建",
      containers: "容器",
      images: "映像",
      volumes: "卷",
      networks: "网络",
      logs: "日志",
      settings: "设置",
    },

    create: {
      title: "创建容器",

      create: "创建",
      clear: "清除",
      image: "映像",

      basic: "基本设置",
      containerName: "容器名称",
      nameLabel: "为空时，会自动生成",
      cmd: "覆盖镜像默认CMD",
      entrypoint: "覆盖镜像默认入口点",

      runtime: "运行时",
      runtime1: "指定容器运行时",
      mode: "模式",
      bgRun: "后台",
      itRun: "交互",
      rmRun: "停止后自动删除",
      restartPolicy: "容器重启策略",
      no: "不重启",
      always: "总是重启",
      onFailure: "失败时重启",
      unlessStopped: "除非手动停止，否则总是重启",
      maxRetries: "最大重启次数",

      environment: "环境变量",
      envFileMode: "从文件读取",
      envManualMode: "手动",
      envFile: "环境变量文件",
      envFileLabel: "选择本地环境变量文件",
      envKeyValue: "环境变量(键/值)",
      envKey: "键",
      envValue: "值",

      volumes: "卷",
      rw: "读写",
      ro: "只读",
      volumeMapping: "卷映射",
      volumeMapping1: "宿主机:容器",
      hostVolume: "宿主机目录/文件",
      containerVolume: "容器目录/文件",
      mount: "挂载",
      temporary: "临时文件系统",
      workDir: "工作目录",
      workDir1: "指定容器内工作目录",

      networks: "网络",
      hostname: "主机名",
      staticIP: "静态IP",
      staticIP1: "指定静态IP",
      containerHostname: "容器主机名",
      containerHostname1: "指定容器主机名",
      containerHost: "容器Host",
      containerHostMapping: "Host映射",
      macAddress: "指定容器MAC Address",

      ports: "端口映射",
      randomMapping: "随机映射(与其他冲突)",
      manualMapping: "手动映射",
      exposeContainer: "暴露容器端口(不映射)",
      portMapping: "映射(宿主机:容器)",
      new: "新增",
      hostPort: "宿主机端口",
      containerPort: "容器端口",

      resources: "资源",

      security: "安全",
      privileged: "容器Root权限",
      enable: "启用",
      user: "用户或UID",
      user1: "指定容器的用户或UID",

      loggingAndMonitoring: "日志与监控",

      paramsError: "参数错误"
    },

    containers: {
      create: "创建",
      refresh: "刷新",

      file: "文件",
      folder: "目录",

      inputHint1: "选择compose文件所在目录(必选)",
      inputHint2: "选择compose文件(非必选)",

      hintNote: "注意: 这里仅支持{0}方式， 若使用{1}命令跳转到\"映像\"页面",
      hintError: "错误: {0}未安装, 请在引导页面进行重新安装",

      pathIncludeSpace: "不支持空格路径",

      composing: "Composing",
      composeSuccess: "Compose Successfully",
      composeFail: "Compose Failed",

      getContainersError: "获取容器列表失败",
    },

    container: {
      run: "运行",
      stop: "停止",
      restart: "重启",
      detail: "详情",
      delete: "删除",
      log: "日志",
      terminal: "终端",
      pack: "打包成镜像",
      settings: "设置",

      packImageTitle: "容器打包成镜像",
      repository: "名称",
      tag: "标志",

      createTitle: "创建容器",

      info: "信息",
      env: "环境变量",
      port: "端口",
      volume: "卷",
      network: "网络",
      link: "链接",

      image: "镜像",
      createTime: "创建时间",
      status: "状态",
      selfStart: "自启动",
      command: "命令",

      externalPort: "本地端口",
      internalPort: "容器端口",
      protocol: "协议",
      action: "操作",
      send: "发送到首页",

      localPath: "本地路径",
      containerPath: "容器路径",
      type: "类型",

      starting: "正在启动",
      startSuccess: "启动成功",
      startFail: "启动失败",
      stopSuccess: "停止成功",
      stopFail: "停止失败",
      restarting: "正在重启",
      restartSuccess: "重启成功",
      restartFail: "重启失败",
      deleteMessage: "确认删除吗？",
      forceDelete: "需要强制删除?",
      deleteSuccess: "删除成功",
      deleteFail: "删除失败",
      exporting: "正在导出",
      exportSuccess: "导出成功",
      exportFail: "导出失败",
      packMessage: "确认将容器打包成镜像？",
      packing: "正在打包",
      packSuccess: "打包成功",
      packFail: "打包失败",
      configModifySuccess: "配置修改成功",
      configModifyFail: "配置修改失败",

      sendSuccess: "发送成功",
      sendFail: "发送失败",

    },

    images: {
      title: "映像管理",
      create: "创建",

      image: "映像",
      repository: "映像",
      tag: "标签",
      imageId: "映像ID",
      created: "创建时间",
      size: "大小",
      action: "操作",

      edit: "编辑",
      copy: "复制",
      reTag: "新标签",
      delete: "删除",
      export: "导出",
      import: "导入",
      createImage: "创建映像",
      createContainer: "创建容器",

      push: "推送",
      pull: "拉取",
      refresh: "刷新",
      batchDelete: "批量删除",

      editImageTitle: "编辑映像",
      retagImageTitle: "重新标签映像",
      oldRepository: "原名称",
      oldTag: "原标志",
      newRepository: "新名称",
      newTag: "新标志",

      getImagesError: "获取映像列表失败",
      pulling: "正在拉取镜像...",
      pullSuccess: "镜像拉取成功",
      pullFail: "镜像拉取失败",
      deleting: "正在删除",
      deleteSuccess: "镜像删除成功",
      deleteFail: "镜像删除失败",
      unmodified: "未修改",
      editImageSuccess: "编辑成功",
      editImageFail: "编辑失败",
      pathIncludeSpace: "不支持空格路径",
      exporting: "正在导出",
      exportSuccess: "导出成功",
      exportFail: "导出失败",
      importing: "正在导入",
      importSuccess: "导入成功",
      importFail: "导入失败",
      searchSuccess: "搜索成功",
      searchFail: "搜索失败",

      inputHint1: "选择Dockerfile文件所在目录(必选)",
      inputHint2: "选择Dockerfile文件(非必选)",
      hintNote: "注意: 这里是选择构建映像的DockerFile文件或目录",

      deleteMessage: "确认删除吗？",

      pullDialog: {
        name: "名称",
        description: "描述",
        stars: "星",
        official: "官方",
        action: "操作",

        pull: "拉取",
      }
    },

    volumes: {
      title: "卷管理",

      volumeName: "名称",
      driver: "驱动",
      action: "操作",
      create: "创建",

      batchDelete: '批量删除',
      refresh: '刷新',
      detail: '详情',
      delete: '删除',

      clearVolumes: "清理无用的卷",

      deleteMessage: "确认删除吗？",

      getVolumesError: "获取卷列表失败",
      deleting: "正在删除",
      deleteSuccess: "镜像删除成功",
      deleteFail: "镜像删除失败",
      queryDetailFail: "查询详细信息失败",
      clearVolumesSuccess: "清理成功",
      clearVolumesFail: "清理失败",
    },

    networks: {
      title: "网络管理",

      optional: "(非必需)",

      create: "创建",
      refresh: "刷新",
      delete: "删除",

      driver: "驱动",
      subnet: "子网",
      gateway: "网关",
      containers: "容器",
      onlineContainers: "在线容器",

      name: "网络名称",

      true: "启用",
      false: "禁用",

      bind: "绑定",
      unbind: "解绑",

      createNetworkTitle: "创建网络",
      bingContainerTitle: "绑定容器",
      containerList: "容器列表",

      deleteNetworkMessage: "确认删除该网络？",
      deleteNetworkError: "删除网络前，请先解绑所有容器？",
      unbindMessage: "确认解绑该容器？",


      getNetworksSuccess: "已获取网络列表",
      getNetworksError: "获取网络列表失败",
      getNetworkInfoError: "获取网络详细信息失败",

      networkBindSuccess: "绑定容器成功",
      networkBindFail: "绑定容器失败",
      networkUnbindSuccess: "解绑容器成功",
      networkUnbindFail: "解绑容器失败",

      createNetworkSuccess: "创建网络成功",
      createNetworkFail: "创建网络失败",

      deleteNetworkSuccess: "删除网络成功",
      deleteNetworkFail: "删除网络失败",

      paramsError: "参数错误"

    },

    settings: {
      settings: "设置",
      otherSettings: "其他设置",
      envSettings: "环境变量设置",
      save: "保存",
      add: "添加",
      edit: "编辑",
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
      srDialogTitle: "添加搜索仓库",

      searchRegistry: "搜索仓库",
      searchRegistry1: "默认搜索仓库",

      dnsParseError: "DNS字符串解析失败",
      fileNotExist: "文件不存在",
      saveSuccess: "配置保存成功",
      saveFail: "配置保存失败",
      dbSaveSuccess: "数据库保存成功",
      dbSaveFail: "数据库保存失败",
      proxySaveSuccess: "代理保存成功",
      proxySaveFail: "代理保存失败",
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
    bgStart: "后台运行",
    delete: "删除",
    terminal: "终端",
    export: "导出",
    move: "迁移",
    option: "选项",
    settings: "设置",
    detail: "详情",
    action: "操作",
    tool: "工具",
    wslDetail: "WSL 详情",

    basicSettings: "基本设置",
    wslSettings: "WSL 设置",
    startupBehavior: "启动行为",
    startWithApp: "跟随APP开启",
    stopWithApp: "跟随APP关闭",

    // wsl

    wslCreate: "WSL 创建",
    create: "创建",
    wslName: "名称",
    rootPrivilege: "使用Root权限",
    startNow: "安装时设置用户名密码，请开启",

    wslDistribution: "WSL 发行版",
    distributionName: "",
    customImage: "自定义镜像",
    localPath: "选择本地文件(tar/vhdx)",
    username: "用户名",
    password: "密码",

    display: "显示",
    edit: "编辑",
    shutdownAll: "强制关闭所有linux 子系统",
    restartService: "重启WSL服务",
    defaultInstallDir: "WSL默认安装目录",
    customInstallDir: "自定义安装目录",

    network: "网络",



    confirmDel: "确认删除",
    updating: "正在升级...",
    upgradeSuccess: "升级成功",
    upgradeFail: "升级失败",
    startSuccess: "启动成功",
    startFail: "启动失败",
    stopSuccess: "停止成功",
    stopFail: "停止失败",
    restartSuccess: "重启成功",
    restartFail: "重启失败",
    deleteMessage: "确认删除吗？",
    deleteMessage1: "确认删除之前，请确保重要数据已经保存。",
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
    actionSuccess: "操作成功",
    actionFail: "操作失败",
    selectFormat: "请选择导出格式",
    getSettingError: "获取设置失败",
    setSuccess: "设置成功",
    setFail: "设置成功",

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
    refresh: "刷新",
    local: "本地",
    remote: "远程",
    localNode: "本地节点",
    remoteNode: "远程节点",
    containerPanel: "容器面板",
    terminal: "终端",

    serviceName: "服务名称",
    serviceType: "服务类型",
    connectionType: "连接类型",
    wslsubName: "WSL子系统名称",
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
    keyMode: "密钥方式",
    keyString: "密钥输入",
    keyFile: "密钥文件",
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
    start: "运行",
    stop: "停止",
    restart: "重启",
    detail: "详情",
    more: "更多",

  },

  nodePanel: {

    connectError: "远程连接失败",
    connectClose: "远程连接关闭",

    wslNotInstall: "WSL未安装",
    wslNeedUpgrade: "WSL需要升级",
    wslSubNotStart: "WSL子系统未启动",
    wslSubNotFound: "WSL子系统未找到",
    dockerNotInstall: "Docker未安装",
    podmanNotInstall: "Podman未安装",

    wantInstallDocker: "想要安装Docker组件？",
    wantInstallPodman: "想要安装Podman组件？",
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
    select: "选择",
    save: "保存",
    close: "关闭",

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
    saveFileSuccess: "文件保存成功",
    saveFileError: "文件保存失败",
    readFileSuccess: "文件读取成功",
    readFileError: "文件读取失败",
    openFileSuccess: "文件打开成功",
    openFileError: "文件打开失败",

    deleteMessage: "确认删除吗？",
  },

  setting: {
    base: "基础用法",
    basic: "基本设置",
    system: "系统设置",

    theme: {
      auto: "自动模式",
      light: "浅色模式",
      dark: "深色模式",
    },

    userMode: "用户模式",

    mode: {
      normal: "普通模式",
      professional: "专业模式",
    },

    autoLaunch: "开机启动",

    actionSuccess: "操作成功",
    actionFail: "操作失败",
  },

  store: {
    settings: "设置",
    refresh: "刷新",
    api: "API设置",
    add: "添加",
    delete: "删除",
    edit: "编辑",
    confirm: "确认",
    detail: "详情",
    appDetail: "应用详情",

    appName: "应用名称",
    port: "网络端口",

    storeName: '商店名称',
    storeApi: '商店API',

    addStoreApi: "添加商店API",

    installSettings: "安装设置",
    defaultVolumeDir: "默认安装目录",

    confirmInstall: "确认安装？",
    install: "安装",
    installing: "正在安装",
    defaultInstall: "默认安装",
    customInstall: "自定义安装",
    installPrompt: "不熟悉容器的安装时，请选择默认安装，确认熟悉容器安装时，可以选择自定义安装",
    installErrorPrompt: "普通模式下，请先在引导页面安装WSL和相关组件后，才能安装Docker应用",

    selectNode: "选择安装节点",

    getApiError: "获取API失败",
    updateAPiSuccess: "更新API成功",
    updateAPiError: "更新API失败",
    saveSuccess: "保存成功",
    saveError: "保存失败",

    portExistError: "端口已存在，请"
  },

  other: {
    addNextPage: "添加下一页"
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
