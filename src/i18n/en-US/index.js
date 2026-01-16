// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',

  save: 'Save',
  cancel: 'Cancel',
  ok: 'OK',
  close: "Close",

  username: 'Username',
  password: 'Password',

  copy: "Copy",
  paste: "Paste",
  selectPaste: "Select Paste",

  edit: 'Edit',
  add: 'Add',
  apply: 'Apply',
  update: 'Update',
  delete: 'Delete',
  search: 'Search',
  reset: 'Reset',
  refresh: 'Refresh',
  connect: 'Connect',
  clean: "Clean",
  upload: 'Upload',
  download: 'Download',
  select: 'Select',
  selectAll: 'Select All',
  selectNone: 'Select None',
  selectInvert: 'Select Invert',
  selectFile: 'Select File',
  selectFolder: 'Select Folder',
  mark: "mark",

  confirm: "Confirm",

  selectLanguage: 'Select Language',


  //
  settings: "Settings",
  management: "Management",

  //navi
  navigator: {
    home: "Home",
    assistant: "Assistant",
    wsl: "WSL",
    nodes: "Nodes",
    nodesMg: "Nodes Management",
    nodePanel: "Node Panel",
    dockerNode: "Docker Node",
    terminal: "Terminal Node",
    appstore: "应用商店",
    settings: "Settings"
  },

  verifyMessage: {
    dataNotNull: "Not Null",
    dataLenNotMax: "The data length cannot exceed:",
    dataLenNotMin: "The data length cannot be less than:",

    invalidRepositoryName: "Invalid repository name",
    repositoryNameSlash: "Repository name slash",
    repositoryNameDoubleSlash: "Double slash in repository name",
    invalidImageTag: "Invalid image tag",
    tagStartChar: "Tag start character",
    tagDoubleDot: "Tag double dot",

    portRange: "port range (1-65535)",
  },

  errorMessage: {
    verify: "Data validation error",
  },

  index: {
    shortcuts: "Shortcuts",

    addShortcuts: "Add Shortcut",
    editShortcuts: "Edit Shortcut",
    websiteUrl: "Website Url",
    websiteName: "Website Name",
    selectIcon: "Choice Icon",
    solidColor: "Solid color",
    localIcon: "Local Icon",
    getOnline: "Get it online",
    iconText: "Icon Text",
    fontSize: "Font Size",
    color: "Color",

    settings: "Settings",
    shortcutsTemplate: "Shortcuts Template",

    deleteMessage: "Confirm deletion?？",
    inputUrlMessage: "Please enter the URL of the ICON",

    deleteSuccess: "Deleted successfully",
    deleteFail: "Deletion failed",
    editSuccess: "Edit successfully",
    editFail: "Edit failed",
    updateSuccess: "Update successfully",
    updateFail: "Update failed",
  },

  assistant: {
    local: "Local",
    remote: "Remote",
    settings: "Settings",
    install: "Install",

    addService: "Add Service",
    installed: "Installed",
    notInstalled: "Not installed",
    needUpgrade: "Need to upgrade",
    rebootSystem: "Restart the system",
    addSubSystem: "Add SubSystem",
    addPackage: "Add Package",
    start: "Start",
    stop: "Stop",
    bgStart: "Background Start",
    autoLaunch: "Auto Launch",
    launchWithApp: "Launch with App",
    startupBehavior: "Startup Behavior",
    startWithApp: "Start with App",
    stopWithApp: "Stop with App",
    basicSettings: "Basic Settings",
    wslSettings: "WSL Settings",
    defaultInstallDir: "WSL default installation directory",

    wslVersionHint: "Version: WSL1, Suggestions: WSL2",
    wslVersionHint1: "Suggestions: WSL2",

    updating: "Upgrading...",
    upgradeSuccess: "Upgrade Successfully",
    upgradeFail: "Upgrade Failure",
    startSuccess: "Start Successfully",
    startFail: "Start Failure",
    stopSuccess: "Stop Successfully",
    stopFail: "Stop Failure",
    installing: "Installing",
    installSuccess: "Install Successfully",
    installFail: "Install Failure",
    installMessage: "System installation completed, initializing...",
    uninstalling: "Uninstalling",
    uninstallSuccess: "Uninstall Successfully",
    uninstallFail: "Uninstall Failure",
    saveSuccess: "Settings saved Successfully.",
    saveFail: "Settings saved Failure.",
    restarting: "Restart...",
    restartSuccess: "Restart Successfully",
    restartFail: "Restart Failure",
    getSettingError: "Get Settings Failure",
    setSuccess: "Set Successfully",
    setFail: "Set Failure",
  },

  asslocal: {
    install: "Install",
    reinstall: "Reinstall",
    settings: "Settings",
    panel: "Panel",
    notInstalled: "Not Installed",
    management: "MG",
    restart: "Restart"
  },

  panel: {
    tabs: {
      create: "Create",
      containers: "Containers",
      images: "Images",
      volumes: "Volumes",
      networks: "Networks",
      logs: "Logs",
      settings: "Settings",
    },

    create: {
      title: "Create Container",

      create: "Create",
      clear: "Clear",
      image: "Image",

      basic: "Basic",
      containerName: "Container Name",
      nameLabel: "If it is empty, it will be automatically generated.",
      cmd: "Overwrite the default CMD of the image",
      entrypoint: "Overwrite the default entrypoint of the image",

      runtime: "Runtime",
      runtime1: "Specify the Container Runtime",
      mode: "Mode",
      bgRun: "Background",
      itRun: "Interactive",
      rmRun: "Automatically delete after stopping",
      restartPolicy: "Container Restart Policy",
      no: "Do not restart",
      always: "Always restart",
      onFailure: "Restart on failure",
      unlessStopped: "Always restart unless stopped manually",
      maxRetries: "Max Retries",

      environment: "Environment",
      envFileMode: "Reading from a file",
      envManualMode: "Manual",
      envFile: "ENV variable files",
      envFileLabel: "Select the local ENV variable file",
      envKeyValue: "ENV variable(Key/Value)",
      envKey: "Key",
      envValue: "Value",

      volumes: "Volumes",
      rw: "Read/Write",
      ro: "Read Only",
      volumeMapping: "Volume Mapping",
      volumeMapping1: "Host:Container",
      hostVolume: "Host Folder/File",
      containerVolume: "Container Folder/File",
      temporary: "Temporary file system",
      workDir: "WorkDir",
      workDir1: "Specify the working directory in the container",

      networks: "Network",
      hostname: "Hostname",
      staticIP: "Static IP",
      staticIP1: "Specify a static IP",
      containerHostname: "Container Hostname",
      containerHostname1: "Specify the Container Hostname",
      containerHost: "Container Host",
      containerHostMapping: "Host Mapping",
      macAddress: "Specify the Container MAC Address",

      ports: "Ports",
      randomMapping: "Random Mapping(Conflict with other)",
      manualMapping: "Manual Mapping",
      exposeContainer: "Expose Container Port(not mapping)",
      portMapping: "Port Mapping(host:container)",
      new: "New",
      hostPort: "Host Port",
      containerPort: "Container Port",

      resources: "Resources",

      security: "Security",
      privileged: "Container Root privileged",
      enable: "Enable",
      user: "user or UID",
      user1: "Specify the container user or UID",

      loggingAndMonitoring: "Logging and Monitoring",

      paramsError: "Param Error"
    },

    containers: {
      create: "Create",
      refresh: "Refresh",

      file: "File",
      folder: "Folder",

      inputHint1: "Select the directory where the compose file is located(Required)",
      inputHint2: "Select the compose file(Optional)",

      hintNote: "Note: Only {0} is supported here. If you use the {1} command, you will be redirected to the \"Images\" page.",
      hintError: "Error: {0} is not installed, please reinstall it on the Assistant page",

      pathIncludeSpace: "Paths with spaces are not supported",

      composing: "Composing",
      composeSuccess: "Compose Successfully",
      composeFail: "Compose Failed",

      getContainersError: "Failed to obtain container list",
    },

    container: {
      run: "Run",
      stop: "Stop",
      restart: "Restart",
      detail: "Detail",
      delete: "Delete",
      log: "Log",
      terminal: "Terminal",
      pack: "Package into image",
      settings: "Settings",

      packImageTitle: "Container packaging into images",
      repository: "Repository",
      tag: "Tag",

      createTitle: "Create Container",

      info: "Info",
      env: "ENV",
      port: "Port",
      volume: "Volume",
      network: "Network",
      link: "Link",

      image: "Image",
      createTime: "Create Time",
      status: "Status",
      selfStart: "Self-Start",
      command: "Command",

      externalPort: "External Port",
      internalPort: "Internal Port",
      protocol: "Protocol",
      action: "Action",
      send: "Send to Home Page",

      localPath: "Local Path",
      containerPath: "Container Path",
      type: "Type",

      starting: "Starting",
      startSuccess: "Start Successfully",
      startFail: "Start Failure",
      stopSuccess: "Stop Successfully",
      stopFail: "Stop Failure",
      restarting: "Restarting",
      restartSuccess: "Restart Successfully",
      restartFail: "Restart Failure",
      deleteMessage: "Are you sure to delete?",
      forceDelete: "Need to force delete?",
      deleteSuccess: "Delete Successfully",
      deleteFail: "Delete Failure",
      exporting: "Exporting",
      exportSuccess: "Export Successfully",
      exportFail: "Export Failure",
      packMessage: "Are you sure to package the container into an image?",
      packing: "Packing",
      packSuccess: "Pack Successfully",
      packFail: "Pack Failure",
      configModifySuccess: "Configuration Modification Successful",
      configModifyFail: "Configuration modification Failure",

      sendSuccess: "Send successfully",
      sendFail: "Send failed",
    },

    images: {
      title: "Images Management",
      create: "Create",

      image: "Image",
      repository: "REPOSITORY",
      tag: "TAG",
      imageId: "IMAGE ID",
      created: "CREATED",
      size: "SIZE",
      action: "ACTIONS",

      edit: "Edit",
      copy: "Copy",
      reTag: "Retag",
      delete: "Delete",
      export: "Export",
      import: "Import",
      createImage: "Create Image",
      createContainer: "Create Container",

      push: "Push",
      pull: "Pull",
      refresh: "Refresh",
      batchDelete: "Batch Delete",

      editImageTitle: "Edit Image",
      retagImageTitle: "Retag Image",
      oldRepository: "Old Repository",
      oldTag: "Old Tag",
      newRepository: "New Repository",
      newTag: "New Tag",

      getImagesError: "Failed to get image list",
      pulling: "Pulling image...",
      pullSuccess: "Image pull successful",
      pullFail: "Image pull failed",
      deleting: "Deleting",
      deleteSuccess: "Image deleted successfully",
      deleteFail: "Image deleted failed",
      unmodified: "Unmodified",
      editImageSuccess: "Edit successfully",
      editImageFail: "Edit failed",
      pathIncludeSpace: "Paths with spaces are not supported",
      exporting: "exporting",
      exportSuccess: "Export successfully",
      exportFail: "Export failed",
      importing: "importing",
      importSuccess: "Import successfully",
      importFail: "Import failed",
      searchSuccess: "Search successfully",
      searchFail: "Search failed",

      inputHint1: "Select the directory where the Dockerfile is located(Required)",
      inputHint2: "Select the Dockerfile(Optional)",
      hintNote: "Note: This is the DockerFile file or directory where you choose to build the image",

      deleteMessage: "Are you sure to delete?",

      pullDialog: {
        name: "Name",
        description: "Description",
        stars: "Stars",
        official: "Official",
        action: "Action",

        pull: "Pull",
      }
    },

    volumes: {
      title: "Volume",

      volumeName: "Volume Name",
      driver: "Driver",
      action: "Action",
      create: "Create",

      batchDelete: 'Batch Delete',
      refresh: 'Refresh',
      detail: 'Detail',
      delete: 'Delete',

      clearVolumes: "Clean up unused volumes",

      deleteMessage: "Are you sure to delete?",

      getVolumesError: "Failed to get volume list",
      deleting: "Deleting",
      deleteSuccess: "Image deleted successfully",
      deleteFail: "Image deleted failed",
      queryDetailFail: "Failed to query detailed information",
      clearVolumesSuccess: "Clean up successfully",
      clearVolumesFail: "Clean up failed",
    },

    networks: {
      title: "Network Management",

      optional: "(Optional)",

      create: "Create",
      refresh: "Refresh",
      delete: "Delete",

      driver: "Driver",
      subnet: "Subnet",
      gateway: "Gateway",
      containers: "Containers",
      onlineContainers: "Online Container",

      name: "Network Name",

      true: "On",
      false: "Off",

      bind: "Bind",
      unbind: "Unbind",

      createNetworkTitle: "Create Network",
      bingContainerTitle: "Bind Container",
      containerList: "Container List",

      deleteNetworkMessage: "Confirm to delete the network？",
      deleteNetworkError: "Before deleting the network, please unbind all containers?",
      unbindMessage: "Confirm to unbind the container？",

      getNetworksSuccess: "Obtained network list",
      getNetworksError: "Failed to get network list",
      getNetworkInfoError: "Failed to get network details",

      networkBindSuccess: "Binding container successfully",
      networkBindFail: "Failed to bind container",
      networkUnbindSuccess: "Unbinding container successfully",
      networkUnbindFail: "Failed to unbind container",

      createNetworkSuccess: "Network created successfully",
      createNetworkFail: "Failed to create network",

      deleteNetworkSuccess: "Delete network successfully",
      deleteNetworkFail: "Failed to delete network",

      paramsError: "Param Error"
    },

    settings: {
      settings: "Settings",
      otherSettings: "Other Settings",
      envSettings: "Environment variable Settings",
      save: "Save",
      add: "Add",
      edit: "Edit",
      basicSettings: "Basic Settings",
      registry: "Registry",
      registryMirrors: "Registry Mirror",
      registryProxy: "Registry Proxy",
      proxySetting: "Network Proxy Settings",
      proxyMode: "Proxy Mode",
      systemMode: "System",
      manualMode: "Manual",
      disableMode: "Disable",

      rmDialogTitle: "Add Registry Mirror",
      rDialogTitle: "Add Registry",
      srDialogTitle: "Add Search Registry",

      searchRegistry: "Search Registry",
      searchRegistry1: "Default Search Registry",

      dnsParseError: "DNS string resolution failed",
      fileNotExist: "File does not exist",
      saveSuccess: "Configuration saved successfully",
      saveFail: "Configuration save failed",
      dbSaveSuccess: "DataBase saved successfully",
      dbSaveFail: "DataBase saved failed",
      proxySaveSuccess: "Proxy saved successfully",
      proxySaveFail: "Proxy saved failed",
    }
  },

  wsl: {

    officialTutorial: "Official Tutorial",

    tabs: {
      subSys: "SubSystem",
      create: "Create SubSystem",
      settings: "Settings"
    },

    run: "Run",
    stop: "Stop",
    restart: "Restart",
    bgStart: "Background Start",
    delete: "Delete",
    terminal: "Terminal",
    export: "Export",
    move: "Move",
    option: "Option",
    settings: "Settings",
    detail: "Detail",
    wslDetail: "WSL Detail",

    basicSettings: "Basic Settings",
    wslSettings: "WSL Settings",
    startupBehavior: "Startup Behavior",
    startWithApp: "Start With App",
    stopWithApp: "Stop With App",


    wslCreate: "WSL Create",
    create: "Create",
    wslName: "Name",
    rootPrivilege: "Machine with root privileges",
    startNow: "Need to set username/password, please turn on",

    wslDistribution: "WSL Distribution",
    customImage: "Custom Image",
    localPath: "Select Local Path(tar/vhdx)",
    username: "Username",
    password: "Password",

    display: "Display",
    edit: "Edit",
    shutdownAll: "Force shut down all Linux subsystems",
    restartService: "Restart WSL service",
    defaultInstallDir: "WSL default installation directory",
    customInstallDir: "Custom installation directory",

    Network: "Network",

    confirmDel: "Confirm Delete",
    updating: "Upgrading...",
    upgradeSuccess: "Upgrade Successfully",
    upgradeFail: "Upgrade Failure",
    startSuccess: "Start Successfully",
    startFail: "Start Failure",
    stopSuccess: "Stop Successfully",
    stopFail: "Stop Failure",
    restartSuccess: "Restart Successfully",
    restartFail: "Restart Failure",
    deleteMessage: "Are you sure to delete?",
    deleteMessage1: "Before confirming the deletion, please ensure that all important data has been saved.",
    deleteSuccess: "Delete Successfully",
    deleteFail: "Delete Failure",
    exporting: "Exporting",
    exportSuccess: "Export Successfully",
    exportFail: "Export Failure",
    moving: "Moving",
    movingSuccess: "Moved Successfully",
    movingFail: "Moved Failure",
    configModifySuccess: "Configuration Modification Successful",
    configModifyFail: "Configuration modification Failure",
    actionSuccess: "Operation Successfully",
    actionFail: "Operation Failure",
    selectFormat: "Please select the export format",
    getSettingError: "Get Settings Failure",
    setSuccess: "Set Successfully",
    setFail: "Set Failure",

    nameNotNull: "The name cannot be empty or exceed the length",
    distributionNotNull: "WSL distribution version cannot be empty",
    localImageNotNull: "The local image file cannot be empty"
  },

  // Node
  node: {
    addServiceTitle: "Add Docker/Podman Service",
    editServiceTitle: "Edit Docker/Podman Service",
    serviceManagement: "Service Management",
    addService: "Add Service",
    refresh: "Refresh",
    local: "local",
    remote: "remote",
    localNode: "local node",
    remoteNode: "remote node",
    containerPanel: "Container panel",
    terminal: "Terminal",

    serviceName: "Service Name",
    serviceType: "Service Type",
    connectionType: "Link Type",
    wslsubName: "WSL SubSystem Name",
    protocol: "Protocol",
    address: "Address",
    port: "Port",
    serviceStatus: "Service Status",
    action: "Action",
    mark: "Mark",

    addNode: "Add Node",
    nodeName: "Node Name",
    authType: "Auth Type",
    password: 'password',
    key: 'Key',
    keyMode: "Key Mode",
    keyString: "Key String",
    keyFile: "Key File",
    selectKeyFile: "Select key file",
    keyFileHint: "Key hidden",

    nodeUrl: "Node URL",
    nodePort: "Node Port",
    nodeUserName: "Node User Name",
    nodePassword: "Node Password",
    nodeDescription: "Node Description",
    nodeStatus: "Node Status",
    nodeStatusOnline: "Online",
    nodeStatusOffline: "Offline",
    nodeStatusError: "Error",

    portRange: "Port Range",

    connectMessage: "Do you want to make this connection?",
    connectError: "Required connection parameters are missing",
    connectError1: "Failed to find route",
    deleteMessage: "Are you sure to delete?",
    fileReadError: "File Read Error",
  },

  //Docker Node
  dockerNode: {
    addServiceTitle: "Add Docker/Podman Service",
    editServiceTitle: "Edit Docker/Podman Service",
    serviceManagement: "Service Management",
    addService: "Add Service",
    local: "local",
    remote: "remote",
    localNode: "local node",
    remoteNode: "remote node",

    serviceName: "Service Name",
    serviceType: "Service Type",
    connectionType: "Link Type",
    address: "Address",
    port: "Port",
    serviceStatus: "Service Status",
    action: "Action",
    mark: "Mark",

    addNode: "Add Node",
    nodeName: "Node Name",
    nodeUrl: "Node URL",
    nodePort: "Node Port",
    nodeUserName: "Node User Name",
    nodePassword: "Node Password",
    nodeDescription: "Node Description",
    nodeStatus: "Node Status",
    nodeStatusOnline: "Online",
    nodeStatusOffline: "Offline",
    nodeStatusError: "Error",

    connectMessage: "Do you want to make this connection?",
    connectError: "Required connection parameters are missing",
    deleteMessage: "Are you sure to delete?"
  },

  nodePanel: {

    connectError: "Remote connection failed",
    connectClose: "Remote connection closed",

    wslNotInstall: "WSL not installed",
    wslNeedUpgrade: "WSL need to upgrade",
    wslSubNotStart: "WSL subsystem not started",
    wslSubNotFound: "WSL subsystem not found",
    dockerNotInstall: "Docker not installed",
    podmanNotInstall: "Podman not installed",

    wantInstallDocker: "Would you Want to install Docker components?",
    wantInstallPodman: "Would you Want to install Podman components?",
  },


  terminal: {
    globalSettingsTitle: "Terminal Node Global Settings",

    closeMessage: "Are you sure to close？",
  },

  xterm: {

    termInitError: "Terminal init error",

    nodePtyInitError: "node-pty uninitialized",

  },

  cmdBar: {
    addCmdGroup: "Add CMD Group",
    editCmdGroup: "Edit CMD Group",
    groupName: "Group Name",

    label: "Label",
    sendString: "Cmd String",
    mark: "Mark",

    addCmd: "Add CMD",
    editCmd: "Edit CMD",

    deleteMessage: "Are you sure to delete?",

  },

  filesystem: {
    title: "File System",

    name: "Name",
    attr: "Attribute",
    modifyTime: "Modified Time",
    size: "Size",
    action: "Action",

    parentFolder: "Parent Folder",
    createFolder: "Create Folder",
    createFile: "Create File",
    uploadFolder: "Upload Folder",
    uploadFile: "Upload File",
    batchDownload: "Batch Download",
    refresh: "Refresh",
    batchDelete: "Batch Delete",
    fullscreen: "Fullscreen",
    fullWidth: "FullWidth",
    rename: "Rename",
    select: "Select",
    save: "Save",
    close: "Close",

    enter: "Enter",
    modify: "Modify",
    folderName: "Folder Name",
    fileName: "File Name",

    modifyNameHint: "The content has not changed, no modification is required",

    sftpError: "SFTP Error",
    termInitError: "Init Error",
    createFolderSuccess: "Create Folder Success",
    createFolderError: "Create Folder Error",
    createFileSuccess: "Create File Success",
    createFileError: "Create File Error",
    renameSuccess: "Rename Success",
    renameError: "Rename error",
    downloadFileStart: "Start downloading file",
    downloadingFile: "Downloading file...",
    downloadFileSuccess: "File Download Success",
    downloadFileError: "File Download Error",
    downloadFolderSuccess: "Folder Download Success",
    downloadFolderError: "Folder Download Error",
    downloadingFolder: "Downloading folder...",
    uploadFileSuccess: "File Upload Success",
    uploadFileError: "File Upload Error",
    uploadFileStart: "Start uploading file",
    uploadingFile: "Uploading file...",
    uploadFolderSuccess: "Folder Upload Success",
    uploadFolderError: "Folder Upload Error",
    uploadingFolder: "Uploading folder...",
    deleteFileSuccess: "File Delete Success",
    deleteFileError: "File Delete Error",
    deleteFolderSuccess: "Folder Delete Success",
    deleteFolderError: "Folder Delete Error",
    saveFileSuccess: "File Save Success",
    saveFileError: "File Save Error",
    readFileSuccess: "File Read Success",
    readFileError: "File Read Error",
    openFileSuccess: "File Open Success",
    openFileError: "File Open Error",

    deleteMessage: "Are you sure to delete?",
  },

  setting: {
    base: "Base Settings",
    basic: "Basic Settings",
    system: "System Settings",

    theme: {
      auto: "Auto",
      light: "Light",
      dark: "Dark",
    },

    userMode: "User Mode",

    mode: {
      normal: "Normal",
      professional: "Professional",
    },

    autoStart: "Auto Start",

    actionSuccess: "操作成功",
    actionFail: "操作失败",
  },

  store: {
    settings: "Settings",
    refresh: "Refresh",
    api: "API Settings",
    add: "添加",
    delete: "Delete",
    edit: "Edit",
    confirm: "确认",
    detail: "Detail",
    appDetail: "App Detail",

    appName: "App Name",
    port: "Network Port",

    storeName: 'Store Name',
    storeApi: 'Store API',

    addStoreApi: "Add Store API",

    installSettings: "Installation Settings",
    defaultVolumeDir: "Default Volume Dir",

    confirmInstall: "Confirm Install？",
    install: "Install",
    installing: "Installing",
    defaultInstall: "Default Install",
    customInstall: "Custom Install",
    installPrompt: "If you are unfamiliar with container installation, please select the default installation. If you are familiar with container installation, you can choose custom installation.",
    installErrorPrompt: "In standard mode, you must first install WSL and related components on the setup page before you can install the Docker application.",

    selectNode: "Select Install Node",

    getApiError: "Get API Error",
    updateAPiSuccess: "Update API Successful",
    updateAPiError: "Update API Failed",
    saveSuccess: "Save Successful",
    saveError: "Save Failed",
  },

  other: {
    addNextPage: "Add Next Page"
  },

  // db
  database: {
    initError: '',
    initSuccess: 'Database initialized successfully',
    initTableError: 'Failed to initialize table',
    initTableSuccess: 'Table initialized successfully',
    connectionError: 'Database connection failed',
    connectionSuccess: 'Database connected successfully',

    accessSuccess: 'Access successfully',
    accessFail: 'Access failed',
    addSuccess: 'Added successfully',
    addFail: 'Added failed',
    writeSuccess: 'Write successfully',
    writeError: 'Write failed',
    updateSuccess: 'Update successfully',
    updateError: 'Update failed',
    deleteSuccess: 'Delete successfully',
    deleteFail: 'Delete failed',
  },

}
