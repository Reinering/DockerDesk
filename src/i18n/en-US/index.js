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
    dockerNode: "Docker Node",
    terminal: "Terminal Node",
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
    addSubSystem: "Add SubSystem",
    addPackage: "Add Package",
    start: "Start",
    stop: "Stop",
    bgStart: "Backgroup",

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

  },

  asslocal: {
    install: "Install",
    reinstall: "Reinstall",
    settings: "Settings",
    panel: "Panel",
    notInstalled: "Not Installed",
    management: "MG",
  },

  panel: {
    tabs: {
      containers: "Containers",
      images: "Images",
      volumes: "Volumes",
      networks: "Networks",
      settings: "Settings",
    },
    containers: {
      create: "Create",

      file: "File",
      folder: "Folder",

      inputHint1: "Select the directory where the compose file is located(Required)",
      inputHint2: "Select the compose file(Optional)",

      hintNote: "Note: Only {0} is supported here. If you use the {1} command, you will be redirected to the \"Images\" page.",
      hintError: "Error: {0} is not installed, please reinstall it on the Assistant page",

      pathIncludeSpace: "Paths with spaces are not supported",
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

      getVolumesError: "Failed to get volume list",
    },
    networks: {
      title: "Network Management",

      create: "Create",
      refresh: "Refresh",

      driver: "Driver",
      subnet: "Subnet",
      gateway: "Gateway",
      containers: "Containers",

      true: "On",
      false: "Off",

      bind: "Bind",
      unbind: "Unbind",

      createNetworkTitle: "Create Network",
      bingContainerTitle: "Bind Container",

      getNetworksError: "Failed to get network list",
      getNetworkInfoError: "Failed to get network details",
    },
    settings: {
      settings: "Settings",
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

      dnsParseError: "DNS string resolution failed",
      fileNotExist: "File does not exist",
      saveSuccess: "Configuration saved successfully",
      saveFail: "Configuration save failed",
      dbSaveSuccess: "DataBase saved successfully",
      dbSaveFail: "DataBase saved failed",
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
    delete: "Delete",
    terminal: "Terminal",
    export: "Export",
    move: "Move",

    wslCreate: "WSL Create",
    create: "Create",
    wslName: "Name",
    rootPrivilege: "Machine with root privileges",
    startNow: "Need to set username/password, please turn on",

    wslDistribution: "WSL Distribution",
    customImage: "Custom Image",
    localImagePath: "Select Local Image Path(Optional)",
    username: "Username",
    password: "Password",

    display: "Display",
    edit: "Edit",

    startSuccess: "Start Successfully",
    startFail: "Start Failure",
    stopSuccess: "Stop Successfully",
    stopFail: "Stop Failure",
    restartSuccess: "Restart Successfully",
    restartFail: "Restart Failure",
    deleteMessage: "Are you sure to delete?",
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
    local: "local",
    remote: "remote",
    localNode: "local node",
    remoteNode: "remote node",
    dockerPanel: "docker panel",

    serviceName: "Service Name",
    serviceType: "Service Type",
    connectionType: "Link Type",
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

    deleteMessage: "Are you sure to delete?",
  },

  setting: {
    theme: {
      auto: "Auto",
      light: "Light",
      dark: "Dark",
    }
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
